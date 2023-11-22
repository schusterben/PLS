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

import AdminLandingPage from "./pages/AdminLandingPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import CreatePatientQrCodes from "./pages/CreatePatientQrCodes";
import ProtectedRoute from "./components/ProtctedRoute";
import ShowBodyFront from "./pages/ShowBodyFront";
import ShowBodyBack from "./pages/ShowBodyBack";
import ProtectedAdminRoute from "./components/ProtctedAdminRoute";
import ShowUnusedQrCodesPage from "./pages/ShowUnusedQrCodesPage";
import CreateNewAdminUserPage from "./pages/CreateNewAdminUserPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute element={<LandingPage />} />,
    },
    {
        path: "/qrAuthenticator",
        element: <ProtectedRoute element={<QrAuthenticator />} />,
    },
    {
        path: "/TriagePage1",
        element: <ProtectedRoute element={<TriagePage1 />} />,
    },
    {
        path: "/TriagePage2",
        element: <ProtectedRoute element={<TriagePage2 />} />,
    },
    {
        path: "/TriagePage3",
        element: <ProtectedRoute element={<TriagePage3 />} />,
    },
    {
        path: "/RoleSelection",
        element: <ProtectedRoute element={<RoleSelection />} />,
    },

    {
        path: "/ScanPatient",
        element: <ProtectedRoute element={<ScanPatient />} />,
    },
    {
        path: "/SituationRoomTable",
        element: <ProtectedRoute element={<SituationRoomTable />} />,
    },
    {
        path: "/AdminSettingsPage",
        element: <ProtectedAdminRoute element={<AdminSettingsPage />} />,
    },
    {
        path: "/CreatePatientQrCodePage",
        element: <ProtectedAdminRoute element={<CreatePatientQrCodes />} />,
    },
    {
        path: "/ShowBodyFront",
        element: <ProtectedRoute element={<ShowBodyFront />} />,
    },
    {
        path: "/ShowBodyBack",
        element: <ProtectedRoute element={<ShowBodyBack />} />,
    },
    /* {
        path: "/test-db",
        element: <SituationRoomTable />,
    }, */
    {
        path: "/AdminLandingPage",
        element: <AdminLandingPage />,
    },
    {
        path: "/ShowUnusedQrCodesPage",
        element: <ProtectedAdminRoute element={<ShowUnusedQrCodesPage />} />,
    },
    {
        path: "/CreateNewAdminUserPage",
        element: <ProtectedAdminRoute element={<CreateNewAdminUserPage />} />,
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
