import { IsOptional, IsString } from "class-validator";

export class ProductQueryDto {
  @IsString()
  @IsOptional()
  categoria?: string;
}
