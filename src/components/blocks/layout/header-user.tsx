import { useUser } from "@/components/providers/contexts/global-context"
import { Button } from "@/components/ui/button";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Spinner } from "@/components/ui/spinner";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export function HeaderUser (
    { className } : {
        className?: string
    }
) {
    const { user, userBusy } = useUser();

    return (
        <NavigationMenuItem className={className}>
            <NavigationMenuTrigger className="border rounded-full size-12 p-0" hasIcon={false}>
                {userBusy ? <Spinner className="size-5" /> : <UserIcon className="size-5" />}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <div className="flex md:justify-end md:text-end gap-4 w-full">
                    {userBusy ? <>
                    </> : user?.id ? <>
                    </> : <>
                        <div className="px-2 text-sm">
                            <p className="max-w-80">
                                Sign up for an account and get extra features and exclusive discounts!
                            </p>
                            <p className="flex md:flex-row-reverse mt-4 gap-2">
                                <Button variant="secondary" asChild>
                                    <Link href="/login">
                                        Log in
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/register">
                                        Create an account
                                    </Link>
                                </Button>
                            </p>
                        </div>
                    </>}
                </div>
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}