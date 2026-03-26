import { BeneficioPayload } from '../../core/models/beneficio.model';

export interface SaveBeneficioEvent {
  id: number | null;
  payload: BeneficioPayload;
}

export interface TransferBeneficioEvent {
  fromId: number;
  toId: number;
  amount: number;
}
