import client from '../../api/client';
import type { Page1PersistedRecord, Page1State } from './page1State';

export interface Page1SavePayload {
  formState: Page1State;
  status: 'draft' | 'finalized';
  finalizedAt: string | null;
  updatedAt: string;
}

export const getPage1 = (patientId: number, token?: string) =>
  client.get<Page1PersistedRecord | null>(`/v2/persons/${patientId}/ambulanzprotokoll-page1`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

export const putPage1 = (patientId: number, payload: Page1SavePayload, token?: string) =>
  client.put<Page1PersistedRecord>(`/v2/persons/${patientId}/ambulanzprotokoll-page1`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

