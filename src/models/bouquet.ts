import { HasTimestamp } from "./common";

export type Bouquet = {
    name: string,
    description: string,
    price: number,
    subOccasionId: number,
    images: string[],
} & HasTimestamp