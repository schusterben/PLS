import { createBrowserRouter } from "react-router-dom";

import QrAuthenticator from "./pages/QRAuthenticator";
import NotFound from "./pages/notFound";
import LandingPage from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelectionPage";
import ScanPatient from "./pages/ScanPatient";
import TriagePage1 from "./pages/TriagePage1";
import TriagePage2 from "./pages/TriagePage2";
import TriagePage3 from "./pages/TriagePage3";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/qrAuthenticator",
        element: <QrAuthenticator />,
    },
    {
        path: "/TriagePage1",
        element: <TriagePage1 />,
    },
    {
        path: "/TriagePage2",
        element: <TriagePage2 />,
    },
    {
        path: "/TriagePage3",
        element: <TriagePage3 />,
    },
    {
        path: "/RoleSelection",
        element: <RoleSelection />,
    },

    {
        path: "/ScanPatient",
        element: <ScanPatient />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
