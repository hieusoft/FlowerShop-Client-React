import { HasTimestamp } from "./common";

export type Bouquet = {
    id: string,
    name: string,
    description: string,
    price: number,
    subOccasionId: string,
    images: string[],
} & HasTimestamp

export type BouquetQuery = {
    search_query?: string,
    name?: string,
    subOccasionId?: string,
    minPrice?: number,
    maxPrice?: number,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit: number,
    sortBy?: string,
    order?: "asc" | "desc"
}