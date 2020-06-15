export interface Delta {
  offset: number;
  events: DeltaEvent[];
}

export interface DeltaEvent {
  id?: string;
  event: string;
  payload?: any;
  metadata?: any;
}
