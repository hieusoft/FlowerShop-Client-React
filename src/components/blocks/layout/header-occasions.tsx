
import { UserContext } from "@/components/providers/contexts/user-context";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { apiInstance, serverApiInstance } from "@/lib/api";
import { Occasion } from "@/models/occasion";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export function HeaderOccasions (
    {}: {}
) {
    let { occasions, set } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            if (occasions.length == 0)
                set.occasions((await apiInstance.get("occasions")).data);
        })();
    }, [])

    return <>
        <h2 className="font-heading px-2 pt-1 pb-4 text-3xl md:sr-only">Occasions</h2>
        <div className="flex flex-wrap gap-4 w-max max-w-full">
            {occasions.map(occasion => (
                <div className="flex flex-col w-50" key={occasion.id}>
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