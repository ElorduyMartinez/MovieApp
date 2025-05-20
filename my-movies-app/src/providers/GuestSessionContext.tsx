"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getGuestSession } from "@/services/auth/getGuestSession";

const GuestSessionContext = createContext<{
    guestSessionId: string | null;
    setGuestSessionId: (id: string) => void;
}>({
    guestSessionId: null,
    setGuestSessionId: () => { },
});

export const GuestSessionProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [guestSessionId, setGuestSessionIdState] = useState<string | null>(
        null
    );

    const setGuestSessionId = (id: string)=> {
        localStorage.setItem("guestSessionID", id); 
        setGuestSessionIdState(id);
    };

    useEffect(() => {
        const existingId = localStorage.getItem("guestSessionId");
        if (existingId) {
            setGuestSessionIdState(existingId);
        } else {
            fetchGuestSession();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGuestSession = async () => {
        const data = await getGuestSession();
        if (data.guest_session_id) {
            setGuestSessionId(data.guest_session_id);
        }
    };

    return (

        <GuestSessionContext.Provider value={{ guestSessionId, setGuestSessionId }}>
            {children}
        </GuestSessionContext.Provider>

    );
};

export const useGuestSession = () => useContext(GuestSessionContext);

