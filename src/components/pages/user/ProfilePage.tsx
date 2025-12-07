"use client"
import AuthService from "@/lib/AuthService"
import React from "react"
import { useRouter } from "next/navigation";
    
export default function ProfilePage() {
    const [profile, setProfile] = React.useState(null);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await AuthService.Profile();
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile Page</h1>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
    );
}