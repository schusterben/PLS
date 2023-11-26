import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
//import { Navigate } from "react-router-dom";
import {Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";


export default function ScanPatient() {
    const [cameraBlocked, setCameraBlocked] = useState(false);
    const [accessGranted, setaccessGranted] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const [isScanning, setIsScanning] = useState(false); // Zustand zum Verfolgen des Scannerstatus
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const [isRequestInProgress, setIsRequestInProgress] = useState(false);

    
    useEffect(() => {
        if (!scannerRef.current) {
            const config = { fps: 5, qrbox: { width: 200, height: 200 } };
            scannerRef.current = new Html5Qrcode("reader");
            scannerRef.current.start(
                { facingMode: "environment" }, 
                config, 
                qrCodeSuccessCallback
            ).then(() => {
                setIsScanning(true); // Scannerstatus auf 'true' setzen, wenn der Scanner startet
            }).catch((error) => {
                setCameraBlocked(true);
                console.warn(`Code scan error = ${error}`);
            });
        }

        //Aufräumfunktion für den useEffect Hook
        return () => {
            if (isScanning && scannerRef.current) {
                scannerRef.current.stop().then(() => {
                    setIsScanning(false); // Scannerstatus auf 'false' setzen, wenn der Scanner stoppt
                });
            }
        };
    }, []);

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log("onScanSuccess aufgerufen mit QR-Code:", decodedText);

        if (isRequestInProgress || accessGranted) {
            return;
        }

        if (scannerRef.current && isScanning) {
            scannerRef.current.stop().then(() => {
                setIsScanning(false);
                console.log("Scanner gestoppt");
            }).catch((error) => {
                console.error("Fehler beim Stoppen des Scanners:", error);
            });
        }

        setIsRequestInProgress(true);

        fetch('/api/verify-patient-qr-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ qr_code: decodedText })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Netzwerkantwort war nicht ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.patientId) {
                setPatientId(data.patientId);
                //setAccessGranted(true);
                navigate('/TriagePage1', { state: { patientId: data.patientId } });
            } else {
                console.error("Ungültiger QR-Code oder Fehler bei der Erstellung des Patienten");
            }
        })
        .catch(error => {
            console.error("Fehler beim Senden des QR-Codes", error);
        })
        .finally(() => {
            setIsRequestInProgress(false);
        });
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
            {accessGranted }
        </div>
    );
}
