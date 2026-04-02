import type { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TriagePage1 from './TriagePage1';
import TriagePage2 from './TriagePage2';
import TriagePage3 from './TriagePage3';
import { TRIAGE_COLOR } from '../types/triageColor';

const setTriageColorMock = vi.fn();
const setRespirationMock = vi.fn().mockResolvedValue(undefined);
const navigateMock = vi.fn();
const ensurePatientLocationMock = vi.fn().mockResolvedValue(undefined);
const clearJobsMock = vi.fn();
const patientLocationStoreState = {
  jobs: {},
  ensurePatientLocation: ensurePatientLocationMock,
  clearJobs: clearJobsMock,
};

vi.mock('../hooks/usePatientTriage', () => ({
  usePatientTriage: () => ({
    setTriageColor: setTriageColorMock,
    setRespiration: setRespirationMock,
  }),
}));

vi.mock('../stores/patientLocationStore', () => ({
  usePatientLocationStore: (selector: (state: typeof patientLocationStoreState) => unknown) =>
    selector(patientLocationStoreState),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function renderAt(path: string, element: ReactElement, state = { patientId: 12, operationSceneId: 77 }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: path, state }]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  setTriageColorMock.mockReset();
  setRespirationMock.mockReset();
  navigateMock.mockReset();
  ensurePatientLocationMock.mockReset();
});

describe('Triage pages use shared triage contract', () => {
  it('TriagePage1 assigns canonical green and black values', () => {
    renderAt('/TriagePage1', <TriagePage1 />);

    expect(ensurePatientLocationMock).toHaveBeenCalledWith(12);

    fireEvent.click(screen.getByRole('button', { name: /patient gehfähig/i }));
    expect(setTriageColorMock).toHaveBeenCalledWith(TRIAGE_COLOR.GRUEN);

    setTriageColorMock.mockReset();
    renderAt('/TriagePage1', <TriagePage1 />, { patientId: 13, operationSceneId: 77 });
    fireEvent.click(screen.getByRole('button', { name: /eindeutiges todeszeichen/i }));
    expect(setTriageColorMock).toHaveBeenCalledWith(TRIAGE_COLOR.SCHWARZ);
  });

  it('TriagePage2 assigns canonical red value', () => {
    renderAt('/TriagePage2', <TriagePage2 />);

    expect(ensurePatientLocationMock).toHaveBeenCalledWith(12);

    fireEvent.click(screen.getByRole('button', { name: /atmung nicht suffizient/i }));
    expect(setTriageColorMock).toHaveBeenCalledWith(TRIAGE_COLOR.ROT, { respiration: false });
  });

  it('TriagePage3 assigns canonical red and yellow values', () => {
    renderAt('/TriagePage3', <TriagePage3 />);

    expect(ensurePatientLocationMock).toHaveBeenCalledWith(12);

    fireEvent.click(screen.getByRole('button', { name: /blutung nicht stillbar/i }));
    expect(setTriageColorMock).toHaveBeenCalledWith(TRIAGE_COLOR.ROT, { blutung: false });

    setTriageColorMock.mockReset();
    renderAt('/TriagePage3', <TriagePage3 />, { patientId: 14, operationSceneId: 77 });
    fireEvent.click(screen.getByRole('button', { name: /blutung stillbar/i }));
    expect(setTriageColorMock).toHaveBeenCalledWith(TRIAGE_COLOR.GELB, { blutung: true });
  });
});
