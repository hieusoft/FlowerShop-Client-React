import Link from "next/link";
import "tailwindcss";

export default function Header({}) {
    return <>
        <header className="border-b border-gray-100">
            <div className="container mx-auto flex">
                <Link href="/">
                    <h1>
                        java Floral
                    </h1>
                </Link>
            </div>
        </header>
    </>;
}