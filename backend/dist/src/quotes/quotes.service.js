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
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuotesService = class QuotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createQuoteDto, userId) {
        const { items, ...quoteData } = createQuoteDto;
        let subtotal = 0;
        const quoteItems = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Quote not found');
        }
        return quote;
    }
    async update(id, updateQuoteDto) {
        const quote = await this.prisma.quote.findUnique({
            where: { id },
        });
        if (!quote) {
            throw new common_1.NotFoundException('Quote not found');
        }
        const { items, ...quoteData } = updateQuoteDto;
        if (items) {
            await this.prisma.quoteItem.deleteMany({
                where: { quoteId: id },
            });
            let subtotal = 0;
            const quoteItems = [];
            for (const item of items) {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
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
    async remove(id) {
        const quote = await this.prisma.quote.findUnique({
            where: { id },
        });
        if (!quote) {
            throw new common_1.NotFoundException('Quote not found');
        }
        await this.prisma.quoteItem.deleteMany({
            where: { quoteId: id },
        });
        return this.prisma.quote.delete({
            where: { id },
        });
    }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map