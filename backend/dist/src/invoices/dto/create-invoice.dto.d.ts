import { InvoiceStatus } from '@prisma/client';
export declare class CreateInvoiceItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateInvoiceDto {
    customerId: string;
    companyId?: string;
    orderId?: string;
    status?: InvoiceStatus;
    invoiceDate?: string;
    dueDate?: string;
    taxAmount?: number;
    discount?: number;
    notes?: string;
    items: CreateInvoiceItemDto[];
}
