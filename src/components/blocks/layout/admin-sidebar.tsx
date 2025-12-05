import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { Signature } from "@/components/ui/signature";

export function AdminSidebar({}) {
    return <Sidebar>
      <SidebarHeader>
        <Signature />
      </SidebarHeader>
    </Sidebar>
}