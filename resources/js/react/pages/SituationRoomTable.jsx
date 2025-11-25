import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Zum Ambu Formular
   const handleNummerClick = (person) => {
    navigate("/AmbulanzForm", {
      state: {
        patientId: person.idpatient,
        patient: person,
        operationScene,
      },
    });
  };

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

  const TRIAGE_COLOR_ORDER = [
    "rot",
    "gelb",
    "grün",
    "blau",
    "schwarz",
  ];


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
      const lat = getNumericValue(p?.latitude_patient);
      const lon = getNumericValue(p?.longitude_patient);

      if (lat !== null && lon !== null) {
        latSum += lat;
        lonSum += lon;
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

  const EMPTY_PLACEHOLDER = "-";

  const sanitizeValue = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed || trimmed.toLowerCase() === "null") {
        return null;
      }
      return trimmed;
    }
    return value;
  };

  const displayValue = (value) => {
    const clean = sanitizeValue(value);
    if (clean === null) return EMPTY_PLACEHOLDER;
    return `${clean}`;
  };

  const getNumericValue = (value) => {
    const clean = sanitizeValue(value);
    if (clean === null) return null;
    const numeric = typeof clean === "number" ? clean : parseFloat(clean);
    return Number.isNaN(numeric) ? null : numeric;
  };

  const interpretBoolean = (value) => {
    const clean = sanitizeValue(value);
    if (clean === null) return null;
    if (typeof clean === "string") {
      const lower = clean.toLowerCase();
      if (["1", "true", "ja", "yes"].includes(lower)) return true;
      if (["0", "false", "nein", "no"].includes(lower)) return false;
      if (lower === "null") return null;
    }
    if (typeof clean === "number") {
      if (clean === 1) return true;
      if (clean === 0) return false;
    }
    return Boolean(clean);
  };

  const displayBoolean = (value) => {
    const interpreted = interpretBoolean(value);
    if (interpreted === null) return EMPTY_PLACEHOLDER;
    return interpreted ? "Ja" : "Nein";
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

  /*
    Formats ISO timestamps into a readable date & time string.
   */
  const formatTimestamp = (value) => {
    const clean = sanitizeValue(value);
    if (clean === null) return EMPTY_PLACEHOLDER;
    const date = new Date(clean);
    if (Number.isNaN(date.getTime())) {
      return EMPTY_PLACEHOLDER;
    }
    return date.toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /*
    Renders markers for each person with position data.
   */
  const renderMarkers = () =>
    persons
      .filter(
        (p) =>
          getNumericValue(p?.latitude_patient) !== null &&
          getNumericValue(p?.longitude_patient) !== null
      )
      .map((person) => (
        <Marker
          key={person.idpatient}
          position={[
            getNumericValue(person.latitude_patient),
            getNumericValue(person.longitude_patient),
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

  const summaryData = (() => {
    const total = persons.length;
    const triageCounters = persons.reduce((acc, person) => {
      const key =
        sanitizeValue(person.triagefarbe)?.toLowerCase() || "keine";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const items = TRIAGE_COLOR_ORDER.map((colorKey) => {
      const value = triageCounters[colorKey] || 0;
      const label =
        colorKey === "keine"
          ? "Ohne Triage"
          : colorKey.charAt(0).toUpperCase() + colorKey.slice(1);

      return {
        key: colorKey,
        label,
        value,
      };
    }).filter((entry) => entry.value > 0);

    return { total, items };
  })();

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
                    <td className="mono">
                      <button
                        type="button"
                        className="nummer-link"
                        onClick={() => handleNummerClick(person)}
                      >
                        {person.idpatient}
                      </button>
                    </td>
                  )}
                  {visibleColumns.atmung && (
                    <td>
                      <span className="chip neutral">
                        {displayBoolean(person.atmung)}
                      </span>
                    </td>
                  )}
                  {visibleColumns.blutung && (
                    <td>
                      <span className="chip neutral">
                        {displayBoolean(person.blutung)}
                      </span>
                    </td>
                  )}
                  {visibleColumns.triage && (
                    <td>
                      {(() => {
                        const triageValue = sanitizeValue(
                          person.triagefarbe
                        );
                        return (
                          <span
                            className="chip triage"
                            style={{
                              backgroundColor: getBackgroundColor(
                                triageValue
                              ),
                            }}
                            title={displayValue(person.triagefarbe)}
                          >
                            {displayValue(person.triagefarbe)}
                          </span>
                        );
                      })()}
                    </td>
                  )}
                  {visibleColumns.transport && (
                    <td>
                      <span className="chip neutral">
                        {displayBoolean(person.transport)}
                      </span>
                    </td>
                  )}
                  {visibleColumns.dringend && (
                    <td>
                      <span className="chip neutral">
                        {displayBoolean(person.dringend)}
                      </span>
                    </td>
                  )}
                  {visibleColumns.name && (
                    <td className="truncate">{displayValue(person.name)}</td>
                  )}
                  {visibleColumns.longitude && (
                    <td className="mono">
                      {displayValue(person.longitude_patient)}
                    </td>
                  )}
                  {visibleColumns.latitude && (
                    <td className="mono">
                      {displayValue(person.latitude_patient)}
                    </td>
                  )}
                  {visibleColumns.created && (
                    <td className="nowrap">
                      {formatTimestamp(person.created_at)}
                    </td>
                  )}
                  {visibleColumns.updated && (
                    <td className="nowrap">
                      {formatTimestamp(person.updated_at)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-summary table-summary--bottom">
          <strong>Total: {summaryData.total}</strong>
          {summaryData.items.length === 0 ? (
            <span className="summary-chip summary-chip--keine">
              Ohne Triage: 0
            </span>
          ) : (
            summaryData.items.map(({ key, label, value }) => (
              <span
                key={key}
                className={`summary-chip summary-chip--${key}`}
              >
                {label}: {value}
              </span>
            ))
          )}
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
