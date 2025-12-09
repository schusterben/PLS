// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import QrAuthenticator from "../pages/QRAuthenticator";
import { useStateContext } from "../contexts/ContextProvider";

/**
 * The `ProtectedRoute` component is used to protect a route by validating a user token.
 * It renders the provided `element` if the token is valid, or redirects to the `QrAuthenticator` page if not.
 *
 * @param {object} props - Component props.
 * @param {React.Component} props.element - The React component to render if the user token is valid.
 * @returns {JSX.Element} The rendered component based on the token's validity.
 */
const ProtectedRoute = ({ element }) => {
    // Access the user token and validation function from the context
    const { token, validateToken } = useStateContext();
    // State to track the validity of the user token
    const [isTokenValid, setIsTokenValid] = useState(false);

    useEffect(() => {
        /**
         * Check the validity of the user token when the component mounts or when the user token changes.
         * If the token is valid, set `isTokenValid` to `true`, otherwise, set it to `false`.
         */
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
        // Invoke the token validation function
        checkTokenValidity();
    }, [token, validateToken]);
    // Render the appropriate component based on token validity
    return isTokenValid ? <>{element}</> : <QrAuthenticator />;
};

export default ProtectedRoute;
