import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import AmbulanzprotokollPage1 from './AmbulanzprotokollPage1';

vi.mock('../stores/authStore', () => ({
  useAuthStore: () => ({ token: 'test-token' }),
}));

vi.mock('../features/ambulanzprotokoll-page1/page1Api', () => ({
  getPage1: vi.fn().mockResolvedValue({ data: null }),
  putPage1: vi.fn().mockResolvedValue({ data: null }),
}));

beforeEach(() => {
  window.localStorage.clear();
});

it('enters the page-1 route with the patient and operation scene context', async () => {
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/AmbulanzprotokollPage1/123',
          state: { operationSceneId: 77 },
        },
      ]}
    >
      <Routes>
        <Route path="/AmbulanzprotokollPage1/:patientId" element={<AmbulanzprotokollPage1 />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(/patientId: 123/)).toBeInTheDocument();
  expect(screen.getByText(/operationSceneId: 77/)).toBeInTheDocument();
});
