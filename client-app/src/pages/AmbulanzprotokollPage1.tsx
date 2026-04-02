import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useWatch, type FieldPath, type UseFormReturn } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import {
  type Page1FieldOption,
  type Page1FieldSpec,
  type Page1ZoneId,
} from '../features/ambulanzprotokoll-page1/page1FieldSchema';
import { resolvePage1ZoneBindings } from '../features/ambulanzprotokoll-page1/page1FieldBindings';
import {
  createMedicationAdministration,
  MAX_MEDICATION_ROWS,
  normalizeMedicationAdministrations,
  type BodyMapMarker,
  type Page1State,
} from '../features/ambulanzprotokoll-page1/page1State';
import { useAmbulanzprotokollPage1Workflow } from '../features/ambulanzprotokoll-page1/page1Workflow';
import '../styles/ambulanzprotokoll-page1.css';

type Zone = {
  id: string;
  label: string;
  rectPct: { x: number; y: number; w: number; h: number };
  tone?: 'band' | 'panel' | 'split';
  rail?: string;
  railRight?: string;
};

type PageState = Page1State;

const zones: Zone[] = [
  { id: 'brand_header', label: 'JOHANNITER / AMBULANZPROTOKOLL', rectPct: { x: 0, y: 0, w: 23, h: 6 }, tone: 'band' },
  { id: 'incident_header', label: 'Ambulanzort, Protokoll- / PLS-Nummer, Datum, Uhrzeit-Beginn, DNr.-San., DNr.-NA, Funkrufname / Behandlungsplatz', rectPct: { x: 23, y: 0, w: 77, h: 6 }, tone: 'panel' },
  { id: 'patient_block', label: 'Patient - Familienname, Vorname, Ges., Vers.-Nr., Geb.-Datum, Adresse, Staat, Telefon, Arbeitgeber, Versicherungsträger, Familienstand', rectPct: { x: 0, y: 6, w: 100, h: 10 }, tone: 'panel' },
  { id: 'erstdiagnose_allgemein', label: 'ERST.-DIAGN. / NACA / ALLG. EINDRUCK', rectPct: { x: 0, y: 16, w: 100, h: 9 }, tone: 'band', rail: 'ERST.-DIAGN.' },
  { id: 'anamnese_bodymap', label: 'ANAMNESE / UNTERSUCHUNG / Body map', rectPct: { x: 0, y: 25, w: 100, h: 27 }, tone: 'split', rail: 'ANAMNESE / UNTERSUCHUNG' },
  { id: 'akutmedikation', label: 'Akutmedikation durch RD', rectPct: { x: 0, y: 52, w: 100, h: 8 }, tone: 'panel' },
  { id: 'erst_endbefund', label: 'ERST- / ENDBEFUND', rectPct: { x: 0, y: 60, w: 100, h: 17 }, tone: 'band', rail: 'ERST- / ENDBEFUND' },
  { id: 'massnahmen_ample', label: 'MASSNAHMEN / AMPLE-SCHEMA / Allergien / Medikamente / Patientengeschichte / Letzte orale Aufnahme / Ereignisse zuvor / Risikofaktoren', rectPct: { x: 0, y: 77, w: 100, h: 17 }, tone: 'split', rail: 'MASSNAHMEN', railRight: 'AMPLE-SCHEMA' },
  { id: 'footer_disposition', label: 'Übergabe/Belassung/Revers / Klinischer Zustand / Uhrzeit-Ende / Org. / Typ. / Kennung / Angehörige in Kenntnis / Kontaktdaten / Unterschrift', rectPct: { x: 0, y: 94, w: 100, h: 6 }, tone: 'panel' },
];

function zoneClassName(zone: Zone) {
  return ['ambd-zone', `ambd-zone--${zone.tone ?? 'panel'}`, `ambd-zone--${zone.id}`].join(' ');
}

function readBindValue(source: PageState, bind: string) {
  return bind.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);
}

function formatScalarValue(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return '';
  }

  return String(value);
}

function PaperLine({ value }: { value: string }) {
  return <div className="ambd-paper-line">{value || '\u00A0'}</div>;
}

