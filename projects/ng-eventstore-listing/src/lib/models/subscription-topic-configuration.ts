import { OffsetsResponse } from './index';
import { Observable } from 'rxjs/Observable';

export interface SubscriptionTopicConfiguration {
  // Old Implementation
  streamKey?: string;
  context?: string;

  idPropertyName: string;
  getOffsetsFunction(contextIds: string[]): Observable<OffsetsResponse>;
}
