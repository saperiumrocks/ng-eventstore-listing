export interface ListHeader {
  displayName?: string;
  sortProperty?: string;
  className?: string;
}

export interface ListHeaderGroups {
  generalRowClassName?: string;
  groups: ListHeaderGroup[];
}

export interface ListHeaderGroup {
  className?: string;
  listHeaders: ListHeader[];
}
