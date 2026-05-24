'use client';

/**
 * Reads or creates a persistent guest UUID stored in localStorage.
 * Format: "Guest-{8 random hex chars}" for display, full UUID for identity.
 */
export function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return '';

  const KEY = 'eychtech_guest_id';
  let guestId = localStorage.getItem(KEY);

  if (!guestId) {
    // Generate a UUID v4-like string
    guestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(KEY, guestId);
  }

  return guestId;
}

export function getGuestDisplayName(guestId: string): string {
  // Use first 8 chars of UUID as a short identifier
  return `Guest-${guestId.substring(0, 8)}`;
}
