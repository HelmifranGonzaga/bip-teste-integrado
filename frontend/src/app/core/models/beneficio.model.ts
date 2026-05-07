export interface Beneficio {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
  version: number;
  cnpj: string | null;
}

export interface BeneficioPayload {
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
  cnpj: string | null;
}

export interface TransferPayload {
  fromId: number;
  toId: number;
  amount: number;
}
