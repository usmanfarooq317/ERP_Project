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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoicesService = class InvoicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createInvoiceDto, userId) {
        const { items, ...invoiceData } = createInvoiceDto;
        let subtotal = 0;
        const invoiceItems = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
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
        const balanceAmount = total;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Invoice not found');
        }
        return invoice;
    }
    async update(id, updateInvoiceDto) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        const { items, ...invoiceData } = updateInvoiceDto;
        if (items) {
            await this.prisma.invoiceItem.deleteMany({
                where: { invoiceId: id },
            });
            let subtotal = 0;
            const invoiceItems = [];
            for (const item of items) {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
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
    async remove(id) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        await this.prisma.invoiceItem.deleteMany({
            where: { invoiceId: id },
        });
        await this.prisma.payment.deleteMany({
            where: { invoiceId: id },
        });
        return this.prisma.invoice.delete({
            where: { id },
        });
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map