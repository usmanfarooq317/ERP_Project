import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteStatus } from '@prisma/client';

export class CreateQuoteItemDto {
  @IsString()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CreateQuoteDto {
  @IsString()
  customerId: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus = QuoteStatus.DRAFT;

  @IsDateString()
  @IsOptional()
  quoteDate?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number = 0;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];
}

