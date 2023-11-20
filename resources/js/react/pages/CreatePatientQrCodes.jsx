import React, { useState } from "react";

export default function CreatePatientQrCodes() {
    const [number, setNumber] = useState("");

    function handleNumberChange(event) {
        // Hier wird überprüft, ob die Eingabe eine gültige Zahl ist
        if (!isNaN(event.target.value) && event.target.value >= 0) {
            setNumber(event.target.value);
        }
    }

    function generateQrCodes() {}

    return (
        <div>
            <h2>Patienten QR-Codes generieren</h2>
            <p>
                Bitte auswählen wie viele Patienten QR-Codes generiert werden
                sollen
            </p>
            <input
                style={{ width: "300px" }}
                type="number"
                id="numberInput"
                value={number}
                onChange={handleNumberChange}
                placeholder="Bitte hier die Anzahl eingeben"
            />
            <button onClick={generateQrCodes}>Generieren</button>
        </div>
    );
}
