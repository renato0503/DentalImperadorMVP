import { IsString, IsOptional, IsNumber, IsEmail } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  nome: string;

  @IsString()
  uid: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role?: string;

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
