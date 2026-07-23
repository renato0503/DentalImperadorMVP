import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

export interface Customer {
  id: string;
  uid: string;
  nome: string;
  email: string;
  papel: string;
  ativo: boolean;
  cpf_cnpj: string | null;
  telefone: string | null;
  segmento: string | null;
  limite_credito: number | null;
  total_gasto: number | null;
  ultima_compra: string | null;
  origem: string | null;
  status: string;
  criado_em: Date;
}

function toCustomer(user: any): Customer {
  return {
    id: user.id,
    uid: user.uid,
    nome: user.nome,
    email: user.email,
    papel: user.papel,
    ativo: user.ativo,
    cpf_cnpj: user.cpf_cnpj,
    telefone: user.telefone,
    segmento: user.segmento,
    limite_credito: user.limite_credito ? Number(user.limite_credito) : null,
    total_gasto: user.total_gasto ? Number(user.total_gasto) : null,
    ultima_compra: user.ultima_compra
      ? user.ultima_compra.toISOString().split("T")[0]
      : null,
    origem: user.origem,
    status: user.status || user.papel,
    criado_em: user.criado_em,
  };
}

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, segmento?: string): Promise<Customer[]> {
    const where: any = {};
    if (status) where.status = status;
    if (segmento) where.segmento = segmento;

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { nome: "asc" },
    });
    return users.map(toCustomer);
  }

  async findOne(id: string): Promise<Customer> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Cliente ${id} não encontrado`);
    }
    return toCustomer(user);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const user = await this.prisma.user.create({
      data: {
        uid: dto.uid,
        nome: dto.nome,
        email: dto.email,
        papel: dto.papel || "cliente",
        cpf_cnpj: dto.cpf_cnpj,
        telefone: dto.telefone,
        segmento: dto.segmento,
        limite_credito: dto.limite_credito,
        total_gasto: dto.total_gasto,
        origem: dto.origem || "Manual",
      },
    });
    return toCustomer(user);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return toCustomer(user);
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Cliente ${id} não encontrado`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Cliente ${id} não encontrado`);
      }
      throw error;
    }
  }
}
