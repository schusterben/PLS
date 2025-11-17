import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";
import BodyPartFront from "../components/BodyPartsFront";
import BodyPartBack from "../components/BodyPartsBack";
import "./../../../css/AmbulanzForm.css";

function AmbulanzForm() {
  const location = useLocation();
  const { token } = useStateContext();

  const patientId = location.state?.patientId;
  const patient = location.state?.patient;
  const operationScene = location.state?.operationScene;

  const [bodyParts, setBodyParts] = useState({});
  const [isLoadingBodyParts, setIsLoadingBodyParts] = useState(true);
  const [showFront, setShowFront] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle");
  const triageOptions = [
    { value: "", label: "Keine Auswahl" },
    { value: "grün", label: "Grün" },
    { value: "gelb", label: "Gelb" },
    { value: "rot", label: "Rot" },
    { value: "blau", label: "Blau" },
    { value: "schwarz", label: "Schwarz" },
  ];
  const triageClassMap = {
    grun: "green",
    gruen: "green",
    gelb: "yellow",
    rot: "red",
    blau: "blue",
    schwarz: "black",
  };
  const statusFields = [
    { key: "atmung", label: "Atmung vorhanden" },
    { key: "blutung", label: "Blutung vorhanden" },
    { key: "transport", label: "Transport erforderlich" },
    { key: "dringend", label: "Dringend" },
    { key: "kontaminiert", label: "Kontaminiert" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    triagefarbe: "",
    atmung: false,
    blutung: false,
    transport: false,
    dringend: false,
    kontaminiert: false,
    latitude_patient: "",
    longitude_patient: "",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        triagefarbe: patient.triagefarbe || "",
        atmung: !!patient.atmung,
        blutung: !!patient.blutung,
        transport: !!patient.transport,
        dringend: !!patient.dringend,
        kontaminiert: !!patient.kontaminiert,
        latitude_patient: patient.latitude_patient ?? "",
        longitude_patient: patient.longitude_patient ?? "",
        created_at: patient.created_at || "",
        updated_at: patient.updated_at || "",
      });
    }
  }, [patient]);

  const fetchInitialBodyParts = async () => {
    if (!patientId) {
      setIsLoadingBodyParts(false);
      return;
    }

    try {
      const response = await fetch(`/api/get-body-parts?idpatient=${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const initialBodyParts = await response.json();
        setBodyParts(initialBodyParts || {});
      } else {
        console.error(`Failed to fetch initial body parts for patient ${patientId}`);
      }
    } catch (error) {
      console.error(
        `Error while fetching initial body parts for patient ${patientId}`,
        error
      );
    } finally {
      setIsLoadingBodyParts(false);
    }
  };

  useEffect(() => {
    fetchInitialBodyParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const parsedOperationScene = useMemo(() => {
    if (!operationScene) return null;
    if (typeof operationScene === "string") {
      try {
        return JSON.parse(operationScene);
      } catch {
        return operationScene;
      }
    }
    return operationScene;
  }, [operationScene]);

  const operationSceneLabel = useMemo(() => {
    if (!parsedOperationScene) return "";
    if (typeof parsedOperationScene === "string") return parsedOperationScene;

    const { name, description, idoperationScene } = parsedOperationScene;
    const segments = [];

    if (name) segments.push(name);
    if (description) segments.push(description);
    if (idoperationScene) segments.push(`#${idoperationScene}`);

    return segments.join(" · ") || JSON.stringify(parsedOperationScene);
  }, [parsedOperationScene]);

  const getTriageClassKey = (value) => {
    if (!value) return null;
    return triageClassMap[
      value
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    ];
  };

  const triageColorKey = getTriageClassKey(formData.triagefarbe);

  const triagePillClass = triageColorKey
    ? `triage-pill--${triageColorKey}`
    : "triage-pill--unset";

  const triageLabel = formData.triagefarbe
    ? `${formData.triagefarbe.charAt(0).toUpperCase()}${formData.triagefarbe.slice(
        1
      )}`
    : "Keine Auswahl";

  const handleBodyPartClick = async (id, isClicked) => {
    setBodyParts((prev) => ({ ...prev, [id]: isClicked }));

    try {
      const response = await fetch("/api/save-body-part", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idpatient: patientId,
          bodyPartId: id,
          isClicked,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to save body part ${id} for patient ${patientId}`);
      }
    } catch (error) {
      console.error(
        `Error while saving body part ${id} for patient ${patientId}`,
        error
      );
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  // Speichern in die DB – funktioniert noch nicht richtig
  const handleSave = async () => {
    if (!patientId) return;

    setSaveStatus("saving");

    const payload = {
      triageColor: formData.triagefarbe || null,
      lat:
        formData.latitude_patient === ""
          ? null
          : parseFloat(formData.latitude_patient),
      lng:
        formData.longitude_patient === ""
          ? null
          : parseFloat(formData.longitude_patient),
      respiration: formData.atmung,
      bloodStopable: formData.blutung,
      // name, transport, dringend, kontaminiert sind im UI schon da,
      // werden aber noch nicht an die API geschickt.
    };

    try {
      const res = await fetch(
        `/api/persons/${patientId}/update-triage-color`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSaveStatus("success");
    } catch (err) {
      console.error("Fehler beim Speichern der Patientendaten:", err);
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  if (!patientId) {
    return (
      <div className="ambulanz-page">
        <div className="ambulanz-card">
          <h2 className="ambulanz-title">Ambulanzformular</h2>
          <p className="triage-status error">
            Keine Patient:In-ID vorhanden. Bitte über die Übersicht oder den Scan
            aufrufen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ambulanz-page" role="main" aria-labelledby="ambulanzTitle">
      <div className="ambulanz-card">
        <header className="ambulanz-header">
          <div className="ambulanz-header-left">
            <h2 id="ambulanzTitle" className="ambulanz-title">
              Ambulanzformular
            </h2>
            <div className="ambulanz-meta-row">
              <span className="meta-chip">
                <span className="meta-label">Patient:In</span>
                <span className="meta-value">#{patientId}</span>
              </span>

              {operationSceneLabel && (
                <span className="meta-chip">
                  <span className="meta-label">Einsatzszene</span>
                  <span className="meta-value">{operationSceneLabel}</span>
                </span>
              )}

              <span className="meta-chip">
                <span className="meta-label">Letztes Update</span>
                <span className="meta-value">
                  {formData.updated_at || "—"}
                </span>
              </span>
            </div>
          </div>

          <div className="ambulanz-header-right">
            <div className="triage-pill-wrapper">
              <span className="meta-label">Triage</span>
              <span className={`triage-pill ${triagePillClass}`}>
                {triageLabel}
              </span>
            </div>

            <div className="ambulanz-header-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saving" ? "Speichern..." : "Speichern"}
              </button>
              {saveStatus === "success" && (
                <span className="ambulanz-save-status ok">Gespeichert</span>
              )}
              {saveStatus === "error" && (
                <span className="ambulanz-save-status error">
                  Fehler beim Speichern
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="ambulanz-layout">
          {/* Linke Seite editierbare Infos */}
          <section className="ambulanz-section ambulanz-section--info">
            <header className="section-head">
              <div>
                <h3 className="ambulanz-section-title">Stammdaten / Status</h3>
                <p className="section-subtitle">
                  Aktualisiere Kerndaten, damit alle Teams auf dem gleichen
                  Stand sind.
                </p>
              </div>
            </header>

            <div className="info-fields">
              <div className="form-field">
                <label htmlFor="patientName">Name</label>
                <input
                  id="patientName"
                  type="text"
                  className="ambulanz-input"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                />
              </div>

              <div className="form-field">
                <label htmlFor="triagefarbe">Triagekategorie</label>
                <div className="select-wrapper">
                  <select
                    id="triagefarbe"
                    className="ambulanz-select"
                    value={formData.triagefarbe}
                    onChange={handleInputChange("triagefarbe")}
                  >
                    {triageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="status-grid" role="group" aria-label="Patientenstatus">
              {statusFields.map((field) => {
                const isActive = Boolean(formData[field.key]);
                return (
                  <label
                    key={field.key}
                    className={`status-toggle ${
                      isActive ? "status-toggle--active" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={handleCheckboxChange(field.key)}
                    />
                    <span className="status-toggle-check" aria-hidden="true" />
                    <span>{field.label}</span>
                  </label>
                );
              })}
            </div>

            <div className="section-divider">
              <h3 className="ambulanz-section-title ambulanz-section-title--compact">
                Position / Zeit
              </h3>
              <p className="section-subtitle">
                Koordinaten & Zeitstempel helfen Teams vor Ort beim
                Auffinden und Nachvollziehen.
              </p>
            </div>

            <div className="info-card-grid">
              <div className="info-card">
                <label htmlFor="latitude_patient">Breitengrad</label>
                <input
                  id="latitude_patient"
                  type="text"
                  className="ambulanz-input"
                  value={formData.latitude_patient}
                  onChange={handleInputChange("latitude_patient")}
                />
              </div>

              <div className="info-card">
                <label htmlFor="longitude_patient">Längengrad</label>
                <input
                  id="longitude_patient"
                  type="text"
                  className="ambulanz-input"
                  value={formData.longitude_patient}
                  onChange={handleInputChange("longitude_patient")}
                />
              </div>

              <div className="info-card">
                <label htmlFor="created_at">Erfasst</label>
                <input
                  id="created_at"
                  type="text"
                  className="ambulanz-input ambulanz-input--readonly"
                  value={formData.created_at}
                  readOnly
                />
              </div>

              <div className="info-card">
                <label htmlFor="updated_at">Letztes Update</label>
                <input
                  id="updated_at"
                  type="text"
                  className="ambulanz-input ambulanz-input--readonly"
                  value={formData.updated_at}
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* Rechte Seite – Körperkarte auch editierbar */}
          <section className="ambulanz-section ambulanz-bodymap">
            <header className="section-head ambulanz-bodymap-header">
              <div>
                <h3 className="ambulanz-section-title">Verletzungen</h3>
                <p className="section-subtitle">
                  Markiere betroffene Bereiche für das medizinische Team.
                </p>
              </div>
              <div
                className="ambulanz-toggle-group"
                role="group"
                aria-label="Ansicht wechseln"
              >
                <button
                  type="button"
                  className={`btn btn-xs ${
                    showFront ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setShowFront(true)}
                >
                  Front
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${
                    !showFront ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setShowFront(false)}
                >
                  Back
                </button>
              </div>
            </header>

            <div className="bodymap-surface">
              {isLoadingBodyParts ? (
                <p className="ambulanz-loading">Bodymap wird geladen...</p>
              ) : (
                <>
                  <div className="ambulanz-bodymap-viewport">
                    {showFront && (
                      <svg
                        className="body-svg body-svg--small"
                        viewBox="0 0 105 201"
                        preserveAspectRatio="xMidYMid meet"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g className="first-layer">
                          {Object.entries(bodyParts).map(([part, clicked]) => (
                            <BodyPartFront
                              key={part}
                              id={part}
                              onClick={handleBodyPartClick}
                              initialClickedState={clicked || false}
                            />
                          ))}
                        </g>
                      </svg>
                    )}

                    {!showFront && (
                      <svg
                        className="body-svg body-svg--small"
                        viewBox="0 0 103 202"
                        preserveAspectRatio="xMidYMid meet"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g className="first-layer">
                          {Object.entries(bodyParts).map(([part, clicked]) => (
                            <BodyPartBack
                              key={part}
                              id={part}
                              onClick={handleBodyPartClick}
                              initialClickedState={clicked || false}
                            />
                          ))}
                        </g>
                      </svg>
                    )}
                  </div>
                  <p className="bodymap-hint">
                    Tippe auf ein Segment, um Verletzungen zu markieren oder zu
                    entfernen.
                  </p>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AmbulanzForm;
