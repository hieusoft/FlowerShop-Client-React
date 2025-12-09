import { useUser } from "@/components/providers/contexts/global-context"
import { Button } from "@/components/ui/button";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Spinner } from "@/components/ui/spinner";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "../user/UserAvatar";

export function HeaderUser (
    { className } : {
        className?: string
    }
) {
    const { user, userBusy } = useUser();

    const loggedIn = !!user?.userName;

    return (
        <NavigationMenuItem className={className}>
            <NavigationMenuTrigger className="block border self-center rounded-full size-12 p-0" hasIcon={false}>
                {userBusy ? <Spinner className="size-5" /> : <UserAvatar className="block size-full" user={user} />}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <h2 className="font-heading px-2 pt-1 pb-4 text-3xl md:sr-only">Membership</h2>
                <div className="flex flex-col md:flex-row md:justify-end md:text-end gap-4 w-full">
                    {userBusy ? <>
                    </> : loggedIn ? <>
                        <div className="px-2 text-sm">
                            <h3 className="font-heading text-2xl py-1">
                                Welcome, {user.fullName}!
                            </h3>
                            <p className="flex flex-col max-sm:items-stretch md:flex-row md:justify-end mt-4 gap-2">
                                <Button variant="secondary" asChild>
                                    <Link href="/profile">
                                        Account settings
                                    </Link>
                                </Button>
                            </p>
                            <p className="flex flex-col max-sm:items-stretch md:flex-row md:justify-end mt-4 gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/logout">
                                        Log out
                                    </Link>
                                </Button>
                            </p>
                        </div>
                    </> : <>
                        <div className="px-2 text-sm">
                            <p className="max-w-80">
                                Sign up for an account and get extra features and exclusive discounts!
                            </p>
                            <p className="flex flex-col max-sm:items-stretch md:flex-row-reverse mt-4 gap-2">
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