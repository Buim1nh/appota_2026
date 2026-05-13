export const ACCOUNT_STORAGE_KEY = "appota_session_account";

export type SessionAccount = { id: string; displayName: string };

export function readSessionAccount(): SessionAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "id" in parsed &&
      "displayName" in parsed &&
      typeof (parsed as SessionAccount).id === "string" &&
      typeof (parsed as SessionAccount).displayName === "string"
    ) {
      const id = (parsed as SessionAccount).id.trim();
      const displayName = (parsed as SessionAccount).displayName.trim();
      if (!id || !displayName) return null;
      return { id, displayName };
    }
    return null;
  } catch {
    return null;
  }
}

export function writeSessionAccount(account: SessionAccount) {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
}

export function clearSessionAccount() {
  localStorage.removeItem(ACCOUNT_STORAGE_KEY);
}
