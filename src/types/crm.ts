export type LeadOrigin = 'Indicação' | 'Instagram' | 'Google / Site' | 'Cliente Recorrente' | 'Prospecção Ativa';

// Alterado: 'Concluído' -> 'Realizado' | 'Recusado' -> 'Cancelado'
export type ProposalStatus = 'Em Negociação' | 'Confirmado' | 'Realizado' | 'Cancelado' | 'Recusado';

// Alterado com os novos motivos específicos de locação, A&B e falta de retorno
export type RefusalReason = 
  | 'Orçamento de locação acima do budget'
  | 'Orçamento de A&B acima do budget'
  | 'Data indisponível'
  | 'Capacidade da sala incompatível'
  | 'Fechou com concorrente'
  | 'Evento cancelado'
  | 'Falta de retorno';

export interface SectorBreakdown {
  eventRoom: number;     // Sala de evento
  lodging: number;       // Hospedagem
  coffeeBreak: number;   // Coffee break
  food: number;          // Alimentação (A&B)
  parking: number;       // Estacionamento
}

export interface ClientEvent {
  id: string;
  clientName: string;
  companyName: string;
  isReturningClient: boolean;
  contactDate: string;        // YYYY-MM-DD
  origin: LeadOrigin;
  proposalSentDate: string;   // YYYY-MM-DD
  proposalDeadline: string;   // YYYY-MM-DD (Deadline da proposta)
  eventDate: string;          // YYYY-MM-DD (Data do evento)
  paymentDeadline?: string;   // YYYY-MM-DD (Data limite para quitação se Confirmado)
  roomName: string;
  status: ProposalStatus;
  sectors: SectorBreakdown;
  totalValue: number;
  amountPaid: number;
  invoiceSent: boolean;
  refusalReason?: RefusalReason;
  feedback?: string;
}