export type Page1FieldType =
  | 'line_text'
  | 'line_text_long'
  | 'checkbox_group'
  | 'checkbox_group_inline'
  | 'radio_group'
  | 'radio_group_inline'
  | 'checkbox'
  | 'date'
  | 'segmented_date_visual'
  | 'tel'
  | 'time'
  | 'time_optional'
  | 'compound_time_or_flags'
  | 'textarea_lined'
  | 'matrix_checkbox'
  | 'compound_rr'
  | 'scale_line'
  | 'computed_number'
  | 'body_map'
  | 'signature';

export type Page1ZoneId =
  | 'incident_header'
  | 'patient_block'
  | 'erstdiagnose_allgemein'
  | 'anamnese_bodymap'
  | 'erst_endbefund'
  | 'massnahmen_ample'
  | 'footer_disposition';

export interface Page1FieldOption {
  value: string;
  label: string;
}

export interface Page1FieldSpec {
  id: string;
  zoneId: Page1ZoneId;
  row: number;
  span: number;
  label: string;
  type: Page1FieldType;
  bind: string;
  options?: Page1FieldOption[];
  column?: 'left' | 'right' | 'full';
  ambiguous?: boolean;
  ambiguityNote?: string;
}

export const page1ExportStateTemplate = {
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
    naca: [] as string[],
    atemweg: [] as string[],
    atmung: [] as string[],
    kreislauf: [] as string[],
    bewusstsein: [] as string[],
    angen_notfallzeit: {
      zeit: null,
      gt24h: false,
      unbekannt: false,
    },
  },
  assessment_secondary: {
    anamnese_text: '',
    bodymap: [] as string[],
  },
  medications_administered: [] as Array<Record<string, string | null>>,
  vitals: {
    pupillen: { R: [] as string[], L: [] as string[] },
    schmerz: null as number | null,
    schmerz_nicht_beurteilbar: false,
    gcs_augenoeffnen: null as number | null,
    gcs_verbale_reaktion: null as number | null,
    gcs_motorische_reaktion: null as number | null,
    gcs_summe: null as number | null,
    keine: false,
    rr: '',
    puls: '',
    puls_rhythmus: [] as string[],
    af: '',
    temp: '',
    bz: '',
    etco2: '',
    spo2: '',
    o2_l_min: '',
    o2_beatmung_l_min: '',
  },
  measures: {
    herz_kreislauf: {
      massnahmen: [] as string[],
      dnr: '',
      anzahl: '',
      letzte_joule: '',
      freq: '',
      mv: '',
    },
    atmung: {
      massnahmen: [] as string[],
      dnr: '',
      af: '',
      amv: '',
      peep: '',
    },
    weitere_massnahmen: {
      massnahmen: [] as string[],
      abbinden_zeit: null,
      lagerung_art: '',
    },
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
    abschlussart: [] as string[],
    klinischer_zustand: [] as string[],
    uhrzeit_ende: null,
    org: '',
    typ: '',
    kennung: '',
    angehoerige_in_kenntnis: [] as string[],
    kontaktdaten: '',
  },
  signatures: {
    entlass_san_na: null as string | null,
  },
};

