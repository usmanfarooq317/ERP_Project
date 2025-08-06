import { QuoteStatus } from '@prisma/client';
export declare class CreateQuoteItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateQuoteDto {
    customerId: string;
    companyId?: string;
    status?: QuoteStatus;
    quoteDate?: string;
    validUntil?: string;
    taxAmount?: number;
    discount?: number;
    notes?: string;
    items: CreateQuoteItemDto[];
}
