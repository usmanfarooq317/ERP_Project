import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        invoice: {
            customer: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                country: string | null;
                postalCode: string | null;
                companyId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            customerId: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date | null;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            userId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string | null;
            invoiceDate: Date;
            invoiceNo: string;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            balanceAmount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        invoiceId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: string | null;
        reference: string | null;
    }>;
    findAll(): Promise<({
        invoice: {
            customer: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                country: string | null;
                postalCode: string | null;
                companyId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            customerId: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date | null;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            userId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string | null;
            invoiceDate: Date;
            invoiceNo: string;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            balanceAmount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        invoiceId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: string | null;
        reference: string | null;
    })[]>;
    findOne(id: string): Promise<{
        invoice: {
            customer: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                country: string | null;
                postalCode: string | null;
                companyId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            customerId: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date | null;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            userId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string | null;
            invoiceDate: Date;
            invoiceNo: string;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            balanceAmount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        invoiceId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: string | null;
        reference: string | null;
    }>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        invoice: {
            customer: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                country: string | null;
                postalCode: string | null;
                companyId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            customerId: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date | null;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            userId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            orderId: string | null;
            invoiceDate: Date;
            invoiceNo: string;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            balanceAmount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        invoiceId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: string | null;
        reference: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        invoiceId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentDate: Date;
        paymentMethod: string | null;
        reference: string | null;
    }>;
}
