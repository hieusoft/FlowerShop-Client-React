export type HasTimestamp = {
    createdAt: string,
    updatedAt: string,
}

export type PaginateResult<T> = {
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
    data: T[]
}