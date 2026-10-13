export interface OfflineReportDraft {
  idempotencyKey: string;
  category: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  district: string;
  timestamp: string;
  syncStatus: 'QUEUED' | 'SYNCED' | 'FAILED';
  photoNote?: string;
}

const STORAGE_KEY = "sentinelgrid_field_drafts";

export function getOfflineDrafts(): OfflineReportDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineDraft(draft: OfflineReportDraft): void {
  if (typeof window === "undefined") return;
  const current = getOfflineDrafts();
  const filtered = current.filter((d) => d.idempotencyKey !== draft.idempotencyKey);
  filtered.unshift(draft);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearSyncedDrafts(): void {
  if (typeof window === "undefined") return;
  const current = getOfflineDrafts();
  const unSynced = current.filter((d) => d.syncStatus !== "SYNCED");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unSynced));
}

export function markDraftSynced(idempotencyKey: string): void {
  if (typeof window === "undefined") return;
  const current = getOfflineDrafts();
  const updated = current.map((d) =>
    d.idempotencyKey === idempotencyKey ? { ...d, syncStatus: "SYNCED" as const } : d
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
