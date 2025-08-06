import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus, InvoiceStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: createPaymentDto.invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (createPaymentDto.amount > Number(invoice.balanceAmount)) {
      throw new BadRequestException('Payment amount cannot exceed invoice balance');
    }

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: createPaymentDto.invoiceId,
        amount: createPaymentDto.amount,
        paymentDate: createPaymentDto.paymentDate ? new Date(createPaymentDto.paymentDate) : new Date(),
        paymentMethod: createPaymentDto.paymentMethod,
        reference: createPaymentDto.reference,
        status: createPaymentDto.status,
        notes: createPaymentDto.notes,
      },
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
      },
    });

    // Update invoice paid amount and balance
    const newPaidAmount = Number(invoice.paidAmount) + createPaymentDto.amount;
    const newBalanceAmount = Number(invoice.total) - newPaidAmount;
    
    // Update invoice status based on payment
    let invoiceStatus = invoice.status;
    if (newBalanceAmount === 0) {
      invoiceStatus = InvoiceStatus.PAID;
    } else if (newPaidAmount > 0 && invoice.status === InvoiceStatus.DRAFT) {
      invoiceStatus = InvoiceStatus.SENT;
    }

    await this.prisma.invoice.update({
      where: { id: createPaymentDto.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        status: invoiceStatus,
      },
    });

    return payment;
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // If amount is being updated, recalculate invoice totals
    if (updatePaymentDto.amount !== undefined && updatePaymentDto.amount !== Number(payment.amount)) {
      const invoice = payment.invoice;
      const oldAmount = Number(payment.amount);
      const newAmount = updatePaymentDto.amount;
      
      const adjustedPaidAmount = Number(invoice.paidAmount) - oldAmount + newAmount;
      const newBalanceAmount = Number(invoice.total) - adjustedPaidAmount;

      if (newBalanceAmount < 0) {
        throw new BadRequestException('Payment amount cannot exceed invoice total');
      }

      // Update invoice
      await this.prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: adjustedPaidAmount,
          balanceAmount: newBalanceAmount,
          status: newBalanceAmount === 0 ? InvoiceStatus.PAID : InvoiceStatus.SENT,
        },
      });
    }

    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update invoice totals
    const invoice = payment.invoice;
    const newPaidAmount = Number(invoice.paidAmount) - Number(payment.amount);
    const newBalanceAmount = Number(invoice.total) - newPaidAmount;

    await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        status: newPaidAmount === 0 ? InvoiceStatus.DRAFT : InvoiceStatus.SENT,
      },
    });

    return this.prisma.payment.delete({
      where: { id },
    });
  }
}

