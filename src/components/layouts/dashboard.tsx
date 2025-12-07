import { PanelLeft, PanelLeftIcon } from "lucide-react"
import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";

export function DashboardLayout(
    { breadcrumb, children }: {
        breadcrumb: string[];
        children?: React.ReactNode
    }
) {
    return <div className="flex flex-col items-stretch h-full w-full absolute inset-0">
        <header className="flex p-2 border-b items-center">
            <SidebarTrigger className="size-8" />
            <Breadcrumb className="pl-3">
                <BreadcrumbList>
                    {breadcrumb.map((thing, index) => <>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem className="text-foreground">
                            {thing}
                        </BreadcrumbItem>
                    </>)}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
        <main className="flex-1 h-0 overflow-y-auto p-4">{children}</main>
    </div>
}