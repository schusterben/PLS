import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useAmbulanzprotokollPage1Workflow } from './page1Workflow';
import type { Page1PersistedRecord } from './page1State';

const getPage1Mock = vi.fn();
const putPage1Mock = vi.fn();

vi.mock('./page1Api', () => ({
  getPage1: (...args: unknown[]) => getPage1Mock(...args),
  putPage1: (...args: unknown[]) => putPage1Mock(...args),
}));

function buildRecord(overrides: Partial<Page1PersistedRecord>): Page1PersistedRecord {
  return {
    patientId: 7,
    operationSceneId: 11,
    status: 'draft',
    updatedAt: '2026-01-01T10:00:00.000Z',
    finalizedAt: null,
    formState: {
      incident: {
        ambulanzort: '',
        datum: null,
        uhrzeit_beginn: null,
        dnr_san_1: '',
        dnr_san_2: '',
        dnr_san_3: '',
        dnr_na: '',
        pls_nummer: '',
        funkrufname: '',
      },
      patient: {
        familienname: '',
        vorname: '',
        geschlecht: null,
        vers_nr: '',
        geburtsdatum: null,
        adresse: '',
        staat: '',
        telefon: '',
        arbeitgeber: '',
        versicherungstraeger: '',
        familienstand: '',
      },
      assessment_primary: {
        naca: [],
        atemweg: [],
        atmung: [],
        kreislauf: [],
        bewusstsein: [],
        angen_notfallzeit: { zeit: null, gt24h: false, unbekannt: false },
      },
      assessment_secondary: {
        anamnese_text: '',
        bodymap: [],
      },
      medications_administered: [],
      vitals: {
        pupillen: { R: [], L: [] },
        schmerz: null,
        schmerz_nicht_beurteilbar: false,
        gcs_augenoeffnen: null,
        gcs_verbale_reaktion: null,
        gcs_motorische_reaktion: null,
        gcs_summe: null,
        keine: false,
        rr: '',
        puls: '',
        puls_rhythmus: [],
        af: '',
        temp: '',
        bz: '',
        etco2: '',
        spo2: '',
        o2_l_min: '',
        o2_beatmung_l_min: '',
      },
      measures: {
        herz_kreislauf: { massnahmen: [], dnr: '', anzahl: '', letzte_joule: '', freq: '', mv: '' },
        atmung: { massnahmen: [], dnr: '', af: '', amv: '', peep: '' },
        weitere_massnahmen: { massnahmen: [], abbinden_zeit: null, lagerung_art: '' },
      },
      history: {
        allergien: '',
        medikamente: '',
        patientengeschichte_vorerkrankungen: '',
        letzte_orale_aufnahme: '',
        ereignisse_zuvor: '',
        risikofaktoren: '',
      },
      disposition: {
        abschlussart: [],
        klinischer_zustand: [],
        uhrzeit_ende: null,
        org: '',
        typ: '',
        kennung: '',
        angehoerige_in_kenntnis: [],
        kontaktdaten: '',
      },
      signatures: { entlass_san_na: null },
    },
    ...overrides,
  };
}

beforeEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
  getPage1Mock.mockReset();
  putPage1Mock.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

it('restores the newer local draft and autosaves updates', async () => {
  const localRecord = buildRecord({
    updatedAt: '2026-01-02T10:00:00.000Z',
    formState: { ...buildRecord({}).formState, incident: { ...buildRecord({}).formState.incident, ambulanzort: 'Lokal' } },
  });
  window.localStorage.setItem('ambdoku:page1:patient:7', JSON.stringify(localRecord));
  getPage1Mock.mockResolvedValue({ data: buildRecord({ updatedAt: '2026-01-01T10:00:00.000Z' }) });
  putPage1Mock.mockResolvedValue({
    data: buildRecord({
      updatedAt: '2026-01-03T10:00:00.000Z',
      formState: {
        ...buildRecord({}).formState,
        incident: { ...buildRecord({}).formState.incident, ambulanzort: 'Neu' },
      },
    }),
  });

  const { result } = renderHook(() =>
    useAmbulanzprotokollPage1Workflow({ patientId: 7, operationSceneId: 11, token: 'token' })
  );

  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  expect(result.current.form.getValues().incident.ambulanzort).toBe('Lokal');
  expect(result.current.source).toBe('local');

  vi.useFakeTimers();
  act(() => {
    result.current.form.setValue('incident.ambulanzort', 'Neu');
  });
  act(() => {
    vi.advanceTimersByTime(900);
  });

  await act(async () => {
    await Promise.resolve();
  });
  expect(putPage1Mock).toHaveBeenCalled();
  expect(putPage1Mock.mock.calls[0][1]).toEqual(
    expect.objectContaining({
      formState: expect.objectContaining({
        incident: expect.objectContaining({
          ambulanzort: 'Neu',
        }),
      }),
    })
  );
  expect(window.localStorage.getItem('ambdoku:page1:patient:7')).toContain('"Neu"');
});

it('finalizes and clears the local draft', async () => {
  getPage1Mock.mockResolvedValue({ data: null });
  putPage1Mock.mockResolvedValue({
    data: buildRecord({
      status: 'finalized',
      finalizedAt: '2026-01-02T12:00:00.000Z',
      updatedAt: '2026-01-02T12:00:00.000Z',
    }),
  });

  const { result } = renderHook(() =>
    useAmbulanzprotokollPage1Workflow({ patientId: 7, operationSceneId: 11, token: 'token' })
  );

  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  await act(async () => {
    await result.current.finalize();
  });

  expect(putPage1Mock).toHaveBeenCalledWith(
    7,
    expect.objectContaining({ status: 'finalized' }),
    'token'
  );
  expect(window.localStorage.getItem('ambdoku:page1:patient:7')).toBeNull();
  expect(result.current.exportJson).toContain('"incident"');
});
