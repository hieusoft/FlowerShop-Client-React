
import { PanelLeft, PanelLeftIcon } from "lucide-react"
import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";

export function DashboardLayout(
    { breadcrumb, children }: {
        breadcrumb: string[];
        children?: React.ReactNode
    }
) {
    return <div className="flex flex-col items-stretch h-full w-full absolute inset-0">
        <header className="dark bg-sidebar text-sidebar-foreground md:z-1000 md:-ml-px flex p-2 border-b items-center">
            <SidebarTrigger className="size-8" />
            <Breadcrumb className="pl-3">
                <BreadcrumbList>
                    {breadcrumb.map((thing, index) => <Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem className={cn(
                            index == breadcrumb.length - 1 ? "text-sidebar-foreground" : ""
                        )}>
                            {thing}
                        </BreadcrumbItem>
                    </Fragment>)}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
        <main className="flex-1 flex flex-col h-0 overflow-y-auto p-4">{children}</main>
    </div>
}