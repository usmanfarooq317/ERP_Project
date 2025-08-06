import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto, userId: string) {
    const { items, ...invoiceData } = createInvoiceDto;

    // Calculate totals
    let subtotal = 0;
    const invoiceItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;

      invoiceItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal,
      });
    }

    const total = subtotal + Number(invoiceData.taxAmount || 0) - Number(invoiceData.discount || 0);
    const balanceAmount = total; // Initially, balance equals total

    // Generate invoice number
    const invoiceCount = await this.prisma.invoice.count();
    const invoiceNo = `INV-${String(invoiceCount + 1).padStart(4, '0')}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNo,
        customerId: invoiceData.customerId,
        companyId: invoiceData.companyId,
        userId,
        orderId: invoiceData.orderId,
        status: invoiceData.status,
        invoiceDate: invoiceData.invoiceDate ? new Date(invoiceData.invoiceDate) : new Date(),
        dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : null,
        subtotal,
        taxAmount: invoiceData.taxAmount || 0,
        discount: invoiceData.discount || 0,
        total,
        paidAmount: 0,
        balanceAmount,
        notes: invoiceData.notes,
        invoiceItems: {
          create: invoiceItems,
        },
      },
      include: {
        customer: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: true,
        invoiceItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    return invoice;
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        customer: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: true,
        invoiceItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: true,
        invoiceItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const { items, ...invoiceData } = updateInvoiceDto;

    if (items) {
      // Delete existing invoice items
      await this.prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      // Calculate new totals
      let subtotal = 0;
      const invoiceItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

      for (const item of items) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;

        invoiceItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: itemTotal,
        });
      }

      const total = subtotal + Number(invoiceData.taxAmount || invoice.taxAmount) - Number(invoiceData.discount || invoice.discount);
      const balanceAmount = total - Number(invoice.paidAmount);

      return this.prisma.invoice.update({
        where: { id },
        data: {
          ...invoiceData,
          subtotal,
          total,
          balanceAmount,
          invoiceItems: {
            create: invoiceItems,
          },
        },
        include: {
          customer: true,
          company: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          order: true,
          invoiceItems: {
            include: {
              product: true,
            },
          },
          payments: true,
        },
      });
    }

    return this.prisma.invoice.update({
      where: { id },
      data: invoiceData,
      include: {
        customer: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: true,
        invoiceItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  async remove(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Delete invoice items first
    await this.prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    // Delete payments
    await this.prisma.payment.deleteMany({
      where: { invoiceId: id },
    });

    // Delete the invoice
    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}

