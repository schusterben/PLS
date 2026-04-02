import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { Page1PersistedRecord, Page1RecordStatus, Page1State } from './page1State';
import {
  comparePage1UpdatedAt,
  clearPage1Draft,
  readPage1Draft,
  writePage1Draft,
} from './page1Storage';
import { getPage1, putPage1 } from './page1Api';
import { createPage1Template, normalizePage1State, page1FinalizeSchema, serializePage1State } from './page1State';

export type Page1SyncState = 'loading' | 'ready' | 'saving' | 'saved-local' | 'saved-server' | 'finalized' | 'error';

export interface UsePage1WorkflowArgs {
  patientId: number;
  operationSceneId: number | null;
  token?: string | null;
}

export function useAmbulanzprotokollPage1Workflow({ patientId, operationSceneId, token }: UsePage1WorkflowArgs) {
  const form = useForm<Page1State>({
    defaultValues: createPage1Template(),
    mode: 'onChange',
  });
  const [syncState, setSyncState] = useState<Page1SyncState>('loading');
  const [status, setStatus] = useState<Page1RecordStatus>('draft');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [source, setSource] = useState<'local' | 'server' | 'empty'>('empty');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Page1PersistedRecord | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const pendingServerSyncRef = useRef(false);
  const watchedState = useWatch({ control: form.control });

  const persistLocal = useCallback((formState: Page1State, nextStatus: Page1RecordStatus, updatedAt: string, finalizedAt: string | null) => {
    const normalizedFormState = normalizePage1State(formState);
    const record: Page1PersistedRecord = {
      patientId,
      operationSceneId,
      status: nextStatus,
      updatedAt,
      finalizedAt,
      formState: normalizedFormState,
    };

    writePage1Draft(record);
    setCurrentRecord(record);
    setLastSavedAt(updatedAt);
    setStatus(nextStatus);
    setSource('local');
  }, [operationSceneId, patientId]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      setSyncState('loading');
      setErrorMessage(null);

      const localRecord = readPage1Draft(patientId);

      try {
        const { data: serverRecord } = await getPage1(patientId, token ?? undefined);

        if (cancelled) return;

        const chosenRecord = chooseNewestRecord(localRecord, serverRecord);
        const nextState = chosenRecord?.formState ? normalizePage1State(chosenRecord.formState) : createPage1Template();
        form.reset(nextState);
        setIsHydrated(true);
        setCurrentRecord(chosenRecord ?? null);

        if (chosenRecord) {
          setStatus(chosenRecord.status);
          setLastSavedAt(chosenRecord.updatedAt);
          setSource(chosenRecord === localRecord ? 'local' : 'server');
        } else {
          setStatus('draft');
          setLastSavedAt(null);
          setSource('empty');
        }

        setSyncState('ready');
      } catch (error) {
        if (cancelled) return;

        const fallback = localRecord?.formState ? normalizePage1State(localRecord.formState) : createPage1Template();
        form.reset(fallback);
        setIsHydrated(true);
        setCurrentRecord(localRecord ?? null);
        setStatus(localRecord?.status ?? 'draft');
        setLastSavedAt(localRecord?.updatedAt ?? null);
        setSource(localRecord ? 'local' : 'empty');
        setErrorMessage(error instanceof Error ? error.message : 'Fehler beim Laden des Ambulanzprotokolls');
        setSyncState('error');
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [form, patientId, token]);

  useEffect(() => {
    if (!isHydrated || !watchedState) return;

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      const nextValue = normalizePage1State(watchedState as Page1State);
      const updatedAt = new Date().toISOString();
      const nextStatus = status === 'finalized' ? 'finalized' as const : 'draft' as const;
      const nextFinalizedAt = nextStatus === 'finalized' ? currentRecord?.finalizedAt ?? updatedAt : null;
      persistLocal(nextValue, nextStatus, updatedAt, nextFinalizedAt);
      setSyncState('saving');

      if (!token) {
        pendingServerSyncRef.current = true;
        setSyncState('saved-local');
        return;
      }

      void putPage1(patientId, {
        formState: nextValue,
        status: nextStatus,
        finalizedAt: nextFinalizedAt,
        updatedAt,
      }, token)
        .then(({ data }) => {
          pendingServerSyncRef.current = false;
          const serverRecord = data ?? {
            patientId,
            operationSceneId,
            status: nextStatus,
            updatedAt,
            finalizedAt: nextFinalizedAt,
            formState: nextValue,
          };
          persistLocal(serverRecord.formState, serverRecord.status, serverRecord.updatedAt, serverRecord.finalizedAt);
          setSource('server');
          setSyncState('saved-server');
        })
        .catch(() => {
          setSyncState('saved-local');
          pendingServerSyncRef.current = true;
        });
    }, 800);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [currentRecord?.finalizedAt, isHydrated, operationSceneId, patientId, persistLocal, status, token, watchedState]);

  useEffect(() => {
    function handleOnline() {
      if (!pendingServerSyncRef.current || !token || !isHydrated) return;
      const currentState = normalizePage1State(form.getValues());
      const updatedAt = new Date().toISOString();
      const pendingStatus = currentRecord?.status ?? status;
      const pendingFinalizedAt = pendingStatus === 'finalized' ? currentRecord?.finalizedAt ?? updatedAt : null;
      setSyncState('saving');
      void putPage1(patientId, {
        formState: currentState,
        status: pendingStatus,
        finalizedAt: pendingFinalizedAt,
        updatedAt,
      }, token)
        .then(({ data }) => {
          pendingServerSyncRef.current = false;
          const rec = data ?? {
            patientId,
            operationSceneId,
            status: pendingStatus,
            updatedAt,
            finalizedAt: pendingFinalizedAt,
            formState: currentState,
          };
          persistLocal(rec.formState, rec.status, rec.updatedAt, rec.finalizedAt);
          setSource('server');
          setSyncState('saved-server');
        })
        .catch(() => setSyncState('saved-local'));
    }

    function handleOffline() {
      pendingServerSyncRef.current = true;
      setSyncState((prev) =>
        prev === 'saving' || prev === 'saved-server' || prev === 'ready' ? 'saved-local' : prev,
      );
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentRecord, form, isHydrated, operationSceneId, patientId, persistLocal, status, token]);

  const finalize = async () => {
    const validState = normalizePage1State(form.getValues());
    const validation = page1FinalizeSchema.safeParse(validState);
    const finalState = validation.success ? normalizePage1State(validation.data) : validState;
    const finalizedAt = new Date().toISOString();
    const updatedAt = finalizedAt;

    setSyncState('saving');
    setErrorMessage(null);

    try {
      const { data } = await putPage1(patientId, {
        formState: finalState,
        status: 'finalized',
        finalizedAt,
        updatedAt,
      }, token ?? undefined);

      const finalRecord = data ?? {
        patientId,
        operationSceneId,
        status: 'finalized',
        updatedAt,
        finalizedAt,
        formState: finalState,
      };

      clearPage1Draft(patientId);
      setCurrentRecord(finalRecord);
      setStatus('finalized');
      setLastSavedAt(finalRecord.updatedAt);
      setSource('server');
      setSyncState('finalized');
    } catch (error) {
      pendingServerSyncRef.current = true;
      persistLocal(finalState, 'finalized', updatedAt, finalizedAt);
      setErrorMessage(error instanceof Error ? error.message : 'Finalisierung lokal gespeichert; Server-Sync ausstehend');
      setSyncState('saved-local');
    }
  };

  const exportJson = serializePage1State(form.getValues());

  return {
    form,
    finalize,
    exportJson,
    syncState,
    status,
    source,
    lastSavedAt,
    errorMessage,
    currentRecord,
  };
}

function chooseNewestRecord(
  localRecord: Page1PersistedRecord | null,
  serverRecord: Page1PersistedRecord | null,
) {
  if (!localRecord) return serverRecord;
  if (!serverRecord) return localRecord;
  return comparePage1UpdatedAt(localRecord.updatedAt, serverRecord.updatedAt) >= 0 ? localRecord : serverRecord;
}
