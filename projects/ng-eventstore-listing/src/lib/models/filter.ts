import { FilterOperator } from '../enums/filter-types';

export interface Filter {
  field: string;
  operator: FilterOperator;
  from?: number;
  to?: number;
  value?: any;
}
