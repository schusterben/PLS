import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
//import { Navigate } from "react-router-dom";
import {Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";


export default function ScanPatient() {
    const [cameraBlocked, setCameraBlocked] = useState(false);
    const [accessGranted, setaccessGranted] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const navigate = useNavigate();
    let scanner;

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        onScanSuccess(decodedText, decodedResult);
    };

    useEffect(() => {
        

        if (!scanner?.getState()) {
            const config = { fps: 5, qrbox: { width: 200, height: 200 } };
            scanner = new Html5Qrcode("reader");
            scanner
                .start(
                    { facingMode: "environment" }, 
                    config, 
                    qrCodeSuccessCallback)
                .catch((error) => {
                    setCameraBlocked(true);
                    console.warn(`Code scan error = ${error}`);
                });
        }

        // Aufräumfunktion für den useEffect Hook
        // return () => {
        //     if (scanner) {
        //         scanner.stop();
        //     }
        // };
    }, []);

        function onScanSuccess(decodedText, decodedResult) {
            axios.post('/api/verify-patient-qr-code', { qr_code: decodedText })
            .then(response => {
                if (response.data.patientId) {
                    setPatientId(response.data.patientId);
                    setaccessGranted(true);
                    navigateToTriagePage();
                } else {
                    console.error("Ungültiger QR-Code oder Fehler bei der Erstellung des Patienten");
                }
            })
            .catch(error => {
                console.error("Fehler beim Senden des QR-Codes", error);
            });
    }


    // Navigiere zu TriagePage1, wenn eine Patienten-ID vorhanden ist
    if (patientId) {
        navigate('/TriagePage1', { state: { patientId: patientId } });
    }

    return (
        <div>
            <h2>Bitte einen Patienten QR-Code scannen</h2>
            <div id="reader"></div>
            {cameraBlocked ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                    Der Zugriff auf die Kamera wurde verweigert. Bitte erlauben
                    Sie den Zugriff auf die Kamera über die Einstellungen.
                </p>
            ) : (
                ""
            )}
            {accessGranted && <Navigate to="/TriagePage1" />}
        </div>
    );
}
