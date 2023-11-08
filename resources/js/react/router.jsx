import { createBrowserRouter } from "react-router-dom";

import QrAuthenticator from "./pages/QRAuthenticator";
import NotFound from "./pages/notFound";
import LandingPage from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelectionPage";
import ScanPatient from "./pages/ScanPatient";
import TriagePage1 from "./pages/TriagePage1";
import TriagePage2 from "./pages/TriagePage2";
import TriagePage3 from "./pages/TriagePage3";
import SituationRoomTable from "./pages/SituationRoomTable";
import ShowBody from "./pages/ShowBody";
import AdminLandingPage from "./pages/AdminLandingPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import CreatePatientQrCodes from "./pages/CreatePatientQrCodes";

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
        path: "/SituationRoomTable",
        element: <SituationRoomTable />,
    },
    {
        path: "/ShowBody",
        element: <ShowBody />,
    },
    {
        path: "/AdminLandingPage",
        element: <AdminLandingPage />,
    },
    {
        path: "/AdminSettingsPage",
        element: <AdminSettingsPage />,
    },
    {
        path: "/CreatePatientQrCodePage",
        element: <CreatePatientQrCodes />,
    },

    /* {
        path: "/test-db",
        element: <SituationRoomTable />,
    }, */
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