export const page1FieldSchema: Page1FieldSpec[] = [
  { id: 'ambulanzort', zoneId: 'incident_header', row: 1, span: 6, label: 'Ambulanzort', type: 'line_text', bind: 'incident.ambulanzort' },
  { id: 'pls_nummer', zoneId: 'incident_header', row: 1, span: 6, label: 'Protokoll- / PLS-Nummer', type: 'line_text', bind: 'incident.pls_nummer' },
  {
    id: 'datum_segmented',
    zoneId: 'incident_header',
    row: 2,
    span: 2,
    label: 'Datum',
    type: 'segmented_date_visual',
    bind: 'incident.datum',
    ambiguous: true,
    ambiguityNote: 'Date is rendered as a paper-style segmented visual; the underlying bind stays incident.datum.',
  },
  { id: 'uhrzeit_beginn', zoneId: 'incident_header', row: 2, span: 2, label: 'Uhrzeit-Beginn', type: 'time', bind: 'incident.uhrzeit_beginn' },
  { id: 'dnr_san_1', zoneId: 'incident_header', row: 2, span: 2, label: 'DNr. - San.', type: 'line_text', bind: 'incident.dnr_san_1' },
  { id: 'dnr_san_2', zoneId: 'incident_header', row: 2, span: 2, label: 'DNr. - San.', type: 'line_text', bind: 'incident.dnr_san_2' },
  { id: 'dnr_san_3', zoneId: 'incident_header', row: 2, span: 2, label: 'DNr. - San.', type: 'line_text', bind: 'incident.dnr_san_3' },
  { id: 'dnr_na', zoneId: 'incident_header', row: 2, span: 2, label: 'DNr. - NA', type: 'line_text', bind: 'incident.dnr_na' },
  { id: 'funkrufname', zoneId: 'incident_header', row: 2, span: 2, label: 'Funkrufname / Behandlungsplatz', type: 'line_text', bind: 'incident.funkrufname' },

  { id: 'familienname', zoneId: 'patient_block', row: 1, span: 4, label: 'Patient - Familienname', type: 'line_text', bind: 'patient.familienname' },
  { id: 'vorname', zoneId: 'patient_block', row: 1, span: 3, label: 'Vorname', type: 'line_text', bind: 'patient.vorname' },
  {
    id: 'geschlecht',
    zoneId: 'patient_block',
    row: 1,
    span: 1,
    label: 'Ges.',
    type: 'radio_group_inline',
    bind: 'patient.geschlecht',
    options: [
      { value: 'd', label: 'D' },
      { value: 'm', label: 'M' },
      { value: 'w', label: 'W' },
    ],
    ambiguous: true,
    ambiguityNote: 'Preserves the paper abbreviation Ges. and the original inline options.',
  },
  { id: 'vers_nr', zoneId: 'patient_block', row: 1, span: 3, label: 'Vers.-Nr.', type: 'line_text', bind: 'patient.vers_nr' },
  { id: 'geburtsdatum', zoneId: 'patient_block', row: 1, span: 2, label: 'Geb.-Datum', type: 'date', bind: 'patient.geburtsdatum' },
  { id: 'adresse', zoneId: 'patient_block', row: 2, span: 6, label: 'Adresse', type: 'line_text', bind: 'patient.adresse' },
  { id: 'staat', zoneId: 'patient_block', row: 2, span: 2, label: 'Staat', type: 'line_text', bind: 'patient.staat' },
  { id: 'telefon', zoneId: 'patient_block', row: 2, span: 2, label: 'Telefon', type: 'tel', bind: 'patient.telefon' },
  { id: 'arbeitgeber', zoneId: 'patient_block', row: 3, span: 4, label: 'Arbeitgeber', type: 'line_text', bind: 'patient.arbeitgeber' },
  { id: 'versicherungstraeger', zoneId: 'patient_block', row: 3, span: 4, label: 'Versicherungsträger', type: 'line_text', bind: 'patient.versicherungstraeger' },
  { id: 'familienstand', zoneId: 'patient_block', row: 3, span: 2, label: 'Familienstand', type: 'line_text', bind: 'patient.familienstand' },

  {
    id: 'naca',
    zoneId: 'erstdiagnose_allgemein',
    row: 1,
    span: 12,
    label: 'NACA-Score',
    type: 'checkbox_group',
    bind: 'assessment_primary.naca',
    options: [
      { value: 'I', label: 'I geringfügige Störung' },
      { value: 'II', label: 'II ambulante Abklärung' },
      { value: 'III', label: 'III stationäre Behandlung' },
      { value: 'IV', label: 'IV akute Lebensgefahr möglich' },
      { value: 'V', label: 'V akute Lebensgefahr' },
      { value: 'VI', label: 'VI Reanimation' },
      { value: 'VII', label: 'VII Tod' },
    ],
  },
  {
    id: 'atemweg',
    zoneId: 'erstdiagnose_allgemein',
    row: 2,
    span: 3,
    label: 'Atemweg',
    type: 'checkbox_group',
    bind: 'assessment_primary.atemweg',
    options: [
      { value: 'frei', label: 'frei' },
      { value: 'gefaehrdet', label: 'gefährdet' },
      { value: 'verlegt', label: 'verlegt' },
    ],
  },
  {
    id: 'atmung',
    zoneId: 'erstdiagnose_allgemein',
    row: 2,
    span: 3,
    label: 'Atmung',
    type: 'checkbox_group',
    bind: 'assessment_primary.atmung',
    options: [
      { value: 'apnoe', label: 'Apnoe' },
      { value: 'schnappatmung', label: 'Schnappatmung' },
      { value: 'zyanose', label: 'Zyanose' },
      { value: 'unauffaellig', label: 'unauffällig' },
      { value: 'dyspnoe', label: 'Dyspnoe' },
      { value: 'atemgeraeusche', label: 'Atemgeräusche' },
      { value: 'andere_atemstoerungen', label: 'andere Atemstörungen' },
    ],
  },
  {
    id: 'kreislauf',
    zoneId: 'erstdiagnose_allgemein',
    row: 2,
    span: 3,
    label: 'Kreislauf',
    type: 'checkbox_group',
    bind: 'assessment_primary.kreislauf',
    options: [
      { value: 'puls_peripher_tastbar', label: 'Puls peripher tastbar' },
      { value: 'tachykardie', label: 'Tachykardie' },
      { value: 'bradykardie', label: 'Bradykardie' },
      { value: 'blass', label: 'blass' },
      { value: 'kalt', label: 'kalt' },
      { value: 'unauffaellig', label: 'unauffällig' },
      { value: 'starke_blutung', label: 'Starke Blutung' },
      { value: 'geroetet', label: 'gerötet' },
      { value: 'schweissig', label: 'schweißig' },
      { value: 'erwaermt', label: 'erwärmt' },
    ],
  },
  {
    id: 'bewusstsein',
    zoneId: 'erstdiagnose_allgemein',
    row: 2,
    span: 3,
    label: 'Bewusstsein',
    type: 'checkbox_group',
    bind: 'assessment_primary.bewusstsein',
    options: [
      { value: 'wach', label: 'Wach' },
      { value: 'getruebt', label: 'Getrübt' },
      { value: 'bewusstlos', label: 'Bewusstlos' },
      { value: 'agitiert', label: 'Agitiert' },
    ],
  },
  {
    id: 'angen_notfallzeit',
    zoneId: 'erstdiagnose_allgemein',
    row: 3,
    span: 12,
    label: 'angen. Notfallzeit',
    type: 'compound_time_or_flags',
    bind: 'assessment_primary.angen_notfallzeit',
    options: [
      { value: 'gt24h', label: '> als 24 Stunden' },
      { value: 'unbekannt', label: 'unbekannt' },
    ],
    ambiguous: true,
    ambiguityNote: 'Compound field mapping is explicit; the visual grammar remains aligned to the paper row.',
  },

  { id: 'anamnese_text', zoneId: 'anamnese_bodymap', row: 1, span: 6, column: 'left', label: '', type: 'textarea_lined', bind: 'assessment_secondary.anamnese_text' },
  {
    id: 'bodymap',
    zoneId: 'anamnese_bodymap',
    row: 1,
    span: 6,
    column: 'right',
    label: '',
    type: 'body_map',
    bind: 'assessment_secondary.bodymap',
    options: [
      { value: 'wunde', label: 'Wunde' },
      { value: 'fraktur', label: '/ Fraktur' },
      { value: 'schmerz', label: 'Schmerz' },
      { value: 'prellung', label: 'Prellung' },
      { value: 'amputation', label: 'Amputation' },
      { value: 'verbrennung', label: 'Verbrennung' },
      { value: 'luxation', label: 'Luxation' },
    ],
    ambiguous: true,
    ambiguityNote: 'Zone-level body map element; visible label remains controlled by the surrounding paper section.',
  },

  { id: 'schmerz', zoneId: 'erst_endbefund', row: 1, span: 4, label: 'Schmerz', type: 'scale_line', bind: 'vitals.schmerz' },
  {
    id: 'pupillen',
    zoneId: 'erst_endbefund',
    row: 1,
    span: 4,
    label: 'Pupillen',
    type: 'matrix_checkbox',
    bind: 'vitals.pupillen',
    options: [
      { value: 'R', label: 'R' },
      { value: 'L', label: 'L' },
    ],
    ambiguous: true,
    ambiguityNote: 'Matrix layout is preserved from the paper form; exact visual mapping remains isolated here.',
  },
  { id: 'rr', zoneId: 'erst_endbefund', row: 2, span: 2, label: 'RR', type: 'compound_rr', bind: 'vitals.rr', ambiguous: true, ambiguityNote: 'Compound RR is kept explicit as a distinct visual control.' },
  { id: 'puls', zoneId: 'erst_endbefund', row: 2, span: 2, label: 'Puls', type: 'line_text', bind: 'vitals.puls' },
  {
    id: 'puls_rhythmus',
    zoneId: 'erst_endbefund',
    row: 2,
    span: 2,
    label: '',
    type: 'checkbox_group',
    bind: 'vitals.puls_rhythmus',
    options: [
      { value: 'rhy', label: 'rhy.' },
      { value: 'arrhy', label: 'arrhy.' },
    ],
  },
  { id: 'af', zoneId: 'erst_endbefund', row: 2, span: 2, label: 'AF', type: 'line_text', bind: 'vitals.af' },
  { id: 'temp', zoneId: 'erst_endbefund', row: 2, span: 2, label: 'Temp.', type: 'line_text', bind: 'vitals.temp' },
  { id: 'bz', zoneId: 'erst_endbefund', row: 3, span: 2, label: 'BZ', type: 'line_text', bind: 'vitals.bz' },
  { id: 'etco2', zoneId: 'erst_endbefund', row: 3, span: 2, label: 'etCO2', type: 'line_text', bind: 'vitals.etco2' },
  { id: 'spo2', zoneId: 'erst_endbefund', row: 3, span: 2, label: 'SpO2', type: 'line_text', bind: 'vitals.spo2' },
  { id: 'o2_l_min', zoneId: 'erst_endbefund', row: 3, span: 3, label: 'O2 l/min', type: 'line_text', bind: 'vitals.o2_l_min' },
  { id: 'o2_beatmung_l_min', zoneId: 'erst_endbefund', row: 3, span: 3, label: 'O2 l/min', type: 'line_text', bind: 'vitals.o2_beatmung_l_min' },
  { id: 'gcs_augenoeffnen', zoneId: 'erst_endbefund', row: 4, span: 4, label: 'Augen öffnen', type: 'radio_group', bind: 'vitals.gcs_augenoeffnen', options: [{ value: '4', label: '4 spontan' }, { value: '3', label: '3 auf Aufforderung' }, { value: '2', label: '2 auf Schmerzreiz' }, { value: '1', label: '1 nicht' }] },
  { id: 'gcs_verbale_reaktion', zoneId: 'erst_endbefund', row: 5, span: 4, label: 'verbale Reaktion', type: 'radio_group', bind: 'vitals.gcs_verbale_reaktion', options: [{ value: '5', label: '5 orientiert' }, { value: '4', label: '4 desorientiert' }, { value: '3', label: '3 inadäquate Äußerung' }, { value: '2', label: '2 unverständliche Laute' }, { value: '1', label: '1 keine' }] },
  { id: 'gcs_motorische_reaktion', zoneId: 'erst_endbefund', row: 6, span: 4, label: 'motorische Reaktion', type: 'radio_group', bind: 'vitals.gcs_motorische_reaktion', options: [{ value: '6', label: '6 auf Aufforderung' }, { value: '5', label: '5 gezielt auf Schmerzreiz' }, { value: '4', label: '4 ungezielt auf Schmerzreiz' }, { value: '3', label: '3 abnorme Beugeabwehr' }, { value: '2', label: '2 Streckneigung' }, { value: '1', label: '1 keine' }] },
  { id: 'gcs_summe', zoneId: 'erst_endbefund', row: 7, span: 2, label: 'GCS-Summe', type: 'computed_number', bind: 'vitals.gcs_summe', ambiguous: true, ambiguityNote: 'Computed display field; arithmetic is resolved by the renderer layer.' },

  {
    id: 'herz_kreislauf_massnahmen',
    zoneId: 'massnahmen_ample',
    row: 1,
    span: 6,
    column: 'left',
    label: 'Herz / Kreislauf',
    type: 'checkbox_group',
    bind: 'measures.herz_kreislauf.massnahmen',
    options: [
      { value: 'peripherven_zugang_io', label: 'peripherven. Zugang / IO Zugang' },
      { value: 'herzdruckmassage', label: 'Herzdruckmassage' },
      { value: 'defibrillation_kardiov', label: 'Defibrillation/Kardiov.' },
      { value: 'schrittmacher_extern', label: 'Schrittmacher extern' },
    ],
  },
  { id: 'hk_dnr', zoneId: 'massnahmen_ample', row: 2, span: 2, column: 'left', label: 'DNr:', type: 'line_text', bind: 'measures.herz_kreislauf.dnr' },
  { id: 'hk_anz', zoneId: 'massnahmen_ample', row: 2, span: 1, column: 'left', label: 'Anz.:', type: 'line_text', bind: 'measures.herz_kreislauf.anzahl' },
  { id: 'hk_letzte_joule', zoneId: 'massnahmen_ample', row: 2, span: 1, column: 'left', label: 'letzte Joule:', type: 'line_text', bind: 'measures.herz_kreislauf.letzte_joule' },
  { id: 'hk_freq', zoneId: 'massnahmen_ample', row: 2, span: 1, column: 'left', label: 'Freq.:', type: 'line_text', bind: 'measures.herz_kreislauf.freq' },
  { id: 'hk_mv', zoneId: 'massnahmen_ample', row: 2, span: 1, column: 'left', label: 'mV:', type: 'line_text', bind: 'measures.herz_kreislauf.mv' },
  {
    id: 'atmung_massnahmen',
    zoneId: 'massnahmen_ample',
    row: 3,
    span: 6,
    column: 'left',
    label: 'Atmung',
    type: 'checkbox_group',
    bind: 'measures.atmung.massnahmen',
    options: [
      { value: 'absaugen', label: 'Absaugen' },
      { value: 'oral', label: 'oral' },
      { value: 'nasal', label: 'nasal' },
      { value: 'endotracheal', label: 'endotracheal' },
      { value: 'intubation', label: 'Intubation' },
      { value: 'wendltubus', label: 'Wendltubus' },
      { value: 'guedeltubus', label: 'Guedeltubus' },
      { value: 'larynxtubus', label: 'Larynxtubus' },
      { value: 'endotracheal_oral', label: 'endotracheal (oral)' },
      { value: 'endotracheal_nasal', label: 'endotracheal (nasal)' },
      { value: 'beatmung', label: 'Beatmung' },
      { value: 'assistiert', label: 'assistiert' },
      { value: 'kontrolliert', label: 'kontrolliert' },
      { value: 'manuell', label: 'manuell' },
      { value: 'maschinell', label: 'maschinell' },
    ],
  },
  { id: 'atm_dnr', zoneId: 'massnahmen_ample', row: 4, span: 2, column: 'left', label: 'DNr:', type: 'line_text', bind: 'measures.atmung.dnr' },
  { id: 'atm_af', zoneId: 'massnahmen_ample', row: 4, span: 1, column: 'left', label: 'AF', type: 'line_text', bind: 'measures.atmung.af' },
  { id: 'atm_amv', zoneId: 'massnahmen_ample', row: 4, span: 1, column: 'left', label: 'AMV', type: 'line_text', bind: 'measures.atmung.amv' },
  { id: 'atm_peep', zoneId: 'massnahmen_ample', row: 4, span: 1, column: 'left', label: 'PEEP', type: 'line_text', bind: 'measures.atmung.peep' },
  {
    id: 'weitere_massnahmen',
    zoneId: 'massnahmen_ample',
    row: 5,
    span: 6,
    column: 'left',
    label: 'Weitere Maßnahmen',
    type: 'checkbox_group',
    bind: 'measures.weitere_massnahmen.massnahmen',
    options: [
      { value: 'verband', label: 'Verband' },
      { value: 'blutstillung', label: 'Blutstillung' },
      { value: 'abbinden', label: 'Abbinden' },
      { value: 'lagerung', label: 'Lagerung' },
      { value: '12_abl_ekg', label: '12-Abl.-EKG' },
      { value: 'monitoring', label: 'Monitoring' },
      { value: 'hf', label: 'HF' },
      { value: 'rr', label: 'RR' },
      { value: 'spo2', label: 'SpO2' },
      { value: '4_abl_ekg', label: '4-Abl.-EKG' },
      { value: 'etco2', label: 'etCO2' },
      { value: 'schienung', label: 'Schienung' },
      { value: 'hws', label: 'HWS' },
      { value: 'spineboard', label: 'Spineboard' },
      { value: 'vakuummatratze', label: 'Vakuummatratze' },
      { value: 'extremitaet', label: 'Extremität' },
    ],
  },
  { id: 'abbinden_zeit', zoneId: 'massnahmen_ample', row: 6, span: 2, column: 'left', label: '', type: 'time', bind: 'measures.weitere_massnahmen.abbinden_zeit' },
  { id: 'lagerung_text', zoneId: 'massnahmen_ample', row: 6, span: 4, column: 'left', label: '', type: 'line_text', bind: 'measures.weitere_massnahmen.lagerung_art' },
  { id: 'allergien', zoneId: 'massnahmen_ample', row: 1, span: 6, column: 'right', label: 'Allergien', type: 'textarea_lined', bind: 'history.allergien' },
  { id: 'medikamente', zoneId: 'massnahmen_ample', row: 2, span: 6, column: 'right', label: 'Medikamente', type: 'textarea_lined', bind: 'history.medikamente' },
  { id: 'patientengeschichte', zoneId: 'massnahmen_ample', row: 3, span: 6, column: 'right', label: 'Patientengeschichte / Vorerkrankungen', type: 'textarea_lined', bind: 'history.patientengeschichte_vorerkrankungen' },
  { id: 'letzte_orale_aufnahme', zoneId: 'massnahmen_ample', row: 4, span: 6, column: 'right', label: 'Letzte orale Aufnahme', type: 'textarea_lined', bind: 'history.letzte_orale_aufnahme' },
  { id: 'ereignisse_zuvor', zoneId: 'massnahmen_ample', row: 5, span: 6, column: 'right', label: 'Ereignisse zuvor', type: 'textarea_lined', bind: 'history.ereignisse_zuvor' },
  { id: 'risikofaktoren', zoneId: 'massnahmen_ample', row: 6, span: 6, column: 'right', label: 'Risikofaktoren', type: 'textarea_lined', bind: 'history.risikofaktoren' },

  {
    id: 'abschlussart',
    zoneId: 'footer_disposition',
    row: 1,
    span: 3,
    label: 'Übergabe/Belassung/Revers',
    type: 'checkbox_group_inline',
    bind: 'disposition.abschlussart',
    options: [
      { value: 'uebergabe', label: 'Übergabe:' },
      { value: 'revers', label: 'Revers (Rücks.)' },
      { value: 'belassung', label: 'Belassung' },
      { value: 'entf_selbstst_o_revers', label: 'Entf. selbstst. o. Revers' },
    ],
  },
  {
    id: 'klinischer_zustand',
    zoneId: 'footer_disposition',
    row: 1,
    span: 2,
    label: 'Klinischer Zustand',
    type: 'checkbox_group_inline',
    bind: 'disposition.klinischer_zustand',
    options: [
      { value: 'verbessert', label: 'verbessert' },
      { value: 'gleich', label: 'gleich' },
      { value: 'verschlechtert', label: 'verschlechtert' },
    ],
  },
  { id: 'uhrzeit_ende', zoneId: 'footer_disposition', row: 1, span: 1, label: 'Uhrzeit-Ende', type: 'time', bind: 'disposition.uhrzeit_ende' },
  { id: 'org', zoneId: 'footer_disposition', row: 1, span: 1, label: 'Org.:', type: 'line_text', bind: 'disposition.org' },
  { id: 'typ', zoneId: 'footer_disposition', row: 1, span: 1, label: 'Typ:', type: 'line_text', bind: 'disposition.typ' },
  { id: 'kennung', zoneId: 'footer_disposition', row: 1, span: 1, label: 'Kennung:', type: 'line_text', bind: 'disposition.kennung' },
  {
    id: 'angehoerige_in_kenntnis',
    zoneId: 'footer_disposition',
    row: 2,
    span: 3,
    label: 'Angehörige in Kenntnis',
    type: 'checkbox_group_inline',
    bind: 'disposition.angehoerige_in_kenntnis',
    options: [
      { value: 'durch_rd', label: 'durch RD' },
      { value: 'durch_polizei', label: 'durch Polizei' },
      { value: 'durch_pat_andere', label: 'durch Pat/andere' },
    ],
  },
  { id: 'kontaktdaten', zoneId: 'footer_disposition', row: 2, span: 5, label: 'Kontaktdaten', type: 'line_text_long', bind: 'disposition.kontaktdaten', ambiguous: true, ambiguityNote: 'Long line variant keeps the visible label unchanged.' },
  { id: 'unterschrift', zoneId: 'footer_disposition', row: 2, span: 4, label: 'Unterschrift - Entlass. San/NA', type: 'signature', bind: 'signatures.entlass_san_na' },
];

export const page1FieldTypes: Page1FieldType[] = [
  'line_text',
  'checkbox_group',
  'time',
  'textarea_lined',
  'scale_line',
  'body_map',
  'signature',
];
