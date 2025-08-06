"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto, userId) {
        const { items, ...orderData } = createOrderDto;
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const { items, ...orderData } = updateOrderDto;
        if (items) {
            await this.prisma.orderItem.deleteMany({
                where: { orderId: id },
            });
            let subtotal = 0;
            const orderItems = [];
            for (const item of items) {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
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
    async remove(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        await this.prisma.orderItem.deleteMany({
            where: { orderId: id },
        });
        return this.prisma.order.delete({
            where: { id },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map