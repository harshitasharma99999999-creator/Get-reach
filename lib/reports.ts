import {
  collection,
  doc,
  addDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { ReachReport } from '../types';

const REPORTS_COLLECTION = 'reports';

export interface SavedReport {
  report: ReachReport;
  reportId: string;
  createdAt: unknown;
}

/**
 * Persist a completed report for the user. Call after report is generated.
 * Returns the document id for real-time subscription.
 */
export async function saveReport(userId: string, report: ReachReport): Promise<string> {
  const ref = await addDoc(collection(db, REPORTS_COLLECTION), {
    userId,
    report,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Fetch the latest report for a user (e.g. on load or after login).
 */
export async function getLatestReport(userId: string): Promise<SavedReport | null> {
  const q = query(
    collection(db, REPORTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  const data = d.data();
  return {
    report: data.report as ReachReport,
    reportId: d.id,
    createdAt: data.createdAt,
  };
}

/**
 * Subscribe to a report document so the UI updates in real time if the report is updated.
 * Returns an unsubscribe function.
 */
export function subscribeToReport(reportId: string, onUpdate: (report: ReachReport) => void): Unsubscribe {
  const ref = doc(db, REPORTS_COLLECTION, reportId);
  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.data();
    if (data?.report) onUpdate(data.report as ReachReport);
  });
}
