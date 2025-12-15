import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/models/user";
import { AvatarProps } from "@radix-ui/react-avatar";
import { UserIcon } from "lucide-react";

export function UserAvatar( 
    { user, ...props } : {
        user?: User | undefined | null
    } & AvatarProps
) {
    return <Avatar {...props}>
        {!!user && (
            <AvatarImage 
                className="block"
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
        )}
        <AvatarFallback className="text-2xl">
            {user?.userName?.charAt(0) || <UserIcon className="size-5" />}
        </AvatarFallback>
    </Avatar>
}