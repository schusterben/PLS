import { useEffect, useState, type CSSProperties } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useWatch, type FieldPath, type UseFormReturn } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import {
  type Page1FieldOption,
  type Page1FieldSpec,
  type Page1ZoneId,
} from '../features/ambulanzprotokoll-page1/page1FieldSchema';
import { resolvePage1ZoneBindings } from '../features/ambulanzprotokoll-page1/page1FieldBindings';
import type { Page1State } from '../features/ambulanzprotokoll-page1/page1State';
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
      const matrix = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
      return (
        <div className="ambd-matrix-checkbox" data-bind={field.bind}>
          <div className="ambd-matrix-checkbox-head">
            {(field.options ?? []).map((option) => (
              <span key={option.value}>{option.label}</span>
            ))}
          </div>
          <div className="ambd-matrix-checkbox-body">
            {Object.entries(matrix).map(([row, entries]) => (
              <div key={row} className="ambd-matrix-checkbox-row">
                <span>{row}</span>
                <span className="ambd-paper-line">{Array.isArray(entries) ? entries.join(', ') : ''}</span>
              </div>
            ))}
          </div>
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
      const scalePoints = Array.from({ length: 11 }, (_, index) => index);

      return (
        <div className="ambd-scale-line" data-bind={field.bind}>
          {scalePoints.map((point) => (
            <span key={point} className={selectedValue === point ? 'ambd-scale-point ambd-scale-point--active' : 'ambd-scale-point'}>
              <span className="ambd-scale-tick" aria-hidden="true" />
              <span>{point}</span>
            </span>
          ))}
          <span className="ambd-scale-na">
            <span className="ambd-checkbox" aria-hidden="true" />
            <span>nicht beurteilbar</span>
          </span>
        </div>
      );
    }
    case 'body_map':
      return (
        <div className="ambd-body-map" data-bind={field.bind}>
          <div className="ambd-body-map-labels">
            <span>R</span>
            <span>L</span>
            <span>R</span>
          </div>
          <div className="ambd-body-map-canvas">
            <div className="ambd-body-map-figure ambd-body-map-figure--front">front</div>
            <div className="ambd-body-map-figure ambd-body-map-figure--back">back</div>
          </div>
          <div className="ambd-body-map-legend">
            {(field.options ?? []).map((option) => (
              <CheckboxOption
                key={option.value}
                onChange={(checked) => {
                  const current = Array.isArray(readBindValue(form.getValues(), field.bind))
                    ? (readBindValue(form.getValues(), field.bind) as unknown[]).map(String)
                    : [];
                  const nextValues = checked
                    ? Array.from(new Set([...current, option.value]))
                    : current.filter((entry) => entry !== option.value);
                  form.setValue(path, nextValues as never, { shouldDirty: true, shouldTouch: true });
                }}
                option={option}
                selected={Array.isArray(value) && value.map(String).includes(option.value)}
              />
            ))}
          </div>
        </div>
      );
    case 'signature':
      return (
        <div className="ambd-signature" data-bind={field.bind}>
          <input className="ambd-paper-input" placeholder="Signatur" type="text" {...form.register(path)} />
        </div>
      );
    default:
      return <PaperLine value={formatScalarValue(value)} />;
  }
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
    return (
      <div className="ambd-medication-grid">
        <div className="ambd-medication-header">Akutmedikation durch RD</div>
        <div className="ambd-medication-table">
          {['Medikament', 'Dosis', 'Art', 'Uhrzeit'].map((label) => (
            <span key={label} className="ambd-medication-cell ambd-medication-cell--head">
              {label}
            </span>
          ))}
          {Array.from({ length: 16 }, (_, index) => (
            <span key={index} className="ambd-medication-cell" aria-hidden="true" />
          ))}
        </div>
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
        <button type="button" onClick={() => void workflow.finalize()}>
          Finalize
        </button>
        <button type="button" onClick={() => downloadJson(`ambulanzprotokoll-page1-${patientId ?? 'draft'}.json`, workflow.exportJson)}>
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
