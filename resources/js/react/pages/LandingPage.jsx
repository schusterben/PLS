import { Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

/**
 * LandingPage component for handling user redirection based on authentication status.
 * If a user is authenticated, it navigates to the RoleSelection page.
 * If not authenticated, it navigates to the qrAuthenticator page.
 */
export default function LandingPage() {
    // Access the authentication token and setToken function from the context.
    const { token } = useStateContext();

    // Check if the user is authenticated.
    if (!token) {
        // Redirect to the qrAuthenticator page if not authenticated.
        return <Navigate to="/qrAuthenticator" />;
    } else {
        // Redirect to the RoleSelection page if authenticated.
        return <Navigate to="/RoleSelection" />;
    }
}
