// router.jsx - Definiert die Routen für die React-Anwendung

import { createBrowserRouter } from "react-router-dom";

// Import der Seitenkomponenten
import QrAuthenticator from "./pages/QRAuthenticator";
import NotFound from "./pages/NotFound";
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
import ShowUnusedPatientQrCodesPage from "./pages/ShowUnusedPatientQrCodesPage";
import CreateNewAdminUserPage from "./pages/CreateNewAdminUserPage";
import ChangeAdminPasswordPage from "./pages/ChangeAdminPasswordPage";
import CreateLoginQrCodesPage from "./pages/CreateLoginQrCodesPage";
import ShowUnusedLoginQrCodesPage from "./pages/ShowUnusedLoginQrCodesPage";
import CreateOperationScene from "./pages/CreateOperationScene";
import EditOperationScene from "./pages/EditOperationScene";

/**
 * Erzeugt die Routen-Konfiguration der Anwendung.
 * Alle geschützten Routen sind über `ProtectedRoute` oder `ProtectedAdminRoute` zugänglich.
 */
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
        path: "/ShowUnusedPatientQrCodesPage",
        element: (
            <ProtectedAdminRoute element={<ShowUnusedPatientQrCodesPage />} />
        ),
    },
    {
        path: "/CreateLoginQrCodesPage",
        element: <ProtectedAdminRoute element={<CreateLoginQrCodesPage />} />,
    },
    {
        path: "/CreateNewAdminUserPage",
        element: <ProtectedAdminRoute element={<CreateNewAdminUserPage />} />,
    },
    {
        path: "/ChangeAdminPasswordPage",
        element: <ProtectedAdminRoute element={<ChangeAdminPasswordPage />} />,
    },

    {
        path: "/ShowUnusedLoginQrCodesPage",
        element: (
            <ProtectedAdminRoute element={<ShowUnusedLoginQrCodesPage />} />
        ),
    },

    {
        path: "/CreateOperationScene",
        element: <ProtectedAdminRoute element={<CreateOperationScene />} />,
    },
    {
        path: "/EditOperationScene",
        element: <ProtectedAdminRoute element={<EditOperationScene />} />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
