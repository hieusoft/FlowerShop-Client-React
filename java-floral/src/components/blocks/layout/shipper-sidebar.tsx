import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { Signature } from "@/components/ui/signature";

export function ShipperSidebar({}) {
    return <Sidebar>
      <SidebarHeader>
        <Signature />
      </SidebarHeader>
    </Sidebar>
}