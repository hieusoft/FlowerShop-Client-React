"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircleIcon, Send, User, Bot, Clock } from "lucide-react"
import ChatBotService from "@/lib/api/ChatBotService"

interface ChatMessage {
  id: string
  sender: "USER" | "ASSISTANT"
  message: string
  created_at: string
}

export function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await ChatBotService.list()
        setMessages(res.data.messages.messages)
      } catch (error) {
        console.error(error)
      }
    }
    fetchMessages()
  }, [])

  useEffect(() => {
    if (!scrollAreaRef.current) return
    const viewport = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "USER",
      message: input,
      created_at: new Date().toISOString(),
    }

    setInput("")
    setMessages(prev => [...prev, userMessage])

    try {
      const res = await ChatBotService.post(input)
      const botMessage: ChatMessage = {
        id: res.data.id?.toString() ?? crypto.randomUUID(),
        sender: "ASSISTANT",
        message: res.data.response,
        created_at: res.data.created_at ?? new Date().toISOString(),
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error(error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed right-4 bottom-4 size-12 rounded-full shadow-lg"
        >
          <MessageCircleIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="flex h-[500px] w-[380px] flex-col p-0 rounded-lg border shadow-xl"
      >
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <h2 className="text-base font-semibold">Virtual Assistant</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="p-4 space-y-4 min-h-full">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Start a conversation…
                </div>
              ) : (
                messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${
                      m.sender === "USER" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary">
                        {m.sender === "USER" ? (
                          <User size={14} />
                        ) : (
                          <Bot size={14} />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`max-w-[calc(100%-80px)] ${
                        m.sender === "USER" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                          m.sender === "USER"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {m.message}
                      </div>

                      <div
                        className={`mt-1 flex items-center gap-1 text-xs text-muted-foreground ${
                          m.sender === "USER" ? "justify-end" : ""
                        }`}
                      >
                        <Clock size={10} />
                        {new Date(m.created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex gap-2 border-t bg-background p-3">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
