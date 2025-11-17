import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../../../css/MarkerStyles.css";
import "./../../../css/SituationRoomTable.css";
import { useStateContext } from "../contexts/ContextProvider";

/**
 * Component for displaying a table of persons and their positions on a map.
 */
function SituationRoomTable() {
  const location = useLocation();
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([48.2715, 16.403]);
  const { token } = useStateContext();
  const operationScene = location.state?.operationScene;

  // Sichtbarkeit der Karte
  const [isMapVisible, setIsMapVisible] = useState(true);

  // Sichtbarkeit der Spalten
  const [visibleColumns, setVisibleColumns] = useState({
    nummer: true,
    atmung: true,
    blutung: true,
    triage: true,
    transport: true,
    dringend: true,
    name: true,
    longitude: true,
    latitude: true,
    created: true,
    updated: true,
  });

  const COLUMN_LABELS = {
    nummer: "Nummer",
    atmung: "Atmung",
    blutung: "Blutung",
    triage: "Triage",
    transport: "Transport",
    dringend: "Dringend",
    name: "Name",
    longitude: "Longitude",
    latitude: "Latitude",
    created: "Erfasst",
    updated: "Letztes Update",
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Dropdown-Status + Klick außerhalb
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /**
   * Updates the map's center based on the positions of persons.
   * @param {Array} people - persons with positions.
   */
  const updateMapCenter = (people) => {
    if (!Array.isArray(people) || people.length === 0) return;

    let count = 0;
    let latSum = 0;
    let lonSum = 0;

    for (const p of people) {
      const hasCoords =
        p?.latitude_patient != null && p?.longitude_patient != null;

      if (hasCoords) {
        latSum += parseFloat(p.latitude_patient);
        lonSum += parseFloat(p.longitude_patient);
        count++;
      }
    }

    if (count > 0) {
      setMapCenter([latSum / count, lonSum / count]);
    }
  };

  /**
   * Fetch persons including positions.
   */
  const fetchPersons = useCallback(async () => {
    try {
      const res = await fetch("/api/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operationScene }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const safe = Array.isArray(data) ? data : [];
      setPersons(safe);
      updateMapCenter(safe);
    } catch (err) {
      console.error("Error fetching persons:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, operationScene]);

  /**
   * Polling to refresh the table
   */
  useEffect(() => {
    // initial fetch
    fetchPersons();

    // poll every 2 seconds
    const interval = setInterval(fetchPersons, 2000);

    // cleanup
    return () => clearInterval(interval);
  }, [fetchPersons]);

  /**
   * Determines the background color based on triage color.
   */
  const getBackgroundColor = (triageColor) => {
    if (triageColor == null) return "var(--chip-default)";
    switch (String(triageColor).toLowerCase()) {
      case "gelb":
        return "#f6c751";
      case "rot":
        return "#ef4444";
      case "grün":
        return "#22c55e";
      case "blau":
        return "#3b82f6";
      case "schwarz":
        return "#111827";
      default:
        return "var(--chip-default)";
    }
  };

  /**
   * Creates a custom marker icon with the specified color.
   */
  const createMarkerIcon = (color) =>
    L.divIcon({
      className: "custom-div-icon",
      html: `<div style='background-color:${color};' class='marker-pin'></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });

  /**
   * Renders markers for each person with position data.
   */
  const renderMarkers = () =>
    persons
      .filter(
        (p) => p?.latitude_patient != null && p?.longitude_patient != null
      )
      .map((person) => (
        <Marker
          key={person.idpatient}
          position={[
            parseFloat(person.latitude_patient),
            parseFloat(person.longitude_patient),
          ]}
          icon={createMarkerIcon(getBackgroundColor(person.triagefarbe))}
        >
          <Popup>
            Nummer: {person.idpatient}
            <br />
            Kontaminiert: {person.kontaminiert ? "Ja" : "Nein"}
            <br />
          </Popup>
        </Marker>
      ));

  if (isLoading) return <p className="sr-loading">Lädt...</p>;
  if (!persons.length)
    return <p className="sr-empty">Keine Personen gefunden.</p>;

  return (
    <div className="situation-room">
      <div className="table-card">
        <div className="table-header">
          <h2>Übersicht</h2>

          <div className="table-header-right">
            <div className="meta">
              <span className="dot" />
              <span>Live aktualisiert</span>
            </div>

            <div className="filter-wrapper" ref={filterRef}>
              <button
                type="button"
                className="filter-button"
                onClick={() => setIsFilterOpen((v) => !v)}
              >
                Filter
                <span className="filter-button__caret">
                  {isFilterOpen ? "▴" : "▾"}
                </span>
              </button>

              {isFilterOpen && (
                <div className="filter-dropdown">
                  <div className="filter-dropdown__header">
                    Spalten auswählen
                  </div>
                  <div className="filter-dropdown__body">
                    {Object.keys(visibleColumns).map((key) => (
                      <label key={key} className="filter-dropdown__item">
                        <input
                          type="checkbox"
                          checked={visibleColumns[key]}
                          onChange={() => toggleColumn(key)}
                        />
                        <span>{COLUMN_LABELS[key]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="sr-table">
            <thead>
              <tr>
                {visibleColumns.nummer && <th>Nummer</th>}
                {visibleColumns.atmung && <th>Atmung</th>}
                {visibleColumns.blutung && <th>Blutung</th>}
                {visibleColumns.triage && <th>Triage</th>}
                {visibleColumns.transport && <th>Transport</th>}
                {visibleColumns.dringend && <th>Dringend</th>}
                {visibleColumns.name && <th>Name</th>}
                {visibleColumns.longitude && <th>Longitude</th>}
                {visibleColumns.latitude && <th>Latitude</th>}
                {visibleColumns.created && <th>Erfasst</th>}
                {visibleColumns.updated && <th>Letztes&nbsp;Update</th>}
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => (
                <tr key={person.idpatient}>
                  {visibleColumns.nummer && (
                    <td className="mono">{person.idpatient}</td>
                  )}
                  {visibleColumns.atmung && (
                    <td>
                      <span className="chip neutral">
                        {person.atmung ? "Ja" : "Nein"}
                      </span>
                    </td>
                  )}
                  {visibleColumns.blutung && (
                    <td>
                      <span className="chip neutral">
                        {person.blutung ? "Ja" : "Nein"}
                      </span>
                    </td>
                  )}
                  {visibleColumns.triage && (
                    <td>
                      <span
                        className="chip triage"
                        style={{
                          backgroundColor: getBackgroundColor(
                            person.triagefarbe
                          ),
                        }}
                        title={person.triagefarbe}
                      >
                        {person.triagefarbe ?? "—"}
                      </span>
                    </td>
                  )}
                  {visibleColumns.transport && (
                    <td>
                      <span className="chip neutral">
                        {person.transport ? "Ja" : "Nein"}
                      </span>
                    </td>
                  )}
                  {visibleColumns.dringend && (
                    <td>
                      <span className="chip neutral">
                        {person.dringend ? "Ja" : "Nein"}
                      </span>
                    </td>
                  )}
                  {visibleColumns.name && (
                    <td className="truncate">{person.name || "N/A"}</td>
                  )}
                  {visibleColumns.longitude && (
                    <td className="mono">
                      {person.longitude_patient ?? "N/A"}
                    </td>
                  )}
                  {visibleColumns.latitude && (
                    <td className="mono">
                      {person.latitude_patient ?? "N/A"}
                    </td>
                  )}
                  {visibleColumns.created && (
                    <td className="nowrap">{person.created_at}</td>
                  )}
                  {visibleColumns.updated && (
                    <td className="nowrap">{person.updated_at}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Karte nur anzeigen, wenn isMapVisible == true */}
      {isMapVisible && (
        <div className="map-wrapper">
          <button
            type="button"
            className="map-toggle map-toggle--overlay"
            onClick={() => setIsMapVisible(false)}
            title="Karte ausblenden"
          >
            ✕
          </button>

          <MapContainer center={mapCenter} zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {renderMarkers()}
          </MapContainer>
        </div>
      )}

      {!isMapVisible && (
        <button
          type="button"
          className="map-toggle map-toggle--floating"
          onClick={() => setIsMapVisible(true)}
          title="Karte einblenden"
        >
          🗺️
        </button>
      )}
    </div>
  );
}

export default SituationRoomTable;
