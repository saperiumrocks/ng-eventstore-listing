export interface PlaybackList {
  add: (
    rowId: string,
    revision: number,
    data: any,
    meta: any,
    callback: (error: any) => void
  ) => void;
  update: (
    rowId: string,
    revision: number,
    oldData: any,
    newData: any,
    meta: any,
    callback: (error: any) => void
  ) => void;
  delete: (rowId: string, callback: (error: any) => void) => void;
  get: (rowId: string, callback: (error: any, item: any) => void) => void;
}
