import { PaginateResult } from "@/models/common";

export abstract class Manager<TData, TFilter> {
    
    get supportsPagination() { return false }

    abstract list(filter: TFilter): Promise<TData[]>;
    abstract post(item: TData): Promise<void>;
    abstract put(item: TData): Promise<void>;
    abstract delete(id: number | string): Promise<void>;
}

export interface IPaginatedManager<TData, TFilter> {
    listPaginated(filter: TFilter | { page: number, limit: number }): Promise<PaginateResult<TData>>;
}

export abstract class PaginatedManager<TData, TFilter> extends Manager<TData, TFilter> implements IPaginatedManager<TData, TFilter> {

    get supportsPagination() { return true }

    abstract listPaginated(filter: TFilter & { page: number, limit: number }): Promise<PaginateResult<TData>>;
}