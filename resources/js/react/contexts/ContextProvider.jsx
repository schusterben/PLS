import React, { createContext, useState, useContext, useEffect } from "react";

const StateContext = createContext({
    token: null,
    adminToken: null,
    setToken: () => {},
    setAdminToken: () => {},
    validateToken: () => {},
});

// Function to validate the token
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

export const ContextProvider = ({ children }) => {
    const [token, setTokenInternal] = useState(
        localStorage.getItem("ACCESS_TOKEN")
    );
    const [adminToken, setAdminTokenInternal] = useState(
        localStorage.getItem("ACCESS_ADMIN_TOKEN")
    );

    const setToken = (newToken) => {
        setTokenInternal(newToken);

        if (newToken) {
            localStorage.setItem("ACCESS_TOKEN", newToken);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    const setAdminToken = (newToken) => {
        setAdminTokenInternal(newToken);

        if (newToken) {
            localStorage.setItem("ACCESS_ADMIN_TOKEN", newToken);
        } else {
            localStorage.removeItem("ACCESS_ADMIN_TOKEN");
        }
    };

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

export const useStateContext = () => useContext(StateContext);
