import { Tracing } from "trace_events"

export type User = {
    userId: number,
    fullName: string,
    userName: string,
    avatar?: string,
    email: string,
}

export type UserMn = {
    userId: number,
    fullName: string,
    userName: string,
    email: string,
    emailVerified:string,
    roles:[]
}


export type UserQuery = {
    page?: number,
    limit: number,
}