import { Injectable, NotFoundException } from "@nestjs/common";

export interface Customer {
  id: string;
  nome: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  segmento: string;
  limite_credito: number;
  total_gasto: number;
  ultima_compra: string;
  status: string;
  origem: string;
  criado_em: string;
}

let MOCK_CUSTOMERS: Customer[] = [
  { id: "1", nome: "Clínica OdontoPlus Ltda", cpf_cnpj: "12.345.678/0001-90", email: "contato@odontoplus.com.br", telefone: "(65) 3621-1000", segmento: "Clínica", limite_credito: 25000, total_gasto: 18340, ultima_compra: "2026-07-15", status: "lead", origem: "Site", criado_em: "2026-01-15T08:00:00" },
  { id: "2", nome: "Dr. Matheus Victor", cpf_cnpj: "123.456.789-00", email: "matheusvictorfernandesromeu4@gmail.com", telefone: "(65) 99999-0001", segmento: "Consultório", limite_credito: 10000, total_gasto: 8900, ultima_compra: "2026-07-18", status: "cliente", origem: "WhatsApp", criado_em: "2026-02-20T10:30:00" },
  { id: "3", nome: "Sorriso Perfeito Odontologia", cpf_cnpj: "98.765.432/0001-10", email: "adm@sorisoperfeito.com.br", telefone: "(65) 3622-2000", segmento: "Clínica", limite_credito: 50000, total_gasto: 42000, ultima_compra: "2026-07-10", status: "cliente", origem: "Indicação", criado_em: "2025-11-01T14:00:00" },
  { id: "4", nome: "Dra. Ana Beatriz", cpf_cnpj: "987.654.321-00", email: "ana.beatriz@email.com", telefone: "(65) 99999-0002", segmento: "Consultório", limite_credito: 8000, total_gasto: 3200, ultima_compra: "2026-06-20", status: "lead", origem: "Site", criado_em: "2026-04-10T09:15:00" },
  { id: "5", nome: "Faculdade de Odontologia UFMT", cpf_cnpj: "00.000.000/0001-91", email: "lab.odonto@ufmt.br", telefone: "(65) 3615-8000", segmento: "Instituição", limite_credito: 100000, total_gasto: 78500, ultima_compra: "2026-07-05", status: "cliente", origem: "Licitação", criado_em: "2025-06-01T07:00:00" },
  { id: "6", nome: "Dr. Carlos Eduardo", cpf_cnpj: "456.789.123-00", email: "carlos.edu@email.com", telefone: "(65) 99999-0003", segmento: "Consultório", limite_credito: 5000, total_gasto: 1200, ultima_compra: "2026-05-10", status: "lead", origem: "Indicação", criado_em: "2026-05-01T11:00:00" },
  { id: "7", nome: "Dental Mais Distribuidora", cpf_cnpj: "11.222.333/0001-44", email: "compras@dentalmais.com.br", telefone: "(65) 3623-3000", segmento: "Distribuidor", limite_credito: 150000, total_gasto: 112000, ultima_compra: "2026-07-20", status: "cliente", origem: "WhatsApp", criado_em: "2025-03-15T16:00:00" },
  { id: "8", nome: "Dr. Renato Rosa", cpf_cnpj: "789.123.456-00", email: "gestor.renatorosa@gmail.com", telefone: "(65) 99999-0004", segmento: "Consultório", limite_credito: 15000, total_gasto: 6700, ultima_compra: "2026-07-12", status: "cliente", origem: "Site", criado_em: "2026-01-05T13:45:00" },
];

@Injectable()
export class CustomersService {
  async findAll(status?: string, segmento?: string): Promise<Customer[]> {
    let result = [...MOCK_CUSTOMERS];
    if (status) result = result.filter((c) => c.status === status);
    if (segmento) result = result.filter((c) => c.segmento === segmento);
    return result;
  }

  async findOne(id: string): Promise<Customer> {
    const c = MOCK_CUSTOMERS.find((c) => c.id === id);
    if (!c) throw new NotFoundException(`Cliente ${id} não encontrado`);
    return c;
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    const customer: Customer = {
      id: String(MOCK_CUSTOMERS.length + 1),
      nome: data.nome || "",
      cpf_cnpj: data.cpf_cnpj || "",
      email: data.email || "",
      telefone: data.telefone || "",
      segmento: data.segmento || "Consultório",
      limite_credito: data.limite_credito || 0,
      total_gasto: data.total_gasto || 0,
      ultima_compra: data.ultima_compra || new Date().toISOString().split("T")[0],
      status: data.status || "lead",
      origem: data.origem || "Manual",
      criado_em: new Date().toISOString(),
    };
    MOCK_CUSTOMERS.push(customer);
    return customer;
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const idx = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
    if (idx === -1) throw new NotFoundException(`Cliente ${id} não encontrado`);
    MOCK_CUSTOMERS[idx] = { ...MOCK_CUSTOMERS[idx], ...data };
    return MOCK_CUSTOMERS[idx];
  }

  async remove(id: string): Promise<void> {
    const idx = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
    if (idx === -1) throw new NotFoundException(`Cliente ${id} não encontrado`);
    MOCK_CUSTOMERS.splice(idx, 1);
  }
}
