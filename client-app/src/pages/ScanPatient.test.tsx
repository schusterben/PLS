import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScanPatient from './ScanPatient';

const navigateMock = vi.fn();
const stopScannerMock = vi.fn();
const verifyPatientQrCodeMock = vi.fn();
const ensurePatientLocationMock = vi.fn().mockResolvedValue(undefined);
let scannerSuccessHandler: ((decodedText: string) => void) | undefined;

vi.mock('../stores/authStore', () => ({
  useAuthStore: () => ({ token: 'test-token' }),
}));

vi.mock('../api/endpoints', () => ({
  verifyPatientQrCode: (...args: unknown[]) => verifyPatientQrCodeMock(...args),
  getUnusedPatientQrCodesDev: vi.fn(),
}));

vi.mock('../stores/patientLocationStore', () => ({
  usePatientLocationStore: (selector: (state: { ensurePatientLocation: typeof ensurePatientLocationMock }) => unknown) =>
    selector({ ensurePatientLocation: ensurePatientLocationMock }),
}));

vi.mock('../hooks/useQrScanner', () => ({
  useQrScanner: ({ onSuccess }: { onSuccess: (decodedText: string) => void }) => {
    scannerSuccessHandler = onSuccess;
    return {
      cameraBlocked: false,
      stopScanner: stopScannerMock,
      scannerRef: { current: null },
    };
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('ScanPatient', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    stopScannerMock.mockReset();
    verifyPatientQrCodeMock.mockReset();
    ensurePatientLocationMock.mockReset();
    scannerSuccessHandler = undefined;
    verifyPatientQrCodeMock.mockResolvedValue({ data: { patientId: 42 } });
  });

  it('starts patient geolocation before navigating to triage page 1', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/ScanPatient', state: { operationSceneId: 55 } }]}>
        <Routes>
          <Route path="/ScanPatient" element={<ScanPatient />} />
        </Routes>
      </MemoryRouter>
    );

    await scannerSuccessHandler?.('qr-code-123');
    await Promise.resolve();

    expect(verifyPatientQrCodeMock).toHaveBeenCalledWith('qr-code-123', 55, 'test-token');
    expect(ensurePatientLocationMock).toHaveBeenCalledWith(42);
    expect(stopScannerMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/TriagePage1', {
      state: { patientId: 42, operationSceneId: 55 },
    });
    expect(ensurePatientLocationMock.mock.invocationCallOrder[0]).toBeLessThan(
      navigateMock.mock.invocationCallOrder[0]
    );
  });
});
