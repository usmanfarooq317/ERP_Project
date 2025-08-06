import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuoteDto: CreateQuoteDto, userId: string) {
    const { items, ...quoteData } = createQuoteDto;

    // Calculate totals
    let subtotal = 0;
    const quoteItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;

      quoteItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal,
      });
    }

    const total = subtotal + (quoteData.taxAmount || 0) - (quoteData.discount || 0);

    // Generate quote number
    const quoteCount = await this.prisma.quote.count();
    const quoteNo = `QUO-${String(quoteCount + 1).padStart(4, '0')}`;

    const quote = await this.prisma.quote.create({
      data: {
        quoteNo,
        customerId: quoteData.customerId,
        companyId: quoteData.companyId,
        userId,
        status: quoteData.status,
        quoteDate: quoteData.quoteDate ? new Date(quoteData.quoteDate) : new Date(),
        validUntil: quoteData.validUntil ? new Date(quoteData.validUntil) : null,
        subtotal,
        taxAmount: quoteData.taxAmount || 0,
        discount: quoteData.discount || 0,
        total,
        notes: quoteData.notes,
        quoteItems: {
          create: quoteItems,
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
        quoteItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return quote;
  }

  async findAll() {
    return this.prisma.quote.findMany({
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
        quoteItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({
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
        quoteItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    return quote;
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    const { items, ...quoteData } = updateQuoteDto;

    if (items) {
      // Delete existing quote items
      await this.prisma.quoteItem.deleteMany({
        where: { quoteId: id },
      });

      // Calculate new totals
      let subtotal = 0;
      const quoteItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

      for (const item of items) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;

        quoteItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: itemTotal,
        });
      }

      const total = subtotal + Number(quoteData.taxAmount || quote.taxAmount) - Number(quoteData.discount || quote.discount);

      return this.prisma.quote.update({
        where: { id },
        data: {
          ...quoteData,
          subtotal,
          total,
          quoteItems: {
            create: quoteItems,
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
          quoteItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return this.prisma.quote.update({
      where: { id },
      data: quoteData,
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
        quoteItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    // Delete quote items first
    await this.prisma.quoteItem.deleteMany({
      where: { quoteId: id },
    });

    // Delete the quote
    return this.prisma.quote.delete({
      where: { id },
    });
  }
}

