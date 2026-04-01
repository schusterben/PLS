import { z } from 'zod';
import { page1ExportStateTemplate } from './page1FieldSchema';

export interface Page1State {
  incident: {
    ambulanzort: string;
    datum: string | null;
    uhrzeit_beginn: string | null;
    dnr_san_1: string;
    dnr_san_2: string;
    dnr_san_3: string;
    dnr_na: string;
    pls_nummer: string;
    funkrufname: string;
  };
  patient: {
    familienname: string;
    vorname: string;
    geschlecht: string | null;
    vers_nr: string;
    geburtsdatum: string | null;
    adresse: string;
    staat: string;
    telefon: string;
    arbeitgeber: string;
    versicherungstraeger: string;
    familienstand: string;
  };
  assessment_primary: {
    naca: string[];
    atemweg: string[];
    atmung: string[];
    kreislauf: string[];
    bewusstsein: string[];
    angen_notfallzeit: {
      zeit: string | null;
      gt24h: boolean;
      unbekannt: boolean;
    };
  };
  assessment_secondary: {
    anamnese_text: string;
    bodymap: string[];
  };
  medications_administered: Array<Record<string, string | null>>;
  vitals: {
    pupillen: { R: string[]; L: string[] };
    schmerz: number | null;
    schmerz_nicht_beurteilbar: boolean;
    gcs_augenoeffnen: number | null;
    gcs_verbale_reaktion: number | null;
    gcs_motorische_reaktion: number | null;
    gcs_summe: number | null;
    keine: boolean;
    rr: string;
    puls: string;
    puls_rhythmus: string[];
    af: string;
    temp: string;
    bz: string;
    etco2: string;
    spo2: string;
    o2_l_min: string;
    o2_beatmung_l_min: string;
  };
  measures: {
    herz_kreislauf: {
      massnahmen: string[];
      dnr: string;
      anzahl: string;
      letzte_joule: string;
      freq: string;
      mv: string;
    };
    atmung: {
      massnahmen: string[];
      dnr: string;
      af: string;
      amv: string;
      peep: string;
    };
    weitere_massnahmen: {
      massnahmen: string[];
      abbinden_zeit: string | null;
      lagerung_art: string;
    };
  };
  history: {
    allergien: string;
    medikamente: string;
    patientengeschichte_vorerkrankungen: string;
    letzte_orale_aufnahme: string;
    ereignisse_zuvor: string;
    risikofaktoren: string;
  };
  disposition: {
    abschlussart: string[];
    klinischer_zustand: string[];
    uhrzeit_ende: string | null;
    org: string;
    typ: string;
    kennung: string;
    angehoerige_in_kenntnis: string[];
    kontaktdaten: string;
  };
  signatures: {
    entlass_san_na: string | null;
  };
}

export type Page1RecordStatus = 'draft' | 'finalized';

export interface Page1PersistedRecord {
  patientId: number;
  operationSceneId?: number | null;
  status: Page1RecordStatus;
  updatedAt: string;
  finalizedAt: string | null;
  formState: Page1State;
}

export const page1StateSchema = z.object({
  incident: z.object({
    ambulanzort: z.string(),
    datum: z.string().nullable(),
    uhrzeit_beginn: z.string().nullable(),
    dnr_san_1: z.string(),
    dnr_san_2: z.string(),
    dnr_san_3: z.string(),
    dnr_na: z.string(),
    pls_nummer: z.string(),
    funkrufname: z.string(),
  }),
  patient: z.object({
    familienname: z.string(),
    vorname: z.string(),
    geschlecht: z.string().nullable(),
    vers_nr: z.string(),
    geburtsdatum: z.string().nullable(),
    adresse: z.string(),
    staat: z.string(),
    telefon: z.string(),
    arbeitgeber: z.string(),
    versicherungstraeger: z.string(),
    familienstand: z.string(),
  }),
  assessment_primary: z.object({
    naca: z.array(z.string()),
    atemweg: z.array(z.string()),
    atmung: z.array(z.string()),
    kreislauf: z.array(z.string()),
    bewusstsein: z.array(z.string()),
    angen_notfallzeit: z.object({
      zeit: z.string().nullable(),
      gt24h: z.boolean(),
      unbekannt: z.boolean(),
    }),
  }),
  assessment_secondary: z.object({
    anamnese_text: z.string(),
    bodymap: z.array(z.string()),
  }),
  medications_administered: z.array(z.record(z.string(), z.union([z.string(), z.null()]))),
  vitals: z.object({
    pupillen: z.object({
      R: z.array(z.string()),
      L: z.array(z.string()),
    }),
    schmerz: z.number().nullable(),
    schmerz_nicht_beurteilbar: z.boolean(),
    gcs_augenoeffnen: z.number().nullable(),
    gcs_verbale_reaktion: z.number().nullable(),
    gcs_motorische_reaktion: z.number().nullable(),
    gcs_summe: z.number().nullable(),
    keine: z.boolean(),
    rr: z.string(),
    puls: z.string(),
    puls_rhythmus: z.array(z.string()),
    af: z.string(),
    temp: z.string(),
    bz: z.string(),
    etco2: z.string(),
    spo2: z.string(),
    o2_l_min: z.string(),
    o2_beatmung_l_min: z.string(),
  }),
  measures: z.object({
    herz_kreislauf: z.object({
      massnahmen: z.array(z.string()),
      dnr: z.string(),
      anzahl: z.string(),
      letzte_joule: z.string(),
      freq: z.string(),
      mv: z.string(),
    }),
    atmung: z.object({
      massnahmen: z.array(z.string()),
      dnr: z.string(),
      af: z.string(),
      amv: z.string(),
      peep: z.string(),
    }),
    weitere_massnahmen: z.object({
      massnahmen: z.array(z.string()),
      abbinden_zeit: z.string().nullable(),
      lagerung_art: z.string(),
    }),
  }),
  history: z.object({
    allergien: z.string(),
    medikamente: z.string(),
    patientengeschichte_vorerkrankungen: z.string(),
    letzte_orale_aufnahme: z.string(),
    ereignisse_zuvor: z.string(),
    risikofaktoren: z.string(),
  }),
  disposition: z.object({
    abschlussart: z.array(z.string()),
    klinischer_zustand: z.array(z.string()),
    uhrzeit_ende: z.string().nullable(),
    org: z.string(),
    typ: z.string(),
    kennung: z.string(),
    angehoerige_in_kenntnis: z.array(z.string()),
    kontaktdaten: z.string(),
  }),
  signatures: z.object({
    entlass_san_na: z.string().nullable(),
  }),
}) as z.ZodType<Page1State>;

export const page1FinalizeSchema = page1StateSchema;

export function createPage1Template(): Page1State {
  return JSON.parse(JSON.stringify(page1ExportStateTemplate)) as Page1State;
}

export function serializePage1State(state: Page1State) {
  return JSON.stringify(state, null, 2);
}
