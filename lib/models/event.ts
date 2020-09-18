export interface Event {
  aggregateId: string;
  aggregate: string;
  payload: {
    name: string;
    payload: any;
    _meta?: {
      fromEvent: {
        payload: {
          name: string;
          payload: any;
        }
      }
    }
  };
}
