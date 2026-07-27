export interface FlexTotalPagination {
  PAGE: string;
  PAGE_SIZE: string;
}

export interface FlexTotalClientesRequest extends FlexTotalPagination {
  CD_CLIENTE?: string;
  CPF_CNPJ?: string;
  NOME?: string;
  EMAIL?: string;
  TIPO?: string;
  SEGMENTO_CODIGO?: string;
  CIDADE?: string;
  UF?: string;
  CEP?: string;
  ATIVO?: string;
  ULTIMA_COMPRA_DE?: string | null;
  ULTIMA_COMPRA_ATE?: string | null;
  ALTERADO_DESDE?: string | null;
}

export interface FlexTotalClientesItem {
  total_registros?: number;
  id_cliente: number;
  tipo: string;
  cpf_cnpj: string;
  nome_razao_social: string;
  nome_fantasia?: string;
  email?: string;
  email_nfe?: string;
  email_compras?: string;
  email_boleto?: string;
  telefone?: string;
  celular?: string;
  whatsapp?: string;
  endereco_logradouro?: string;
  endereco_numero?: number;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  segmento_codigo?: number;
  segmento_descricao?: string;
  limite_credito?: number;
  data_cadastro?: string;
  ultima_compra?: string | null;
  ativo: boolean;
  updated_at?: string;
}

export type FlexTotalClientesResponse = FlexTotalClientesItem[];

export interface FlexTotalProdutosRequest {
  PAGE?: string;
  PAGE_SIZE?: string;
  CD_ITEM?: string;
  NOME?: string;
  CD_GRUPO?: string;
  CD_SUBGRUPO?: string;
  CD_MARCA?: string;
  NCM?: string;
  ATIVO?: string;
  ALTERADO_DESDE?: string | null;
}

export interface FlexTotalProdutosItem {
  total_registros?: number;
  sku: number;
  nome: string;
  descricao_html?: string;
  categoria_codigo?: number;
  categoria_descricao?: string;
  subcategoria_codigo?: number;
  subcategoria_descricao?: string;
  marca_codigo?: number;
  marca_descricao?: string;
  preco_tabela: number;
  preco_promocional?: number;
  unidade: string;
  ncm?: string;
  controlado_anvisa?: boolean;
  ativo: boolean;
  imagem_url?: string;
  updated_at?: string;
}

// D14 retorna diretamente um array de produtos
export type FlexTotalProdutosResponse = FlexTotalProdutosItem[];

export interface FlexTotalEstoqueRequest {
  DT_INI: string;
  DT_FIM: string;
  CD_ITEM?: (string | number)[];
  PAGE?: string;
  PAGE_SIZE?: string;
}

export interface FlexTotalEstoqueItem {
  cd_item: string;
  qt_atual: number;
  qt_disponivel: number;
}

export type FlexTotalEstoqueResponse = FlexTotalEstoqueItem[];

export interface FlexTotalFichaTecnicaRequest {
  CD_ITEM: string;
}

export interface FlexTotalFichaTecnicaItem {
  ficha_tecnica: string;
}

export type FlexTotalFichaTecnicaResponse = FlexTotalFichaTecnicaItem[];

export interface ProductImageRecord {
  sku: string;
  url: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface SyncResult {
  success: boolean;
  entity: string;
  recordsProcessed: number;
  recordsUpdated: number;
  recordsCreated: number;
  errors: string[];
  durationMs: number;
}

export interface FlexTotalSyncStatus {
  lastSync: Record<string, string | null>;
  results: SyncResult[];
}
