import { FilterOperator } from '../enums/filter-operator';

export interface Filter {
  field: string;
  operator: FilterOperator;
  from?: number;
  to?: number;
  value?: any;
}
