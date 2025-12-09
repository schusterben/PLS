import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";
import BodyPartFront from "../components/BodyPartsFront";
import BodyPartBack from "../components/BodyPartsBack";
import "./../../../css/AmbulanzForm.css";

function AmbulanzForm() {
  const location = useLocation();
  const navigate = useNavigate();
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
    atmung: null,
    blutung: null,
    transport: null,
    dringend: null,
    kontaminiert: null,
    latitude_patient: "",
    longitude_patient: "",
    created_at: "",
    updated_at: "",
  });

  const [ambuData, setAmbuData] = useState({
    vsnr: "",
    adresse: "",
    geburtsdatum: "",
    geschlecht: "",
    staat: "",
    telefon: "",
    arbeitgeber: "",
    versicherungstraeger: "",
    familienstand: "",
    al_atemweg: "",
    al_atmung: "",
    al_kreislauf: "",
    al_bewusstsein: "",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        triagefarbe: patient.triagefarbe || "",
        atmung:
          patient.atmung === null || patient.atmung === undefined
            ? null
            : Boolean(patient.atmung),
        blutung:
          patient.blutung === null || patient.blutung === undefined
            ? null
            : Boolean(patient.blutung),
        transport:
          patient.transport === null || patient.transport === undefined
            ? null
            : Boolean(patient.transport),
        dringend:
          patient.dringend === null || patient.dringend === undefined
            ? null
            : Boolean(patient.dringend),
        kontaminiert:
          patient.kontaminiert === null || patient.kontaminiert === undefined
            ? null
            : Boolean(patient.kontaminiert),
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

  // Ambu laden
  useEffect(() => {
    const fetchAmbu = async () => {
      if (!patientId) return;
      try {
        const res = await fetch(`/api/ambu/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 404) return; // noch kein Ambu erfasst
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAmbuData({
          vsnr: data.vsnr || "",
          adresse: data.adresse || "",
          geburtsdatum: data.geburtsdatum
            ? String(data.geburtsdatum).slice(0, 10)
            : "",
          geschlecht: data.geschlecht || "",
          staat: data.staat || "",
          telefon: data.telefon || "",
          arbeitgeber: data.arbeitgeber || "",
          versicherungstraeger: data.versicherungstraeger || "",
          familienstand: data.familienstand || "",
          al_atemweg: data.al_atemweg || "",
          al_atmung: data.al_atmung || "",
          al_kreislauf: data.al_kreislauf || "",
          al_bewusstsein: data.al_bewusstsein || "",
        });
      } catch (err) {
        console.error("Ambu-Daten konnten nicht geladen werden:", err);
      }
    };
    fetchAmbu();
  }, [patientId, token]);

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

  const triageHighlightClass = triageColorKey
    ? `triage-flash--${triageColorKey}`
    : "triage-flash--unset";

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

  const handleBooleanSelect = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]:
        value === ""
          ? null
          : value === "true"
          ? true
          : false,
    }));
  };

  // Speichern in die DB – funktioniert noch nicht richtig
  const handleSave = async () => {
    if (!patientId) return;

    setSaveStatus("saving");

    const sanitizedName =
      typeof formData.name === "string" ? formData.name.trim() : "";

    const normalizeValue = (raw) => {
      if (raw === null || raw === undefined) return null;
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed === "" || trimmed === "-" ? null : trimmed;
      }
      return raw;
    };

    const parseCoordinate = (raw) => {
      const normalized = normalizeValue(raw);
      if (normalized === null) return null;
      const parsed = parseFloat(normalized);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const normalizeBoolean = (raw) => {
      if (raw === null || raw === undefined) return null;
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (trimmed === "" || trimmed === "-") return null;
        if (trimmed.toLowerCase() === "true") return true;
        if (trimmed.toLowerCase() === "false") return false;
      }
      return raw;
    };

    const payload = {
      triageColor: normalizeValue(formData.triagefarbe),
      lat: parseCoordinate(formData.latitude_patient),
      lng: parseCoordinate(formData.longitude_patient),
      respiration: normalizeBoolean(formData.atmung),
      bloodStopable: normalizeBoolean(formData.blutung),
      name: normalizeValue(sanitizedName),
      transport: normalizeBoolean(formData.transport),
      dringend: normalizeBoolean(formData.dringend),
      kontaminiert: normalizeBoolean(formData.kontaminiert),
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

      const ambuPayload = {
        vsnr: normalizeValue(ambuData.vsnr),
        adresse: normalizeValue(ambuData.adresse),
        geburtsdatum: normalizeValue(ambuData.geburtsdatum),
        geschlecht: normalizeValue(ambuData.geschlecht),
        staat: normalizeValue(ambuData.staat),
        telefon: normalizeValue(ambuData.telefon),
        arbeitgeber: normalizeValue(ambuData.arbeitgeber),
        versicherungstraeger: normalizeValue(ambuData.versicherungstraeger),
        familienstand: normalizeValue(ambuData.familienstand),
        al_atemweg: normalizeValue(ambuData.al_atemweg),
        al_atmung: normalizeValue(ambuData.al_atmung),
        al_kreislauf: normalizeValue(ambuData.al_kreislauf),
        al_bewusstsein: normalizeValue(ambuData.al_bewusstsein),
      };

      const ambuRes = await fetch(`/api/ambu/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ambuPayload),
      });

      if (!ambuRes.ok) {
        throw new Error(`Ambu HTTP ${ambuRes.status}`);
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

  const formatForDisplay = (value) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

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

              <span className="meta-chip meta-chip--wide">
                <div className="meta-stack">
                  <span className="meta-label">Letztes Update</span>
                  <span className="meta-value">
                    {formatForDisplay(formData.updated_at || "—")}
                  </span>
                </div>
              </span>
                <div className={`triage-flash ${triageHighlightClass}`}>
                  <span className="triage-flash-dot" aria-hidden="true" />
                  <div className="triage-flash-text">
                    <span className="triage-flash-label">Triage</span>
                    <span className="triage-flash-value">{triageLabel}</span>
                  </div>
                </div>
            </div>
          </div>

          <div className="ambulanz-header-right">
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
                <h3 className="ambulanz-section-title">Triagedaten</h3>
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
              {statusFields.map((field) => (
                <div key={field.key} className="status-select">
                  <label htmlFor={`status-${field.key}`}>{field.label}</label>
                  <select
                    id={`status-${field.key}`}
                    className="ambulanz-select"
                    value={
                      formData[field.key] === null ||
                      formData[field.key] === undefined
                        ? ""
                        : formData[field.key]
                        ? "true"
                        : "false"
                    }
                    onChange={handleBooleanSelect(field.key)}
                  >
                    <option value="">-</option>
                    <option value="true">Ja</option>
                    <option value="false">Nein</option>
                  </select>
                </div>
              ))}
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
              <div className="info-card info-card--compact">
                <p className="info-card-label">Breitengrad</p>
                <span className="info-card-value">
                  {formData.latitude_patient || "-"}
                </span>
              </div>

              <div className="info-card info-card--compact">
                <p className="info-card-label">Längengrad</p>
                <span className="info-card-value">
                  {formData.longitude_patient || "-"}
                </span>
              </div>

              <div className="info-card info-card--compact">
                <p className="info-card-label">Erfasst</p>
                <span className="info-card-value">
                  {formatForDisplay(formData.created_at)}
                </span>
              </div>

              <div className="info-card info-card--compact">
                <p className="info-card-label">Letztes Update</p>
                <span className="info-card-value">
                  {formatForDisplay(formData.updated_at)}
                </span>
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
          {/* Ambu Section fürs Nacherfassen*/}
          <section className="ambulanz-section ambulanz-section--full">
            <header className="section-head">
              <div>
                <h3 className="ambulanz-section-title">Ambulanzbogen</h3>
              </div>
            </header>

            <div className="section-divider">
              <h4 className="ambulanz-section-title ambulanz-section-title--compact">
                Weitere Stammdaten
              </h4>
            </div>

            <div className="info-fields">
              <div className="form-field">
                <label>Versicherungsnummer</label>
                <input
                  className="ambulanz-input"
                  type="text"
                  value={ambuData.vsnr}
                  onChange={(e) =>
                    setAmbuData((prev) => ({ ...prev, vsnr: e.target.value }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Adresse</label>
                <input
                  className="ambulanz-input"
                  type="text"
                  value={ambuData.adresse}
                  onChange={(e) =>
                    setAmbuData((prev) => ({ ...prev, adresse: e.target.value }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Geburtsdatum</label>
                <input
                  className="ambulanz-input"
                  type="date"
                  value={ambuData.geburtsdatum}
                  onChange={(e) =>
                    setAmbuData((prev) => ({
                      ...prev,
                      geburtsdatum: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Geschlecht</label>
                <div className="select-wrapper">
                  <select
                    className="ambulanz-select"
                    value={ambuData.geschlecht}
                    onChange={(e) =>
                      setAmbuData((prev) => ({
                        ...prev,
                        geschlecht: e.target.value,
                      }))
                    }
                  >
                    <option value="">-</option>
                    <option value="männlich">Männlich</option>
                    <option value="weiblich">Weiblich</option>
                    <option value="divers">Divers</option>
                    <option value="unbekannt">Unbekannt</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Staat</label>
                <input
                  className="ambulanz-input"
                  type="text"
                  value={ambuData.staat}
                  onChange={(e) =>
                    setAmbuData((prev) => ({ ...prev, staat: e.target.value }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Telefon</label>
                <input
                  className="ambulanz-input"
                  type="text"
                  value={ambuData.telefon}
                  onChange={(e) =>
                    setAmbuData((prev) => ({ ...prev, telefon: e.target.value }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Arbeitgeber</label>
                <input
                  className="ambulanz-input"
                  type="text"
                  value={ambuData.arbeitgeber}
                  onChange={(e) =>
                    setAmbuData((prev) => ({
                      ...prev,
                      arbeitgeber: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Versicherungsträger</label>
                <input
                  className="ambulanz-input"
                  type="text"
                  value={ambuData.versicherungstraeger}
                  onChange={(e) =>
                    setAmbuData((prev) => ({
                      ...prev,
                      versicherungstraeger: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Familienstand</label>
                <div className="select-wrapper">
                  <select
                    className="ambulanz-select"
                    value={ambuData.familienstand}
                    onChange={(e) =>
                      setAmbuData((prev) => ({
                        ...prev,
                        familienstand: e.target.value,
                      }))
                    }
                  >
                    <option value="">-</option>
                    <option value="ledig">Ledig</option>
                    <option value="verheiratet">Verheiratet</option>
                    <option value="geschieden">Geschieden</option>
                    <option value="verwitwet">Verwitwet</option>
                    <option value="partnerschaft">Eingetragene Partnerschaft</option>
                    <option value="unbekannt">Unbekannt</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="section-divider">
              <h4 className="ambulanz-section-title ambulanz-section-title--compact">
                Allgemeiner Eindruck
              </h4>
            </div>

            <div className="info-fields">
              <div className="form-field">
                <label>Atemweg</label>
                <div className="select-wrapper">
                  <select
                    className="ambulanz-select"
                    value={ambuData.al_atemweg}
                    onChange={(e) =>
                      setAmbuData((prev) => ({
                        ...prev,
                        al_atemweg: e.target.value,
                      }))
                    }
                  >
                    <option value="">-</option>
                    <option value="frei">frei</option>
                    <option value="gefährdet">gefährdet</option>
                    <option value="verlegt">verlegt</option>
                    <option value="unauffällig">unauffällig</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Atmung</label>
                <div className="select-wrapper">
                  <select
                    className="ambulanz-select"
                    value={ambuData.al_atmung}
                    onChange={(e) =>
                      setAmbuData((prev) => ({
                        ...prev,
                        al_atmung: e.target.value,
                      }))
                    }
                  >
                    <option value="">-</option>
                    <option value="unauffällig">unauffällig</option>
                    <option value="Dyspnoe">Dyspnoe</option>
                    <option value="Atemgeräusche">Atemgeräusche</option>
                    <option value="Apnoe">Apnoe</option>
                    <option value="Schnappatmung">Schnappatmung</option>
                    <option value="Zyanose">Zyanose</option>
                    <option value="andere Atemstörungen">andere Atemstörungen</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Kreislauf</label>
                <div className="select-wrapper">
                  <select
                    className="ambulanz-select"
                    value={ambuData.al_kreislauf}
                    onChange={(e) =>
                      setAmbuData((prev) => ({
                        ...prev,
                        al_kreislauf: e.target.value,
                      }))
                    }
                  >
                    <option value="">-</option>
                    <option value="unauffällig">unauffällig</option>
                    <option value="Puls peripher tastbar">Puls peripher tastbar</option>
                    <option value="Tachykardie">Tachykardie</option>
                    <option value="Bradykardie">Bradykardie</option>
                    <option value="blass">blass</option>
                    <option value="kalt">kalt</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Bewusstsein</label>
                <div className="select-wrapper">
                  <select
                    className="ambulanz-select"
                    value={ambuData.al_bewusstsein}
                    onChange={(e) =>
                      setAmbuData((prev) => ({
                        ...prev,
                        al_bewusstsein: e.target.value,
                      }))
                    }
                  >
                    <option value="">-</option>
                    <option value="Wach">Wach</option>
                    <option value="Getrübt">Getrübt</option>
                    <option value="Bewusstlos">Bewusstlos</option>
                    <option value="Agitiert">Agitiert</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="ambulanz-next-wrapper">
          <button
            type="button"
            className="triage-fab ambulanz-next"
            onClick={() =>
              navigate("/AmbulanzForm2", {
                state: { patientId, patient, operationScene },
              })
            }
            title="Weiter zu Teil 2"
          >
            ➜
          </button>
        </div>
      </div>
    </div>
  );
}

export default AmbulanzForm;
