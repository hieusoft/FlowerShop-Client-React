export type Occasion = {
    id: string,
    name: string,
    description: string,
    subOccasions: SubOccasion[],
}

export type SubOccasion = {
    id?: string,
    _id?: string,
    name: string,
    description: string,
    occasionId: string,
}