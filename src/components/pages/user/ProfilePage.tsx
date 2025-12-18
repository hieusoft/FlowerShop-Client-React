"use client"
import { UserDeliverySettings } from "@/components/blocks/user/user-delivery-settings";
import { UserInfoSettings } from "@/components/blocks/user/user-info-settings";
import UserNotification from "@/components/blocks/user/user-notification";
import UserOrderHistory from "@/components/blocks/user/user-order-history";
import { useUser } from "@/components/providers/contexts/global-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { BellIcon, TruckIcon, ShoppingBasketIcon, UserIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const user = useUser();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'information';

  return <div className="container max-w-6xl p-8 mx-auto">
    <h2 className="font-heading text-4xl">Account settings</h2>
    <Tabs defaultValue={defaultTab} className="flex flex-col items-stretch md:flex-row md:items-start w-full gap-4 md:gap-6 mt-4">
      <TabsList className="border flex-col basis-1/3 lg:basis-1/4 h-auto *:items-stretch *:w-full! *:text-md! *:py-2 *:h-auto *:justify-start p-2">
        <TabsTrigger value="information">
          <UserIcon className="size-5" />
          Information
        </TabsTrigger>
        <TabsTrigger value="delivery">
          <TruckIcon className="size-5" />
          Delivery
        </TabsTrigger>
        <TabsTrigger value="orders">
          <ShoppingBasketIcon className="size-5" />
          Order tracking
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <BellIcon className="size-5" />
          Notification
        </TabsTrigger>
      </TabsList>
      <TabsContent className="flex-1" value="information">
        <UserInfoSettings />
      </TabsContent>
      <TabsContent className="flex-1" value="delivery">
        <UserDeliverySettings />
      </TabsContent>
      <TabsContent className="flex-1" value="orders">
        <UserOrderHistory />
      </TabsContent>
      <TabsContent className="flex-1" value="notifications">
        <UserNotification />
      </TabsContent>
    </Tabs>
  </div>
}