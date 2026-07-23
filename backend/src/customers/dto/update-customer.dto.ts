import { IsString, IsOptional, IsNumber, IsEmail, IsBoolean } from "class-validator";

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  uid?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  papel?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsString()
  @IsOptional()
  cpf_cnpj?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  segmento?: string;

  @IsNumber()
  @IsOptional()
  limite_credito?: number;

  @IsNumber()
  @IsOptional()
  total_gasto?: number;

  @IsString()
  @IsOptional()
  origem?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
