import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "./../contexts/ContextProvider";
import "./../../../css/AmbulanzForm.css";

export default function AmbulanzForm2() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useStateContext();
  const patientId = location.state?.patientId;
  const operationScene = location.state?.operationScene;
  const [formData, setFormData] = useState({
    erstdiagnose: "",
    naca_score: "",
    akutmedikation: "",
    pupillen_r: "",
    pupillen_l: "",
    schmerz: "",
    gcs_augen: "",
    gcs_verbal: "",
    gcs_motorisch: "",
    messwerte: "",
    massnahmen: "",
    massnahmen_peripherzugang: false,
    massnahmen_peripherzugang_dnr: "",
    massnahmen_herzdruckmassage: false,
    massnahmen_defibrillation: false,
    massnahmen_defibrillation_anz: "",
    massnahmen_defibrillation_letzte_joule: "",
    massnahmen_schrittmacher: false,
    massnahmen_schrittmacher_freq: "",
    massnahmen_schrittmacher_mv: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [loadError, setLoadError] = useState("");

  const nacaOptions = [
    { value: "", label: "-" },
    { value: "1", label: "I – geringfügige Störung" },
    { value: "2", label: "II – ambulante Abklärung" },
    { value: "3", label: "III – stationäre Behandlung" },
    { value: "4", label: "IV – akute Lebensgefahr möglich" },
    { value: "5", label: "V – akute Lebensgefahr" },
    { value: "6", label: "VI – Reanimation" },
    { value: "7", label: "VII – Tod" },
  ];

  const pupillenOptions = [
    { value: "", label: "-" },
    { value: "eng", label: "eng" },
    { value: "mittel", label: "mittel" },
    { value: "weit", label: "weit" },
    { value: "entrundet", label: "entrundet" },
    { value: "prompte Lichtreflexe", label: "prompte Lichtreflexe" },
    { value: "verlangsamte Lichtreflexe", label: "verlangsamte Lichtreflexe" },
    { value: "lichtstarr", label: "lichtstarr" },
  ];

  const schmerzOptions = [
    { value: "", label: "-" },
    ...Array.from({ length: 11 }).map((_, idx) => ({
      value: String(idx),
      label: String(idx),
    })),
    { value: "nicht beurteilbar", label: "nicht beurteilbar" },
  ];

  const gcsEye = [
    { value: "", label: "-" },
    { value: "4", label: "4 – spontan" },
    { value: "3", label: "3 – auf Aufforderung" },
    { value: "2", label: "2 – auf Schmerzreiz" },
    { value: "1", label: "1 – nicht" },
  ];

  const gcsVerbal = [
    { value: "", label: "-" },
    { value: "5", label: "5 – orientiert" },
    { value: "4", label: "4 – desorientiert" },
    { value: "3", label: "3 – inadäquate Äußerung" },
    { value: "2", label: "2 – unverständliche Laute" },
    { value: "1", label: "1 – keine" },
  ];

  const gcsMotor = [
    { value: "", label: "-" },
    { value: "6", label: "6 – auf Aufforderung" },
    { value: "5", label: "5 – gezielt auf Schmerzreiz" },
    { value: "4", label: "4 – ungezielt auf Schmerzreiz" },
    { value: "3", label: "3 – abnorme Beugeabwehr" },
    { value: "2", label: "2 – Streckneigung" },
    { value: "1", label: "1 – keine" },
  ];

  const hasGcsValues =
    formData.gcs_augen || formData.gcs_verbal || formData.gcs_motorisch;
  const gcsSumNumber =
    (Number(formData.gcs_augen) || 0) +
    (Number(formData.gcs_verbal) || 0) +
    (Number(formData.gcs_motorisch) || 0);
  const gcsSum = hasGcsValues ? gcsSumNumber : "";

  useEffect(() => {
    if (!patientId) return;
    const controller = new AbortController();
    const fetchAmbu = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/ambu/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (res.status === 404) {
          setIsLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          erstdiagnose: data.erstdiagnose || "",
          naca_score:
            data.naca_score === 0 || data.naca_score
              ? String(data.naca_score)
              : "",
          akutmedikation: data.akutmedikation || "",
          pupillen_r: data.pupillen_r || "",
          pupillen_l: data.pupillen_l || "",
          schmerz:
            data.schmerz_text ||
            (data.schmerz === 0 || data.schmerz
              ? String(data.schmerz)
              : ""),
          gcs_augen:
            data.gcs_augen === 0 || data.gcs_augen
              ? String(data.gcs_augen)
              : "",
          gcs_verbal:
            data.gcs_verbal === 0 || data.gcs_verbal
              ? String(data.gcs_verbal)
              : "",
          gcs_motorisch:
            data.gcs_motorisch === 0 || data.gcs_motorisch
              ? String(data.gcs_motorisch)
              : "",
          messwerte: data.messwerte || "",
          massnahmen: data.weitere_massnahmen || "",
          massnahmen_peripherzugang: Boolean(data.ma_peripherzugang),
          massnahmen_peripherzugang_dnr: data.ma_peripherzugang_dnr || "",
          massnahmen_herzdruckmassage: Boolean(data.ma_herzdruckmassage),
          massnahmen_defibrillation: Boolean(data.ma_defibrillation),
          massnahmen_defibrillation_anz:
            data.ma_defibrillation_anz === 0 || data.ma_defibrillation_anz
              ? String(data.ma_defibrillation_anz)
              : "",
          massnahmen_defibrillation_letzte_joule:
            data.ma_defibrillation_letzte_joule === 0 ||
            data.ma_defibrillation_letzte_joule
              ? String(data.ma_defibrillation_letzte_joule)
              : "",
          massnahmen_schrittmacher: Boolean(data.ma_schrittmacher),
          massnahmen_schrittmacher_freq:
            data.ma_schrittmacher_freq === 0 || data.ma_schrittmacher_freq
              ? String(data.ma_schrittmacher_freq)
              : "",
          massnahmen_schrittmacher_mv:
            data.ma_schrittmacher_mv === 0 || data.ma_schrittmacher_mv
              ? String(data.ma_schrittmacher_mv)
              : "",
        }));
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Ambu-Daten (Teil 2) konnten nicht geladen werden:", err);
        setLoadError("Ambu-Daten konnten nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmbu();

    return () => controller.abort();
  }, [patientId, token]);

  const handleSave = async () => {
    if (!patientId) return;
    setSaveStatus("saving");
    setLoadError("");

    const normalize = (value) => {
      if (value === null || value === undefined) return null;
      const trimmed = String(value).trim();
      if (trimmed === "" || trimmed === "-") return null;
      return trimmed;
    };

    const parseIntOrNull = (value) => {
      const normalized = normalize(value);
      if (normalized === null) return null;
      const parsed = parseInt(normalized, 10);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const schmerzNumber = parseIntOrNull(formData.schmerz);
    const schmerzText =
      schmerzNumber === null ? normalize(formData.schmerz) : null;
    const gcsSumValue = hasGcsValues ? gcsSumNumber : null;

    const formatPupillen = () => {
      const right = normalize(formData.pupillen_r) ?? "-";
      const left = normalize(formData.pupillen_l) ?? "-";
      if (right === "-" && left === "-") return null;
      return `R: ${right} / L: ${left}`;
    };

    const formatKreislauf = () => {
      const parts = [];
      if (formData.massnahmen_peripherzugang) {
        const dnr = normalize(formData.massnahmen_peripherzugang_dnr);
        parts.push(`Zugang${dnr ? ` (DNr: ${dnr})` : ""}`);
      }
      if (formData.massnahmen_herzdruckmassage) {
        parts.push("Herzdruckmassage");
      }
      if (formData.massnahmen_defibrillation) {
        const anz = normalize(formData.massnahmen_defibrillation_anz);
        const joule = normalize(formData.massnahmen_defibrillation_letzte_joule);
        parts.push(
          `Defibrillation/Kardiov.${anz ? ` Anz.: ${anz}` : ""}${
            joule ? ` letzte Joule: ${joule}` : ""
          }`
        );
      }
      if (formData.massnahmen_schrittmacher) {
        const freq = normalize(formData.massnahmen_schrittmacher_freq);
        const mv = normalize(formData.massnahmen_schrittmacher_mv);
        parts.push(
          `Schrittmacher extern${freq ? ` Freq.: ${freq}` : ""}${
            mv ? ` mV: ${mv}` : ""
          }`
        );
      }
      return parts.length ? parts.join(" | ") : null;
    };

    const payload = {
      naca_score: parseIntOrNull(formData.naca_score),
      erstdiagnose: normalize(formData.erstdiagnose),
      akutmedikation: normalize(formData.akutmedikation),
      pupillen_r: normalize(formData.pupillen_r),
      pupillen_l: normalize(formData.pupillen_l),
      pupillen: formatPupillen(),
      schmerz: schmerzNumber,
      schmerz_text: schmerzText,
      glasgow_coma_scale: gcsSumValue,
      gcs_augen: parseIntOrNull(formData.gcs_augen),
      gcs_verbal: parseIntOrNull(formData.gcs_verbal),
      gcs_motorisch: parseIntOrNull(formData.gcs_motorisch),
      messwerte: normalize(formData.messwerte),
      ma_kreislauf: formatKreislauf(),
      ma_peripherzugang: formData.massnahmen_peripherzugang,
      ma_peripherzugang_dnr: normalize(formData.massnahmen_peripherzugang_dnr),
      ma_herzdruckmassage: formData.massnahmen_herzdruckmassage,
      ma_defibrillation: formData.massnahmen_defibrillation,
      ma_defibrillation_anz: parseIntOrNull(formData.massnahmen_defibrillation_anz),
      ma_defibrillation_letzte_joule: parseIntOrNull(
        formData.massnahmen_defibrillation_letzte_joule
      ),
      ma_schrittmacher: formData.massnahmen_schrittmacher,
      ma_schrittmacher_freq: parseIntOrNull(formData.massnahmen_schrittmacher_freq),
      ma_schrittmacher_mv: parseIntOrNull(formData.massnahmen_schrittmacher_mv),
      weitere_massnahmen: normalize(formData.massnahmen),
    };

    try {
      const res = await fetch(`/api/ambu/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSaveStatus("success");
    } catch (err) {
      console.error("Speichern (Teil 2) fehlgeschlagen:", err);
      setSaveStatus("error");
      setLoadError("Speichern fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  if (!patientId) {
    return (
      <div className="ambulanz-page">
        <div className="ambulanz-card">
          <h2 className="ambulanz-title">Ambulanzformular – Teil 2</h2>
          <p className="triage-status error">
            Keine Patient:In-ID vorhanden. Bitte über die Übersicht oder den Scan
            aufrufen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ambulanz-page" role="main" aria-labelledby="ambulanz2Title">
      <div className="ambulanz-card">
        <header className="ambulanz-header">
          <div className="ambulanz-header-left">
            <h2 id="ambulanz2Title" className="ambulanz-title">
              Ambulanzformular – Teil 2
            </h2>
            <div className="ambulanz-meta-row">
              <span className="meta-chip">
                <span className="meta-label">Patient:In</span>
                <span className="meta-value">#{patientId ?? "–"}</span>
              </span>
              {operationScene && (
                <span className="meta-chip">
                  <span className="meta-label">Einsatzszene</span>
                  <span className="meta-value">
                    {typeof operationScene === "string"
                      ? operationScene
                      : operationScene?.name || "–"}
                  </span>
                </span>
              )}
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
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(-1)}
              >
                Zurück
              </button>
            </div>
          </div>
        </header>
        {isLoading && (
          <p className="triage-status" style={{ marginTop: "8px" }}>
            Lade bestehende Ambu-Daten...
          </p>
        )}
        {loadError && (
          <p className="triage-status error" style={{ marginTop: "8px" }}>
            {loadError}
          </p>
        )}

        <div className="ambulanz-layout">
          <section className="ambulanz-section ambulanz-section--full">
            <header className="section-head">
              <div>
                <h3 className="ambulanz-section-title">Fortsetzung</h3>
                <p className="section-subtitle">
                  Ergänzungen zum Ambulanzbogen.
                </p>
              </div>
            </header>
            <div className="info-fields">
              <div className="form-field">
                <label htmlFor="erstdiagnose">Erstdiagnose</label>
                <textarea
                  id="erstdiagnose"
                  className="ambulanz-input"
                  rows="3"
                  value={formData.erstdiagnose}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      erstdiagnose: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="akutmedikation">Akutmedikation (durch RD)</label>
                <textarea
                  id="akutmedikation"
                  className="ambulanz-input"
                  rows="3"
                  placeholder="Medikament, Dosis, Art, Uhrzeit"
                  value={formData.akutmedikation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      akutmedikation: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="nacaScore">NACA-Score</label>
                <div className="select-wrapper">
                  <select
                    id="nacaScore"
                    className="ambulanz-select"
                    value={formData.naca_score}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        naca_score: e.target.value,
                      }))
                    }
                  >
                    {nacaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Pupillen</label>
                <div className="info-fields" style={{ padding: 0 }}>
                  <div className="form-field">
                    <label htmlFor="pupillenR">rechts</label>
                    <div className="select-wrapper">
                      <select
                        id="pupillenR"
                        className="ambulanz-select"
                        value={formData.pupillen_r}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pupillen_r: e.target.value,
                          }))
                        }
                      >
                        {pupillenOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="pupillenL">links</label>
                    <div className="select-wrapper">
                      <select
                        id="pupillenL"
                        className="ambulanz-select"
                        value={formData.pupillen_l}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pupillen_l: e.target.value,
                          }))
                        }
                      >
                        {pupillenOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="schmerz">Schmerz (0–10)</label>
                <div className="select-wrapper">
                  <select
                    id="schmerz"
                    className="ambulanz-select"
                    value={formData.schmerz}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        schmerz: e.target.value,
                      }))
                    }
                  >
                    {schmerzOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Glasgow Coma Scale</label>
                <div className="info-fields" style={{ padding: 0 }}>
                  <div className="form-field">
                    <label htmlFor="gcsEye">Augen öffnen</label>
                    <div className="select-wrapper">
                      <select
                        id="gcsEye"
                        className="ambulanz-select"
                        value={formData.gcs_augen}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gcs_augen: e.target.value,
                          }))
                        }
                      >
                        {gcsEye.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="gcsVerbal">verbale Reaktion</label>
                    <div className="select-wrapper">
                      <select
                        id="gcsVerbal"
                        className="ambulanz-select"
                        value={formData.gcs_verbal}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gcs_verbal: e.target.value,
                          }))
                        }
                      >
                        {gcsVerbal.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="gcsMotor">motorische Reaktion</label>
                    <div className="select-wrapper">
                      <select
                        id="gcsMotor"
                        className="ambulanz-select"
                        value={formData.gcs_motorisch}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gcs_motorisch: e.target.value,
                          }))
                        }
                      >
                        {gcsMotor.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="meta-chip" style={{ marginTop: "6px" }}>
                  <span className="meta-label">GCS-Summe</span>
                  <span className="meta-value">
                    {gcsSum === "" ? "–" : gcsSum}
                  </span>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="messwerte">Messwerte</label>
                <textarea
                  id="messwerte"
                  className="ambulanz-input"
                  rows="3"
                  placeholder="z.B. RR, AF, Temp., BZ, etCO2, SpO₂"
                  value={formData.messwerte}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      messwerte: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="ambulanz-section ambulanz-section--full">
            <header className="section-head">
              <div>
                <h3 className="ambulanz-section-title">maßnahmen</h3>
                <p className="section-subtitle">
                  Dokumentation der durchgeführten Maßnahmen.
                </p>
              </div>
            </header>
            <div className="info-fields">
              <div className="form-field">
                <h4 className="section-subtitle" style={{ marginBottom: "8px" }}>
                  Herz / Kreislauf
                </h4>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px 16px",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={formData.massnahmen_peripherzugang}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_peripherzugang: e.target.checked,
                          }))
                        }
                      />
                      <span>peripherven. Zugang / IO Zugang</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>DNr:</span>
                      <input
                        type="text"
                        className="ambulanz-input"
                        style={{ width: "140px" }}
                        value={formData.massnahmen_peripherzugang_dnr}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_peripherzugang_dnr: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={formData.massnahmen_herzdruckmassage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          massnahmen_herzdruckmassage: e.target.checked,
                        }))
                      }
                    />
                    <span>Herzdruckmassage</span>
                  </label>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px 16px",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={formData.massnahmen_defibrillation}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_defibrillation: e.target.checked,
                          }))
                        }
                      />
                      <span>Defibrillation/Kardiov.</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>Anz.:</span>
                      <input
                        type="text"
                        className="ambulanz-input"
                        style={{ width: "90px" }}
                        value={formData.massnahmen_defibrillation_anz}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_defibrillation_anz: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>letzte Joule:</span>
                      <input
                        type="text"
                        className="ambulanz-input"
                        style={{ width: "110px" }}
                        value={formData.massnahmen_defibrillation_letzte_joule}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_defibrillation_letzte_joule: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px 16px",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={formData.massnahmen_schrittmacher}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_schrittmacher: e.target.checked,
                          }))
                        }
                      />
                      <span>Schrittmacher extern</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>Freq.:</span>
                      <input
                        type="text"
                        className="ambulanz-input"
                        style={{ width: "90px" }}
                        value={formData.massnahmen_schrittmacher_freq}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_schrittmacher_freq: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>mV:</span>
                      <input
                        type="text"
                        className="ambulanz-input"
                        style={{ width: "90px" }}
                        value={formData.massnahmen_schrittmacher_mv}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            massnahmen_schrittmacher_mv: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="massnahmen">Maßnahmen</label>
                <textarea
                  id="massnahmen"
                  className="ambulanz-input"
                  rows="4"
                  placeholder="z.B. Infusionen, Immobilisation, Analgesie"
                  value={formData.massnahmen}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      massnahmen: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
