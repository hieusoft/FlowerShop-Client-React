export type Notification = {
    notificationId: number,
    userId: number,
    notification: {
        title: string,
        content: string
    }
}