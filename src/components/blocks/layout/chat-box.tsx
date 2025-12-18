"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MessageCircleIcon, Send, User, Bot, Clock } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Dữ liệu chat mẫu
const sampleMessages = [
  { id: 1, sender: "bot", text: "Xin chào! Tôi có thể giúp gì được cho bạn?", time: "10:00" },
  { id: 2, sender: "user", text: "Xin chào! Tôi muốn tìm hiểu về dịch vụ của bạn.", time: "10:01" },
  { id: 3, sender: "bot", text: "Chào mừng bạn! Chúng tôi cung cấp nhiều dịch vụ khác nhau. Bạn quan tâm đến lĩnh vực nào ạ?", time: "10:02" },
  { id: 4, sender: "user", text: "Tôi muốn biết về dịch vụ tư vấn thiết kế website.", time: "10:03" },
  { id: 5, sender: "bot", text: "Dịch vụ thiết kế website của chúng tôi bao gồm: website doanh nghiệp, thương mại điện tử, và portfolio. Bạn có nhu cầu loại nào ạ?", time: "10:04" },
  { id: 6, sender: "user", text: "Website doanh nghiệp. Bạn có thể gửi tôi báo giá được không?", time: "10:05" },
  { id: 7, sender: "bot", text: "Tất nhiên rồi! Để cung cấp báo giá chính xác, tôi cần biết thêm một số thông tin: 1. Quy mô công ty của bạn? 2. Bạn cần những tính năng đặc biệt nào? 3. Thời hạn hoàn thành mong muốn?", time: "10:06" },
]

export function ChatBox() {
  const [messages, setMessages] = useState(sampleMessages)
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return

    const newUserMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const newBotMessage = {
      id: messages.length + 2,
      sender: "bot",
      text: `Cảm ơn bạn đã nhắn: "${input}". Đội ngũ của chúng tôi sẽ phản hồi sớm nhất có thể!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, newUserMessage, newBotMessage])
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          size="icon" 
          className="size-12 fixed right-4 bottom-4 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        >
          <MessageCircleIcon className="size-6" />
          <span className="sr-only">Mở chat</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] h-[500px] flex flex-col p-0 border shadow-xl"
        align="end"
        sideOffset={10}
      >
        {/* Header - chiều cao cố định */}
        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2 rounded-full">
              <MessageCircleIcon className="size-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Trợ lý ảo</h2>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <div className="size-2 rounded-full bg-green-400 animate-pulse"></div>
                <span>Đang trực tuyến</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat area - chiếm không gian còn lại */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div 
              ref={viewportRef}
              className="p-4 h-full"
            >
              <div className="space-y-4 pb-4"> {/* Thêm padding bottom để không bị input che */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className={`size-8 flex-shrink-0 ${message.sender === "user" ? "bg-primary" : "bg-muted"}`}>
                      <AvatarFallback className={`${message.sender === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                        {message.sender === "user" ? 
                          <User className="size-4" /> : 
                          <Bot className="size-4" />
                        }
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"} max-w-[calc(100%-3.5rem)]`}>
                      <div
                        className={`rounded-2xl px-4 py-2.5 break-words ${message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted rounded-tl-none"
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1.5 text-xs text-muted-foreground`}>
                        <Clock className="size-3" />
                        <span>{message.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Input area - chiều cao cố định */}
        <div className="border-t p-4 bg-background flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tin nhắn của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              size="icon" 
              className="shrink-0"
              disabled={!input.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Nhấn Enter để gửi • Shift + Enter để xuống dòng
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}