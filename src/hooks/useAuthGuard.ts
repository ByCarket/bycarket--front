// hooks/useAuthGuard.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../context/AuthContext";

export default function useAuthGuard() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuthStore(); 
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (!loading) { 
            if (!isAuthenticated) {
                router.push("/login"); 
            } else {
                setCheckingAuth(false); 
            }
        }
    }, [loading, isAuthenticated, router]);

    return checkingAuth;
}