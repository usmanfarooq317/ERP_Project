import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { items, ...orderData } = createOrderDto;

    // Calculate totals
    let subtotal = 0;
    const orderItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal,
      });
    }

    const total = subtotal + Number(orderData.taxAmount || 0) - Number(orderData.discount || 0);

    // Generate order number
    const orderCount = await this.prisma.order.count();
    const orderNo = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    const order = await this.prisma.order.create({
      data: {
        orderNo,
        customerId: orderData.customerId,
        companyId: orderData.companyId,
        userId,
        status: orderData.status,
        orderDate: orderData.orderDate ? new Date(orderData.orderDate) : new Date(),
        dueDate: orderData.dueDate ? new Date(orderData.dueDate) : null,
        subtotal,
        taxAmount: orderData.taxAmount || 0,
        discount: orderData.discount || 0,
        total,
        notes: orderData.notes,
        orderItems: {
          create: orderItems,
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
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
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
        orderItems: {
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
    const order = await this.prisma.order.findUnique({
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
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const { items, ...orderData } = updateOrderDto;

    if (items) {
      // Delete existing order items
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      // Calculate new totals
      let subtotal = 0;
      const orderItems: { productId: string; quantity: number; unitPrice: number; total: number; }[] = [];

      for (const item of items) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: itemTotal,
        });
      }

      const total = subtotal + Number(orderData.taxAmount || order.taxAmount) - Number(orderData.discount || order.discount);

      return this.prisma.order.update({
        where: { id },
        data: {
          ...orderData,
          subtotal,
          total,
          orderItems: {
            create: orderItems,
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
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: orderData,
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
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Delete order items first
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Delete the order
    return this.prisma.order.delete({
      where: { id },
    });
  }
}

