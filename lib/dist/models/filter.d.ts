import { FilterOperator, GroupBooleanOperator } from '../enums';
export interface Filter {
    field: string;
    type?: string;
    operator: FilterOperator;
    group?: string;
    groupBooleanOperator?: GroupBooleanOperator;
    from?: number;
    to?: number;
    value?: any;
    caseInsensitive?: boolean;
}
