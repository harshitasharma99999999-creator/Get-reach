import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const FEEDBACK_COLLECTION = 'feedback';

export interface FeedbackInput {
  whatYouLove: string;
  whatsMissing: string;
  anythingElse: string;
  userId?: string | null;
  userEmail?: string | null;
}

export async function submitFeedback(input: FeedbackInput): Promise<void> {
  await addDoc(collection(db, FEEDBACK_COLLECTION), {
    whatYouLove: input.whatYouLove.trim() || null,
    whatsMissing: input.whatsMissing.trim() || null,
    anythingElse: input.anythingElse.trim() || null,
    userId: input.userId || null,
    userEmail: input.userEmail || null,
    createdAt: serverTimestamp(),
  });
}
