import { PaymentStatus } from '@prisma/client';
export declare class CreatePaymentDto {
    invoiceId: string;
    amount: number;
    paymentDate?: string;
    paymentMethod?: string;
    reference?: string;
    status?: PaymentStatus;
    notes?: string;
}
