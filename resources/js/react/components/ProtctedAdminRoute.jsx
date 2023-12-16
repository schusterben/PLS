// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import QrAuthenticator from "../pages/QRAuthenticator";
import { useStateContext } from "../contexts/ContextProvider";
import AdminLandingPage from "../pages/AdminLandingPage";

/**
 * The `ProtectedAdminRoute` component serves as a protected route for admin-related content.
 * It checks the validity of the admin token and renders the appropriate content based on the token's status.
 *
 * @param {object} props - Component props.
 * @param {React.Component} props.element - The React component to render if the admin token is valid.
 * @returns {JSX.Element} The rendered component based on the token's validity.
 */
const ProtectedAdminRoute = ({ element }) => {
    // Access the admin token and validation function from the context
    const { adminToken, validateToken } = useStateContext();

    // State to track the validity of the admin token
    const [isTokenValid, setIsTokenValid] = useState(false);
    useEffect(() => {
        /**
         * Check the validity of the admin token when the component mounts or when the admin token changes.
         * If the token is valid, set `isTokenValid` to `true`, otherwise, set it to `false`.
         */
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
        // Invoke the token validation function
        checkTokenValidity();
    }, [adminToken, validateToken]);

    // Render the appropriate component based on token validity
    return isTokenValid ? <>{element}</> : <AdminLandingPage />;
};

export default ProtectedAdminRoute;
