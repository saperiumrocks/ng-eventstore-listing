export interface StateFunctions {
    getState: (id?: string) => any;
    setState: (id: string, data: any) => void;
}
