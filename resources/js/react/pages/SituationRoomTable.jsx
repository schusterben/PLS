import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../../css/MarkerStyles.css";

function SituationRoomTable() {
    const [persons, setPersons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState([48.2715, 16.403]);

    useEffect(() => {
        fetch("/api/persons")
            .then((response) => response.json())
            .then((data) => {
                setPersons(data);
                updateMapCenter(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching persons:", error);
                setIsLoading(false);
            });
    }, []);

    const updateMapCenter = (persons) => {
        if (persons.length === 0) return;

        let latSum = 0,
            lonSum = 0;
        for (let person of persons) {
            latSum += person.latitude;
            lonSum += person.longitude;
        }

        setMapCenter([latSum / persons.length, lonSum / persons.length]);
    };
    const getBackgroundColor = (triageColor) => {
        switch (triageColor) {
            case "gelb":
                return "yellow";
            case "rot":
                return "red";
            case "grün":
                return "green";
            case "blau":
                return "blue";
            case "schwarz":
                return "black";
            default:
                return "white";
        }
    };

    const createMarkerIcon = (color) => {
        return L.divIcon({
            className: "custom-div-icon",
            html: `<div style='background-color:${color};' class='marker-pin'></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
        });
    };

    const renderMarkers = () => {
        return persons.map((person) => (
            <Marker
                key={person.id}
                position={[person.latitude, person.longitude]}
                icon={createMarkerIcon(getBackgroundColor(person.Triagefarbe))} //zum debuggen ausgeblendet
            >
                <Popup>
                    Nummer: {person.id}
                    <br />
                    Geht: {person.geht ? "Ja" : "Nein"}
                    <br />
                    Kontaminiert: {person.kontaminiert ? "Ja" : "Nein"}
                    <br />
                </Popup>
            </Marker>
        ));
    };

    if (isLoading) {
        return <p>Lädt...</p>;
    }

    if (persons.length === 0) {
        return <p>Keine Personen gefunden.</p>;
    }

    return (
        <div>
            <h2>Alle Personen:</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nummer</th>
                        <th>geht</th>
                        <th>Atmung</th>
                        <th>stillbare Blutung</th>
                        <th>Puls</th>
                        <th>Triagefarbe</th>
                        <th>Dringend</th>
                        <th>Kontaminiert</th>
                        <th>erfasst</th>
                        <th>letztes update</th>
                    </tr>
                </thead>
                <tbody>
                    {persons.map((person) => (
                        <tr key={person.id}>
                            <td>{person.id}</td>
                            <td>{person.geht ? "Ja" : "Nein"}</td>
                            <td>{person.AtmungSuffizient ? "Ja" : "Nein"}</td>
                            <td>{person.Blutung ? "Ja" : "Nein"}</td>
                            <td>
                                {person.RadialispulsTastbar ? "Ja" : "Nein"}
                            </td>
                            <td>
                                <div
                                    style={{
                                        backgroundColor: getBackgroundColor(
                                            person.Triagefarbe
                                        ),
                                    }}
                                >
                                    {person.Triagefarbe}
                                </div>
                            </td>
                            <td>{person.dringend ? "Ja" : "Nein"}</td>
                            <td>{person.kontaminiert ? "Ja" : "Nein"}</td>
                            <td>{person.created_at}</td>
                            <td>{person.updated_at}</td>
                            <td>{person.longitude}</td>
                            <td>{person.latitude}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <h2>Karte:</h2>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {renderMarkers()}
                </MapContainer>
            </div>
        </div>
    );
}

export default SituationRoomTable;
