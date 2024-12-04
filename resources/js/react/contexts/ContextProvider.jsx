import React, { createContext, useState, useContext, useEffect } from "react";

/**
 * Der `StateContext` verwaltet und teilt globale Zustandswerte (z. B. Tokens) innerhalb der Anwendung.
 * Es werden Werte bereitgestellt, die von mehreren Komponenten verwendet werden können.
 */
const StateContext = createContext({
    token: null,
    adminToken: null,
    setToken: () => {},
    setAdminToken: () => {},
    validateToken: () => {},
});

// Function to validate the user token by sending a request to the server
const validateToken = async (token) => {
    try {
        const response = await fetch("/api/validate-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            // Assuming your backend responds with user data or some indication of validity
            return true; // Adjust accordingly based on your backend response
        } else {
            console.error("Token validation failed:", response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error during token validation:", error.message);
        return false;
    }
};

/**
 * `ContextProvider` ist ein Komponenten-Wrapper, der den globalen Zustand (Token und Funktionen)
 * für alle Kindkomponenten bereitstellt.
 */export const ContextProvider = ({ children }) => {
    const [token, setTokenInternal] = useState(
        localStorage.getItem("ACCESS_TOKEN")
    );
    const [adminToken, setAdminTokenInternal] = useState(
        localStorage.getItem("ACCESS_ADMIN_TOKEN")
    );

    // Function to set the user token and store it in local storage
    const setToken = (newToken) => {
        setTokenInternal(newToken);

        if (newToken) {
            localStorage.setItem("ACCESS_TOKEN", newToken);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    // Provide the state values and functions to child components through the context
    const setAdminToken = (newToken) => {
        setAdminTokenInternal(newToken);

        if (newToken) {
            localStorage.setItem("ACCESS_ADMIN_TOKEN", newToken);
        } else {
            localStorage.removeItem("ACCESS_ADMIN_TOKEN");
        }
    };
    // Provide the state values and functions to child components through the context
    return (
        <StateContext.Provider
            value={{
                token,
                adminToken,
                setToken,
                setAdminToken,
                validateToken,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};
// Benutzerdefinierter Hook zur Verwendung der Kontextwerte innerhalb von Komponenten
export const useStateContext = () => useContext(StateContext);
