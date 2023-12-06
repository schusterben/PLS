import React from "react";
import ReactDOM from "react-dom/client";
import "../../css/index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { ContextProvider } from "./contexts/ContextProvider.jsx";
import Appbar from "./components/Appbar";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextProvider>
            <Appbar />
            <div className="content">
                <RouterProvider router={router} />
            </div>
        </ContextProvider>
    </React.StrictMode>
);
