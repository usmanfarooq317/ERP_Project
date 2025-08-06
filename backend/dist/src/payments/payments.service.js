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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPaymentDto) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: createPaymentDto.invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        if (createPaymentDto.amount > Number(invoice.balanceAmount)) {
            throw new common_1.BadRequestException('Payment amount cannot exceed invoice balance');
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
        const newPaidAmount = Number(invoice.paidAmount) + createPaymentDto.amount;
        const newBalanceAmount = Number(invoice.total) - newPaidAmount;
        let invoiceStatus = invoice.status;
        if (newBalanceAmount === 0) {
            invoiceStatus = client_1.InvoiceStatus.PAID;
        }
        else if (newPaidAmount > 0 && invoice.status === client_1.InvoiceStatus.DRAFT) {
            invoiceStatus = client_1.InvoiceStatus.SENT;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async update(id, updatePaymentDto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                invoice: true,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (updatePaymentDto.amount !== undefined && updatePaymentDto.amount !== Number(payment.amount)) {
            const invoice = payment.invoice;
            const oldAmount = Number(payment.amount);
            const newAmount = updatePaymentDto.amount;
            const adjustedPaidAmount = Number(invoice.paidAmount) - oldAmount + newAmount;
            const newBalanceAmount = Number(invoice.total) - adjustedPaidAmount;
            if (newBalanceAmount < 0) {
                throw new common_1.BadRequestException('Payment amount cannot exceed invoice total');
            }
            await this.prisma.invoice.update({
                where: { id: invoice.id },
                data: {
                    paidAmount: adjustedPaidAmount,
                    balanceAmount: newBalanceAmount,
                    status: newBalanceAmount === 0 ? client_1.InvoiceStatus.PAID : client_1.InvoiceStatus.SENT,
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
    async remove(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                invoice: true,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const invoice = payment.invoice;
        const newPaidAmount = Number(invoice.paidAmount) - Number(payment.amount);
        const newBalanceAmount = Number(invoice.total) - newPaidAmount;
        await this.prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                paidAmount: newPaidAmount,
                balanceAmount: newBalanceAmount,
                status: newPaidAmount === 0 ? client_1.InvoiceStatus.DRAFT : client_1.InvoiceStatus.SENT,
            },
        });
        return this.prisma.payment.delete({
            where: { id },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map