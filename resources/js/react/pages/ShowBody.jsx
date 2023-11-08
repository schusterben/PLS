import React from "react";

//TODO: Body picture needs to be implemented
export default function ShowBody() {
    return (
        <div
            style={{
                position: "absolute",
                top: "13%",
                left: "0",
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h3>Bitte die Stelle der Verletzungen angeben</h3>
            <div style={{ width: "100%", height: "auto" }}>
                {/*
                <img
                    src="/BodySVG/Körper_ganz_vorne.svg"
                    alt="Mein SVG-Bild"
                    style={{ width: "100%", height: "100%" }}
                />
*/}
            </div>
        </div>
    );
}
