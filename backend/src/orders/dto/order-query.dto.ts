import { IsOptional, IsString } from "class-validator";

export class OrderQueryDto {
  @IsString()
  @IsOptional()
  cliente_uid?: string;
}
