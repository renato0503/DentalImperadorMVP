import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class ProductQueryDto {
  @IsString()
  @IsOptional()
  categoria?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  take?: number = 100;
}
