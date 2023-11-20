// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import QrAuthenticator from "../pages/QRAuthenticator";
import { useStateContext } from "../contexts/ContextProvider";
import AdminLandingPage from "../pages/AdminLandingPage";

const ProtectedAdminRoute = ({ element }) => {
    const { adminToken, validateToken } = useStateContext();
    const [isTokenValid, setIsTokenValid] = useState(false);

    useEffect(() => {
        const checkTokenValidity = async () => {
            if (adminToken) {
                try {
                    const isValid = await validateToken(adminToken);
                    setIsTokenValid(isValid);
                } catch (error) {
                    console.error("Error validating token:", error);
                    setIsTokenValid(false); // Set validity to false in case of an error
                }
            }
        };

        checkTokenValidity();
    }, [adminToken, validateToken]);

    return isTokenValid ? <>{element}</> : <AdminLandingPage />;
};

export default ProtectedAdminRoute;
