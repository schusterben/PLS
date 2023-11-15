import { Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function LandingPage() {
    const { user, token } = useStateContext();

    if (!token) {
        return <Navigate to="/qrAuthenticator" />;
    } else {
        return <Navigate to="/RoleSelection" />;
    }
}