function CheckboxOption({
  inline = false,
  inputType = 'checkbox',
  onChange,
  option,
  selected,
}: {
  inline?: boolean;
  inputType?: 'checkbox' | 'radio';
  onChange?: (checked: boolean) => void;
  option: Page1FieldOption;
  selected: boolean;
}) {
  return (
    <label className={inline ? 'ambd-checkbox-option ambd-checkbox-option--inline' : 'ambd-checkbox-option'}>
      <input
        checked={selected}
        className="ambd-checkbox-input"
        onChange={(event) => onChange?.(event.target.checked)}
        type={inputType}
      />
      <span className={selected ? 'ambd-checkbox ambd-checkbox--checked' : 'ambd-checkbox'} aria-hidden="true" />
      <span>{option.label}</span>
    </label>
  );
}

function renderOptionList(
  form: UseFormReturn<PageState>,
  bind: string,
  options: Page1FieldOption[] | undefined,
  selectedValues: string[] = [],
  inline = false,
  mode: 'checkbox' | 'radio' = 'checkbox',
) {
  const className = inline ? 'ambd-checkbox-group ambd-checkbox-group--inline' : 'ambd-checkbox-group';

  return (
    <div className={className}>
      {(options ?? []).map((option) => (
        <CheckboxOption
          key={option.value}
          inline={inline}
          inputType={mode}
          onChange={(checked) => {
            const path = bind as FieldPath<PageState>;

            if (mode === 'radio') {
              if (!checked) {
                return;
              }

              const nextValue = /^-?\d+$/.test(option.value) ? Number(option.value) : option.value;
              form.setValue(path, nextValue as never, { shouldDirty: true, shouldTouch: true });
              return;
            }

            const current = readBindValue(form.getValues(), bind);
            const currentValues = Array.isArray(current) ? current.map(String) : [];
            const nextValues = checked
              ? Array.from(new Set([...currentValues, option.value]))
              : currentValues.filter((value) => value !== option.value);

            form.setValue(path, nextValues as never, { shouldDirty: true, shouldTouch: true });
          }}
          option={option}
          selected={selectedValues.includes(option.value)}
        />
      ))}
    </div>
  );
}

// ── Body map ──────────────────────────────────────────────────────────────────

const MARKER_COLORS: Record<string, string> = {
  wunde: '#e53e3e',
  fraktur: '#dd6b20',
  schmerz: '#d69e2e',
  prellung: '#805ad5',
  amputation: '#2b6cb0',
  verbrennung: '#c05621',
  luxation: '#276749',
};

function markerColor(marker: string): string {
  return MARKER_COLORS[marker] ?? '#555';
}

function HumanFigure() {
  return (
    <>
      <circle cx="30" cy="10" r="8" className="ambd-figure-part" />
      <rect x="19" y="20" width="22" height="40" rx="3" className="ambd-figure-part" />
      <rect x="7" y="22" width="11" height="30" rx="4" className="ambd-figure-part" />
      <rect x="42" y="22" width="11" height="30" rx="4" className="ambd-figure-part" />
      <rect x="19" y="61" width="10" height="44" rx="4" className="ambd-figure-part" />
      <rect x="31" y="61" width="10" height="44" rx="4" className="ambd-figure-part" />
    </>
  );
}

function BodyMapField({
  bind,
  form,
  markerOptions,
  value,
}: {
  bind: string;
  form: UseFormReturn<PageState>;
  markerOptions: Page1FieldOption[];
  value: BodyMapMarker[];
}) {
  const [activeMarker, setActiveMarker] = useState<string>(markerOptions[0]?.value ?? 'wunde');
  const path = bind as FieldPath<PageState>;

  function handleSvgClick(view: 'front' | 'back', e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const nextValue: BodyMapMarker[] = [...value, { view, marker: activeMarker, x, y }];
    form.setValue(path, nextValue as never, { shouldDirty: true, shouldTouch: true });
  }

  function removeMarker(idx: number) {
    const nextValue = value.filter((_, i) => i !== idx);
    form.setValue(path, nextValue as never, { shouldDirty: true, shouldTouch: true });
  }

  return (
    <div className="ambd-body-map">
      <div className="ambd-body-map-figures">
        {(['front', 'back'] as const).map((view) => {
          const viewMarkers = value
            .map((m, i) => ({ ...m, idx: i }))
            .filter((m) => m.view === view);
          return (
            <div key={view} className="ambd-body-map-fig-wrap">
              <span className="ambd-body-map-fig-label">{view === 'front' ? 'Vorne' : 'Hinten'}</span>
              <svg
                className="ambd-body-map-svg"
                viewBox="0 0 60 110"
                onClick={(e) => handleSvgClick(view, e)}
                role="img"
                aria-label={`Körperkarte ${view === 'front' ? 'Vorderseite' : 'Rückseite'} — klicken zum Markieren`}
              >
                <HumanFigure />
                {viewMarkers.map((m) => (
                  <circle
                    key={m.idx}
                    cx={m.x * 0.6}
                    cy={m.y * 1.1}
                    r="3"
                    fill={markerColor(m.marker)}
                    stroke="#fff"
                    strokeWidth="0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMarker(m.idx);
                    }}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-label={`Markierung ${m.marker} entfernen`}
                  />
                ))}
              </svg>
            </div>
          );
        })}
      </div>
      <div className="ambd-body-map-legend">
        {markerOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              activeMarker === option.value ? 'ambd-legend-btn ambd-legend-btn--active' : 'ambd-legend-btn'
            }
            onClick={() => setActiveMarker(option.value)}
          >
            <span
              className="ambd-legend-dot"
              style={{ background: markerColor(option.value) }}
              aria-hidden="true"
            />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Signature canvas ──────────────────────────────────────────────────────────

