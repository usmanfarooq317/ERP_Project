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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCustomerDto) {
        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email: createCustomerDto.email },
        });
        if (existingCustomer) {
            throw new common_1.ConflictException('Customer with this email already exists');
        }
        const customer = await this.prisma.customer.create({
            data: {
                ...createCustomerDto,
                companyId: createCustomerDto.companyId || null,
            },
            include: {
                company: true,
            },
        });
        return customer;
    }
    async findAll() {
        return this.prisma.customer.findMany({
            include: {
                company: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                company: true,
                orders: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
                quotes: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
                invoices: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer;
    }
    async update(id, updateCustomerDto) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return this.prisma.customer.update({
            where: { id },
            data: updateCustomerDto,
            include: {
                company: true,
            },
        });
    }
    async remove(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return this.prisma.customer.update({
            where: { id },
            data: { isActive: false },
            include: {
                company: true,
            },
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map