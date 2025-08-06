import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto, userId: string) {
    const { items, ...saleData } = createSaleDto;

    // Calculate totals
    let subtotal = 0;
    const saleItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;

      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal,
      });

      // Update product quantity (reduce stock)
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    const total = subtotal + (saleData.taxAmount || 0) - (saleData.discount || 0);

    // Generate sale number
    const saleCount = await this.prisma.sale.count();
    const saleNo = `SAL-${String(saleCount + 1).padStart(4, '0')}`;

    const sale = await this.prisma.sale.create({
      data: {
        saleNo,
        customerId: saleData.customerId,
        userId,
        saleDate: saleData.saleDate ? new Date(saleData.saleDate) : new Date(),
        subtotal,
        taxAmount: saleData.taxAmount || 0,
        discount: saleData.discount || 0,
        total,
        notes: saleData.notes,
        saleItems: {
          create: saleItems,
        },
      },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return sale;
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        saleItems: {
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
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    const { items, ...saleData } = updateSaleDto;

    if (items) {
      // Restore product quantities from old sale items
      for (const oldItem of sale.saleItems) {
        await this.prisma.product.update({
          where: { id: oldItem.productId },
          data: {
            quantity: {
              increment: oldItem.quantity,
            },
          },
        });
      }

      // Delete existing sale items
      await this.prisma.saleItem.deleteMany({
        where: { saleId: id },
      });

      // Calculate new totals and update product quantities
      let subtotal = 0;
      const saleItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

      for (const item of items) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;

        saleItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: itemTotal,
        });

        // Update product quantity (reduce stock)
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      const total = subtotal + Number(saleData.taxAmount || sale.taxAmount) - Number(saleData.discount || sale.discount);

      return this.prisma.sale.update({
        where: { id },
        data: {
          ...saleData,
          subtotal,
          total,
          saleItems: {
            create: saleItems,
          },
        },
        include: {
          customer: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          saleItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return this.prisma.sale.update({
      where: { id },
      data: saleData,
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Restore product quantities
    for (const item of sale.saleItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    }

    // Delete sale items first
    await this.prisma.saleItem.deleteMany({
      where: { saleId: id },
    });

    // Delete the sale
    return this.prisma.sale.delete({
      where: { id },
    });
  }
}

