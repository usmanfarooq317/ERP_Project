export declare class CreateSaleItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateSaleDto {
    customerId: string;
    saleDate?: string;
    taxAmount?: number;
    discount?: number;
    notes?: string;
    items: CreateSaleItemDto[];
}
