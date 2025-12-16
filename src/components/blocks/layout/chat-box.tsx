"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MessageCircleIcon } from "lucide-react"

export function ChatBox() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon-lg" className="size-12 fixed right-4 bottom-4 rounded-full shadow-lg">
                    <MessageCircleIcon className="size-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mx-4 my-2 p-3 overflow-hidden h-120">
                <h2 className="bg-primary text-primary-foreground px-3 py-2.5 -m-3 mb-3">
                    Chatbox
                </h2>
            </PopoverContent>
        </Popover>
    )
}