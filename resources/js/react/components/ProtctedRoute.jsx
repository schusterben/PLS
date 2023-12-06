// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import QrAuthenticator from "../pages/QRAuthenticator";
import { useStateContext } from "../contexts/ContextProvider";

const ProtectedRoute = ({ element }) => {
    const { token, validateToken } = useStateContext();
    const [isTokenValid, setIsTokenValid] = useState(false);

    useEffect(() => {
        const checkTokenValidity = async () => {
            if (token) {
                try {
                    const isValid = await validateToken(token);
                    setIsTokenValid(isValid);
                } catch (error) {
                    console.error("Error validating token:", error);
                    setIsTokenValid(false); // Set validity to false in case of an error
                }
            }
        };

        checkTokenValidity();
    }, [token, validateToken]);

    return isTokenValid ? <>{element}</> : <QrAuthenticator />;
};

export default ProtectedRoute;
