
import { UserContext } from "@/components/providers/contexts/user-context";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { apiInstance, serverApiInstance } from "@/lib/api";
import { Occasion } from "@/models/occasion";
import Link from "next/link";

export async function HeaderOccasions (
    // { } : { }
) {
    const occasions = (await serverApiInstance.get("occasions")).data as Occasion[];

    return <>
        <h2 className="font-heading px-2 pt-1 pb-4 text-3xl md:sr-only">Occasions</h2>
        <div className="grid gap-4 auto-fill-50 w-max max-w-full">
            {occasions.map(occasion => (
                <div className="flex flex-col" key={occasion.id}>
                    <h3 className="font-heading px-2 py-1 text-2xl">{occasion.name}</h3>
                    {occasion.subOccasions.map(subOccasion => (
                        <NavigationMenuLink asChild key={subOccasion._id}>
                            <Link href="/">
                                {subOccasion.name}
                            </Link>
                        </NavigationMenuLink>
                    ))}
                </div>
            ))}
        </div>
    </>
}