function SignatureCanvas({
  bind,
  form,
  value,
}: {
  bind: string;
  form: UseFormReturn<PageState>;
  value: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const path = bind as FieldPath<PageState>;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [value]);

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pt = getPoint(e);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#111';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  }

  function commitSignature() {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    form.setValue(path, canvas.toDataURL('image/png') as never, { shouldDirty: true, shouldTouch: true });
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    form.setValue(path, null as never, { shouldDirty: true, shouldTouch: true });
  }

  return (
    <div className="ambd-signature">
      <canvas
        ref={canvasRef}
        className="ambd-signature-canvas"
        width={240}
        height={72}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={commitSignature}
        onPointerLeave={commitSignature}
      />
      <button type="button" className="ambd-signature-clear" onClick={handleClear}>
        Löschen
      </button>
    </div>
  );
}

// ── Field rendering ───────────────────────────────────────────────────────────

const PUPILLEN_ROWS = [
  'eng',
  'mittel',
  'weit',
  'entrundet',
  'prompte Lichtreflexe',
  'verlangsamte Lichtreflexe',
  'lichtstarr',
] as const;

function renderFieldControl(field: Page1FieldSpec, draft: PageState, form: UseFormReturn<PageState>) {
  const value = readBindValue(draft, field.bind);
  const path = field.bind as FieldPath<PageState>;

  switch (field.type) {
    case 'line_text':
    case 'line_text_long':
    case 'tel':
      return <input className="ambd-paper-input" type="text" {...form.register(path)} />;
    case 'date':
      return <input className="ambd-paper-input" placeholder="TT.MM.JJ" type="text" {...form.register(path)} />;
    case 'segmented_date_visual':
      return (
        <input className="ambd-paper-input ambd-paper-input--segmented" placeholder="TT MM JJ" type="text" {...form.register(path)} />
      );
    case 'time':
    case 'time_optional':
      return <input className="ambd-paper-input" placeholder="__:__" type="text" {...form.register(path)} />;
    case 'compound_time_or_flags': {
      const timeValue = typeof value === 'object' && value && 'zeit' in value ? (value as { zeit?: unknown }).zeit : undefined;
      const flagValues =
        typeof value === 'object' && value
          ? Object.entries(value as Record<string, unknown>)
              .filter(([key, item]) => key !== 'zeit' && Boolean(item))
              .map(([key]) => key)
          : [];

      return (
        <div className="ambd-compound-time" data-bind={field.bind}>
          <input
            className="ambd-paper-input"
            onChange={(event) => {
              const current = (readBindValue(form.getValues(), field.bind) as Record<string, unknown> | undefined) ?? {};
              form.setValue(path, { ...current, zeit: event.target.value || null } as never, { shouldDirty: true, shouldTouch: true });
            }}
            placeholder="__:__"
            type="text"
            value={formatScalarValue(timeValue)}
          />
          <div className="ambd-checkbox-group ambd-checkbox-group--inline">
            {(field.options ?? []).map((option) => (
              <CheckboxOption
                key={option.value}
                inline
                onChange={(checked) => {
                  const current = (readBindValue(form.getValues(), field.bind) as Record<string, unknown> | undefined) ?? {};
                  form.setValue(path, { ...current, [option.value]: checked } as never, { shouldDirty: true, shouldTouch: true });
                }}
                option={option}
                selected={flagValues.includes(option.value)}
              />
            ))}
          </div>
        </div>
      );
    }
    case 'textarea_lined':
      return (
        <div className="ambd-textarea-lined" data-bind={field.bind}>
          <textarea className="ambd-paper-textarea" {...form.register(path)} />
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} className="ambd-textarea-line" aria-hidden="true" />
          ))}
        </div>
      );
    case 'checkbox_group': {
      const selected = Array.isArray(value) ? value.map(String) : [];
      return renderOptionList(form, field.bind, field.options, selected);
    }
    case 'checkbox_group_inline': {
      const selected = Array.isArray(value) ? value.map(String) : [];
      return renderOptionList(form, field.bind, field.options, selected, true);
    }
    case 'radio_group':
    case 'radio_group_inline': {
      const selected = value === null || value === undefined ? [] : [String(value)];
      return renderOptionList(form, field.bind, field.options, selected, field.type === 'radio_group_inline', 'radio');
    }
    case 'matrix_checkbox': {
      const matrixVal =
        value && typeof value === 'object' && !Array.isArray(value)
          ? (value as { R?: string[]; L?: string[] })
          : {};
      const rValues = matrixVal.R ?? [];
      const lValues = matrixVal.L ?? [];
      const columns = field.options ?? [];

      return (
        <div className="ambd-pupillen-matrix">
          <div className="ambd-pupillen-head">
            <span />
            {columns.map((col) => (
              <span key={col.value} className="ambd-pupillen-col-label">
                {col.label}
              </span>
            ))}
          </div>
          {PUPILLEN_ROWS.map((row) => (
            <div key={row} className="ambd-pupillen-row">
              <span className="ambd-pupillen-row-label">{row}</span>
              {columns.map((col) => {
                const colArr = col.value === 'R' ? rValues : lValues;
                const checked = colArr.includes(row);
                return (
                  <label key={col.value} className="ambd-pupillen-cell">
                    <input
                      type="checkbox"
                      checked={checked}
                      className="ambd-checkbox-input"
                      onChange={(e) => {
                        const cur =
                          (readBindValue(form.getValues(), field.bind) as
                            | { R: string[]; L: string[] }
                            | undefined) ?? { R: [], L: [] };
                        const colCur = (col.value === 'R' ? cur.R : cur.L) ?? [];
                        const colNext = e.target.checked
                          ? Array.from(new Set([...colCur, row]))
                          : colCur.filter((v) => v !== row);
                        form.setValue(
                          path,
                          { ...cur, [col.value]: colNext } as never,
                          { shouldDirty: true, shouldTouch: true },
                        );
                      }}
                    />
                    <span
                      className={checked ? 'ambd-checkbox ambd-checkbox--checked' : 'ambd-checkbox'}
                      aria-hidden="true"
                    />
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      );
    }
    case 'compound_rr':
      return (
        <div className="ambd-compound-rr" data-bind={field.bind}>
          <input className="ambd-paper-input" placeholder="sys / dia" type="text" {...form.register(path)} />
          <div className="ambd-compound-rr-subline">
            <span>Syst.</span>
            <span>Diast.</span>
          </div>
        </div>
      );
    case 'computed_number': {
      const gcsSum =
        Number(draft.vitals.gcs_augenoeffnen ?? 0)
        + Number(draft.vitals.gcs_verbale_reaktion ?? 0)
        + Number(draft.vitals.gcs_motorische_reaktion ?? 0);

      return <PaperLine value={gcsSum > 0 ? String(gcsSum) : formatScalarValue(value)} />;
    }
    case 'scale_line': {
      const selectedValue = typeof value === 'number' ? value : null;
      const naValue = Boolean(draft.vitals.schmerz_nicht_beurteilbar);
      const scalePoints = Array.from({ length: 11 }, (_, index) => index);
      const naPath = 'vitals.schmerz_nicht_beurteilbar' as FieldPath<PageState>;

      return (
        <div className="ambd-scale-line" data-bind={field.bind}>
          {scalePoints.map((point) => (
            <span
              key={point}
              className={selectedValue === point ? 'ambd-scale-point ambd-scale-point--active' : 'ambd-scale-point'}
              role="button"
              tabIndex={0}
              aria-pressed={selectedValue === point}
              aria-label={`Schmerz ${point}`}
              onClick={() => {
                const next = selectedValue === point ? null : point;
                form.setValue(path, next as never, { shouldDirty: true, shouldTouch: true });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const next = selectedValue === point ? null : point;
                  form.setValue(path, next as never, { shouldDirty: true, shouldTouch: true });
                }
              }}
            >
              <span className="ambd-scale-tick" aria-hidden="true" />
              <span>{point}</span>
            </span>
          ))}
          <label className="ambd-scale-na">
            <input
              type="checkbox"
              checked={naValue}
              className="ambd-checkbox-input"
              onChange={(e) =>
                form.setValue(naPath, e.target.checked, { shouldDirty: true, shouldTouch: true })
              }
            />
            <span className={naValue ? 'ambd-checkbox ambd-checkbox--checked' : 'ambd-checkbox'} aria-hidden="true" />
            <span>nicht beurteilbar</span>
          </label>
        </div>
      );
    }
    case 'body_map': {
      const markers = Array.isArray(value) ? (value as unknown[]).filter(isBodyMapMarker) : [];
      return (
        <BodyMapField
          bind={field.bind}
          form={form}
          markerOptions={field.options ?? []}
          value={markers}
        />
      );
    }
    case 'signature': {
      const sigValue = typeof value === 'string' ? value : null;
      return <SignatureCanvas bind={field.bind} form={form} value={sigValue} />;
    }
    default:
      return <PaperLine value={formatScalarValue(value)} />;
  }
}

function isBodyMapMarker(item: unknown): item is BodyMapMarker {
  return (
    typeof item === 'object'
    && item !== null
    && 'view' in item
    && 'marker' in item
    && 'x' in item
    && 'y' in item
  );
}

function renderField(field: Page1FieldSpec, draft: PageState, form: UseFormReturn<PageState>) {
  return (
    <div
      key={field.id}
      className="ambd-field"
      data-field-type={field.type}
      data-ambiguous={field.ambiguous ? 'true' : undefined}
      style={{ '--field-span': String(field.span) } as CSSProperties}
      title={field.ambiguityNote}
    >
      {field.label ? <span className="ambd-field-label">{field.label}</span> : null}
      {renderFieldControl(field, draft, form)}
    </div>
  );
}

function renderRows(fields: Page1FieldSpec[], draft: PageState, form: UseFormReturn<PageState>) {
  const rows = fields.reduce<Map<number, Page1FieldSpec[]>>((accumulator, field) => {
    const current = accumulator.get(field.row) ?? [];
    current.push(field);
    accumulator.set(field.row, current);
    return accumulator;
  }, new Map());

  return Array.from(rows.entries()).map(([row, rowFields]) => (
    <div key={row} className="ambd-field-row">
      {rowFields.map((field) => renderField(field, draft, form))}
    </div>
  ));
}

const MED_COLS = ['medikament', 'dosis', 'art', 'uhrzeit'] as const;
const MED_COL_LABELS: Record<(typeof MED_COLS)[number], string> = {
  medikament: 'Medikament',
  dosis: 'Dosis',
  art: 'Art',
  uhrzeit: 'Uhrzeit',
};
function renderZoneBody(zone: Zone, draft: PageState, form: UseFormReturn<PageState>) {
  if (zone.id === 'brand_header') {
    return (
      <div className="ambd-brand">
        <strong>JOHANNITER</strong>
        <span>AMBULANZPROTOKOLL</span>
      </div>
    );
  }

  if (zone.id === 'akutmedikation') {
    const medications = normalizeMedicationAdministrations(draft.medications_administered);

    return (
      <div className="ambd-medication-grid">
        <div className="ambd-medication-header">Akutmedikation durch RD</div>
        <div className="ambd-medication-table">
          {MED_COLS.map((col) => (
            <span key={col} className="ambd-medication-cell ambd-medication-cell--head">
              {MED_COL_LABELS[col]}
            </span>
          ))}
          {medications.map((row, rowIndex) =>
            MED_COLS.map((col) => (
              <input
                key={`${rowIndex}-${col}`}
                className="ambd-medication-cell ambd-medication-input"
                type="text"
                placeholder={col === 'uhrzeit' ? '__:__' : ''}
                value={(row[col] as string | null | undefined) ?? ''}
                onChange={(e) => {
                  const next = medications.map((r, i) =>
                    i === rowIndex ? { ...r, [col]: e.target.value || null } : r,
                  );
                  form.setValue('medications_administered', normalizeMedicationAdministrations(next), { shouldDirty: true, shouldTouch: true });
                }}
              />
            )),
          )}
        </div>
        {medications.length < MAX_MEDICATION_ROWS ? (
          <button
            type="button"
            className="ambd-medication-add"
            onClick={() => {
              const next = normalizeMedicationAdministrations([
                ...medications,
                createMedicationAdministration(),
              ]);
              form.setValue('medications_administered', next, { shouldDirty: true, shouldTouch: true });
            }}
          >
            + Zeile
          </button>
        ) : null}
      </div>
    );
  }

  const zoneFields = resolvePage1ZoneBindings(zone.id as Page1ZoneId);

  if (zone.id === 'anamnese_bodymap' || zone.id === 'massnahmen_ample') {
    const leftFields = zoneFields.filter((field) => field.column !== 'right');
    const rightFields = zoneFields.filter((field) => field.column === 'right');

    return (
      <div className="ambd-split-zone">
        <div className="ambd-split-column ambd-split-column--left">{renderRows(leftFields, draft, form)}</div>
        <div className="ambd-split-column ambd-split-column--right">{renderRows(rightFields, draft, form)}</div>
      </div>
    );
  }

  return <div className="ambd-zone-fields">{renderRows(zoneFields, draft, form)}</div>;
}

function PaperZone({ draft, form, zone }: { draft: PageState; form: UseFormReturn<PageState>; zone: Zone }) {
  return (
    <section
      className={zoneClassName(zone)}
      style={{
        left: `${zone.rectPct.x}%`,
        top: `${zone.rectPct.y}%`,
        width: `${zone.rectPct.w}%`,
        height: `${zone.rectPct.h}%`,
      }}
      aria-label={zone.label}
    >
      {zone.rail ? <div className="ambd-rail">{zone.rail}</div> : null}
      {zone.railRight ? <div className="ambd-rail ambd-rail--right">{zone.railRight}</div> : null}
      <div className="ambd-zone-body">{renderZoneBody(zone, draft, form)}</div>
    </section>
  );
}

function downloadJson(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AmbulanzprotokollPage1() {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const operationSceneId = location.state?.operationSceneId;
  const { token } = useAuthStore();
  const workflow = useAmbulanzprotokollPage1Workflow({
    patientId: Number(patientId),
    operationSceneId: typeof operationSceneId === 'number' ? operationSceneId : null,
    token,
  });
  const draft = (useWatch({ control: workflow.form.control }) ?? workflow.form.getValues()) as Page1State;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    document.title = `Ambulanzprotokoll Seite 1 - ${patientId ?? 'unbekannt'}`;
  }, [patientId]);

  useEffect(() => {
    const updateScale = () => {
      const availableWidth = Math.max(window.innerWidth - 32, 320);
      const availableHeight = Math.max(window.innerHeight - 160, 480);
      const nextScale = Math.min(availableWidth / 1241, availableHeight / 1755, 1);
      setScale(nextScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  function handleBack() {
    navigate('/SituationRoomTable', {
      state: typeof operationSceneId === 'number' ? { operationSceneId } : undefined,
    });
  }

  return (
    <div className="ambd-shell">
      <div className="ambd-topline">
        <div>
          <strong>Johanniter Ambulanzprotokoll</strong>
          <span>Seite 1 paper-mirror layout</span>
          <span>Status: {workflow.status}</span>
        </div>
        <div>
          <span>patientId: {patientId ?? 'unbekannt'}</span>
          <span>operationSceneId: {operationSceneId ?? 'n/a'}</span>
          <span>sync: {workflow.syncState}</span>
          {workflow.lastSavedAt ? <span>updatedAt: {workflow.lastSavedAt}</span> : null}
        </div>
      </div>

      <div className="ambd-actions">
        <button type="button" className="ambd-back-btn" onClick={handleBack}>
          ← Zurück
        </button>
        <button type="button" onClick={() => void workflow.finalize()}>
          Finalisieren
        </button>
        <button
          type="button"
          onClick={() =>
            downloadJson(`ambulanzprotokoll-page1-${patientId ?? 'draft'}.json`, workflow.exportJson)
          }
        >
          Export JSON
        </button>
      </div>
      {workflow.errorMessage ? <p role="alert">{workflow.errorMessage}</p> : null}

      <div className="ambd-stage" style={{ '--page-scale': String(scale) } as CSSProperties}>
        <div className="ambd-page" aria-label="Johanniter Ambulanzprotokoll Seite 1">
          {zones.map((zone) => (
            <PaperZone key={zone.id} draft={draft ?? workflow.form.getValues()} form={workflow.form} zone={zone} />
          ))}
        </div>
      </div>
    </div>
  );
}
