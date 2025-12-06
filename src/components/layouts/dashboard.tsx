import { PanelLeft, PanelLeftIcon } from "lucide-react"
import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"

export function DashboardLayout(
    { children }: {
        children?: React.ReactNode
    }
) {
    return <div className="flex flex-col items-stretch">
        <header className="flex p-2 border-b">
            <SidebarTrigger className="size-8" />
        </header>
        <main className="flex-1 h-0 overflow-y-auto p-4">{children}</main>
    </div>
}