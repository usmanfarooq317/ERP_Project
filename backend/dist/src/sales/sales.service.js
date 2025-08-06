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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SalesService = class SalesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSaleDto, userId) {
        const { items, ...saleData } = createSaleDto;
        let subtotal = 0;
        const saleItems = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            const itemTotal = item.quantity * item.unitPrice;
            subtotal += itemTotal;
            saleItems.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: itemTotal,
            });
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Sale not found');
        }
        return sale;
    }
    async update(id, updateSaleDto) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                saleItems: true,
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        const { items, ...saleData } = updateSaleDto;
        if (items) {
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
            await this.prisma.saleItem.deleteMany({
                where: { saleId: id },
            });
            let subtotal = 0;
            const saleItems = [];
            for (const item of items) {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
                }
                const itemTotal = item.quantity * item.unitPrice;
                subtotal += itemTotal;
                saleItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: itemTotal,
                });
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
    async remove(id) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                saleItems: true,
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
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
        await this.prisma.saleItem.deleteMany({
            where: { saleId: id },
        });
        return this.prisma.sale.delete({
            where: { id },
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map