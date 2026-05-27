'use client';

import { useState, useCallback } from 'react';
import { Mail, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import toast from 'react-hot-toast';

const interestOptions = [
  { id: 'exhibitions', label: 'Gallery Exhibitions' },
  { id: 'spotlights', label: 'Artist Spotlights' },
  { id: 'events', label: 'Community Events' },
  { id: 'appraisals', label: 'Appraisal Updates' },
];

export function CommunitySignup() {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<Set<string>>(new Set(['exhibitions', 'spotlights']));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = useCallback((v: string): string => {
    if (!v) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  }, []);

  const onBlur = useCallback(() => { setTouched(true); setError(validate(email)); }, [email, validate]);
  const onChange = useCallback((v: string) => { setEmail(v); if (touched) setError(validate(v)); }, [touched, validate]);
  const toggle = useCallback((id: string) => {
    setInterests((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }, []);

  const submit = useCallback(async () => {
    const err = validate(email);
    if (err) { setError(err); setTouched(true); return; }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email,
        interests: Array.from(interests),
        source: 'website',
        isActive: true,
        createdAt: serverTimestamp(),
      });
      toast.success('Welcome to the community!');
      setEmail('');
      setTouched(false);
      setInterests(new Set(['exhibitions', 'spotlights']));
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'permission-denied') {
        toast.error('Unable to subscribe right now. Please try again later.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }, [email, interests, validate]);

  return (
    <section className="py-16 md:py-22 bg-white" aria-label="Join our community">
      <div className="container-bhg">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="section-heading mb-3">Join Our Community</h2>
          <p className="text-body-lg text-bhg-gray-600 mb-10">Stay connected with upcoming exhibitions, artist spotlights, and gallery news</p>
          <div className="bg-bhg-cream-warm rounded-2xl p-8 md:p-10">
            <div className="flex gap-2 mb-2">
              <div className="flex-1 relative">
                <label htmlFor="community-email" className="sr-only">Email address</label>
                <input id="community-email" type="email" value={email} onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
                  placeholder="Enter your email address"
                  className={cn('input-field pr-10', touched && error && 'border-bhg-error focus:border-bhg-error focus:ring-bhg-error')}
                  aria-invalid={touched && !!error} aria-describedby={error ? 'email-error' : undefined} disabled={submitting}/>
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-bhg-gray-400" aria-hidden="true"/>
              </div>
              <button onClick={submit} disabled={submitting} className="w-12 h-12 flex items-center justify-center rounded-button bg-bhg-copper text-white hover:bg-bhg-copper-dark disabled:opacity-50 transition-colors shrink-0" aria-label="Subscribe">
                {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send size={18}/>}
              </button>
            </div>
            {touched && error && <p id="email-error" className="text-body-sm text-bhg-error text-left mb-4" role="alert">{error}</p>}
            <div className="mt-6">
              <p className="text-body-sm text-bhg-gray-600 mb-3 text-left">What interests you? (Optional)</p>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0', interests.has(opt.id) ? 'bg-bhg-copper border-bhg-copper' : 'border-bhg-gray-200 group-hover:border-bhg-copper/50')} aria-hidden="true">
                      {interests.has(opt.id) && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <input type="checkbox" checked={interests.has(opt.id)} onChange={() => toggle(opt.id)} className="sr-only" aria-label={opt.label}/>
                    <span className="text-body-sm text-bhg-black text-left">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={submit} disabled={submitting} className="btn-secondary w-full mt-6 py-3">
              <Mail size={16} aria-hidden="true"/>Join Community
            </button>
            <p className="text-caption text-bhg-gray-400 mt-4">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
