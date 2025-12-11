
import { HeaderClient } from "./header-client";
import { HeaderOccasions } from "./header-occasions";

export function Header() {

    const occasions = <HeaderOccasions />

    return (
        <HeaderClient occasions={occasions} />
    );
}