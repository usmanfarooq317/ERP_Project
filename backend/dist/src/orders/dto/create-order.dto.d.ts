import { OrderStatus } from '@prisma/client';
export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateOrderDto {
    customerId: string;
    companyId?: string;
    status?: OrderStatus;
    orderDate?: string;
    dueDate?: string;
    taxAmount?: number;
    discount?: number;
    notes?: string;
    items: CreateOrderItemDto[];
}
