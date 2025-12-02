import { Button } from "@/components/ui/button";

export default function Page({}) {
    return <>
        <main className="container mx-auto my-10">
            <Button>bouquet</Button>
            <Button variant={"secondary"}>bouquet</Button>
            <Button variant={"outline"}>bouquet</Button>
            <Button variant={"destructive"}>bouquet</Button>
            <Button variant={"ghost"}>bouquet</Button>
        </main>
    </>;
}