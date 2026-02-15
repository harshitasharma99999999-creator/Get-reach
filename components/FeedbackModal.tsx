import React, { useState } from 'react';
import { X, MessageCircle, Loader2 } from 'lucide-react';
import { submitFeedback } from '../lib/feedback';

interface Props {
  onClose: () => void;
  userEmail?: string | null;
  userId?: string | null;
}

const FeedbackModal: React.FC<Props> = ({ onClose, userEmail, userId }) => {
  const [whatYouLove, setWhatYouLove] = useState('');
  const [whatsMissing, setWhatsMissing] = useState('');
  const [anythingElse, setAnythingElse] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatYouLove.trim() && !whatsMissing.trim() && !anythingElse.trim()) {
      setError('Please share at least something — what you love, what\'s missing, or anything else.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await submitFeedback({
        whatYouLove,
        whatsMissing,
        anythingElse,
        userId: userId || null,
        userEmail: userEmail || null,
      });
      setSubmitted(true);
    } catch {
      setError('Could not send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600 font-medium mb-8">
            Your feedback helps us make GetReach better for founders like you.
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative my-8 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Feedback</h2>
              <p className="text-sm text-gray-500 font-medium">Help us improve GetReach</p>
            </div>
          </div>
          <p className="text-gray-600 font-medium mb-6">
            What do you love about the app? What&apos;s missing? Say anything — we read every response.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">What do you love?</label>
              <textarea
                value={whatYouLove}
                onChange={(e) => setWhatYouLove(e.target.value)}
                placeholder="e.g. The report format, specific communities, the speed..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-900 placeholder-gray-400"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">What&apos;s missing?</label>
              <textarea
                value={whatsMissing}
                onChange={(e) => setWhatsMissing(e.target.value)}
                placeholder="e.g. More platforms, export options, integrations..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-900 placeholder-gray-400"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Anything else?</label>
              <textarea
                value={anythingElse}
                onChange={(e) => setAnythingElse(e.target.value)}
                placeholder="Say whatever you want — freely."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-900 placeholder-gray-400"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
