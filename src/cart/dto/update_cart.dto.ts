import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

class ProductCartDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class UpdateCartDTO {
  @IsNotEmpty()
  product: ProductCartDTO;

  @IsNumber()
  @IsNotEmpty()
  count: number;
}
