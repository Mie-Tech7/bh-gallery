'use client';

import { useState, useCallback } from 'react';
import { Award, Send, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createAppraisalRequest } from '@/lib/firebase/db';
import type { AppraisalPurpose } from '@/types';
import toast from 'react-hot-toast';
import { site, APPRAISAL_BRAND_COMING_SOON, listToText } from '@/content/site';

const processSteps = [
  'You describe the piece and why you need a value',
  'We follow up for photos and any provenance you have',
  'Research and comparison with recent sales',
  'A written appraisal report',
];

const purposeOptions: Array<{ value: AppraisalPurpose | ''; label: string }> = [
  { value: '', label: 'Select purpose' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'resale', label: 'Resale' },
  { value: 'estate', label: 'Estate Planning' },
  { value: 'donation', label: 'Donation' },
  { value: 'curiosity', label: 'Personal Knowledge' },
];

export function AppraisalService() {
  const brand = site.appraisalBrand.name;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<AppraisalPurpose | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    if (!description.trim()) next.description = 'Artwork description is required';
    if (!purpose) next.purpose = 'Please select a purpose';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, email, description, purpose]);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createAppraisalRequest({
        clientName: name.trim(),
        clientEmail: email.trim(),
        clientPhone: phone.trim() || null,
        userId: null,
        artworkDescription: description.trim(),
        purpose: purpose as AppraisalPurpose,
        images: [],
        urgency: 'standard',
        status: 'pending',
        assignedTo: null,
        appraisalReport: null,
        estimatedValue: null,
      });
      toast.success('Request received. We will email you with next steps.');
      setName(''); setEmail(''); setPhone(''); setDescription(''); setPurpose('');
      setErrors({});
    } catch (err) {
      // Keep what they typed so they can try again.
      console.error('[Appraisal] createAppraisalRequest failed:', err);
      toast.error('Your request did not go through. Please try again, or reach us through the Contact page.');
    } finally {
      setSubmitting(false);
    }
  }, [name, email, phone, description, purpose, validate]);

  return (
    <section className="bg-bhg-cream-warm py-16 md:py-22" aria-label="Appraisal services">
      <div className="container-bhg">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="section-heading mb-4">Appraisals</h1>
          <p className="text-body-lg text-bhg-gray-600">
            Appraisals are done by{' '}
            {brand ? <strong className="text-bhg-black">{brand}</strong> : 'our family appraisal company'}, a separate
            company founded by {site.founderName}{brand ? '' : ` (${APPRAISAL_BRAND_COMING_SOON})`}.
          </p>
          <div className="w-12 h-1 bg-bhg-copper mx-auto mt-6 rounded-full" aria-hidden="true"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="rounded-card p-7 md:p-8 bg-gradient-to-br from-bhg-copper to-orange-700 text-white shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <Award size={28} aria-hidden="true" className="text-white"/>
                <h2 className="font-serif text-heading-lg">Why a separate company</h2>
              </div>
              <p className="text-body-md text-white/90 leading-relaxed mb-4">
                {site.galleryName} shows and sells art. Valuing art is kept apart from selling it, so an
                appraisal is never shaped by a sale.
              </p>
              <p className="text-body-md text-white/90 leading-relaxed">
                Each appraisal is quoted on request. The fee depends on the artist and how many pieces
                you have.
              </p>
            </div>

            <div className="card p-7 md:p-8">
              <h2 className="font-serif text-heading-md text-bhg-black mb-4">About the appraiser</h2>
              <p className="text-body-md text-bhg-gray-600 leading-relaxed mb-3">
                {site.founderName} ran {site.galleryName} in a physical space for 37 years and has spent the past 13 years
                selling and appraising African American art.
              </p>
              <p className="text-body-md text-bhg-gray-600 leading-relaxed">
                She knows the work of {listToText(site.artistsKnown)} deeply, along with Houston artists{' '}
                {listToText(site.houstonArtistsKnown)}.
              </p>
            </div>

            <div className="card p-7 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <ClipboardCheck size={22} aria-hidden="true" className="text-bhg-copper"/>
                <h2 className="font-serif text-heading-md text-bhg-black">How it works</h2>
              </div>
              <ol className="space-y-3">
                {processSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-7 h-7 rounded-full bg-bhg-copper text-white font-sans font-semibold text-body-sm flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-body-md text-bhg-gray-600 leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: request form */}
          <div className="card p-7 md:p-8 border border-bhg-gray-200">
            <h2 className="font-serif text-heading-lg text-bhg-black mb-2">Request an appraisal</h2>
            <p className="text-body-sm text-bhg-gray-600 mb-6">
              Requests are handled by the family appraisal team, not the gallery&apos;s sales side.
            </p>
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="appraisal-name" className="block text-body-sm font-sans font-medium text-bhg-black mb-1.5">
                  Full Name <span className="text-bhg-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="appraisal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn('input-field', errors.name && 'border-bhg-error focus:border-bhg-error focus:ring-bhg-error')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'appraisal-name-error' : undefined}
                  disabled={submitting}
                  required
                />
                {errors.name && <p id="appraisal-name-error" className="text-body-sm text-bhg-error mt-1" role="alert">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="appraisal-email" className="block text-body-sm font-sans font-medium text-bhg-black mb-1.5">
                  Email Address <span className="text-bhg-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="appraisal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn('input-field', errors.email && 'border-bhg-error focus:border-bhg-error focus:ring-bhg-error')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'appraisal-email-error' : undefined}
                  disabled={submitting}
                  required
                />
                {errors.email && <p id="appraisal-email-error" className="text-body-sm text-bhg-error mt-1" role="alert">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="appraisal-phone" className="block text-body-sm font-sans font-medium text-bhg-black mb-1.5">
                  Phone Number
                </label>
                <input
                  id="appraisal-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="appraisal-description" className="block text-body-sm font-sans font-medium text-bhg-black mb-1.5">
                  Artwork Description <span className="text-bhg-error" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="appraisal-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Please describe your artwork including artist name, medium, dimensions, condition, and any known provenance..."
                  className={cn('input-field resize-y', errors.description && 'border-bhg-error focus:border-bhg-error focus:ring-bhg-error')}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'appraisal-description-error' : undefined}
                  disabled={submitting}
                  required
                />
                {errors.description && <p id="appraisal-description-error" className="text-body-sm text-bhg-error mt-1" role="alert">{errors.description}</p>}
              </div>

              <div>
                <label htmlFor="appraisal-purpose" className="block text-body-sm font-sans font-medium text-bhg-black mb-1.5">
                  Purpose of Appraisal <span className="text-bhg-error" aria-hidden="true">*</span>
                </label>
                <select
                  id="appraisal-purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as AppraisalPurpose | '')}
                  className={cn('input-field', errors.purpose && 'border-bhg-error focus:border-bhg-error focus:ring-bhg-error')}
                  aria-invalid={!!errors.purpose}
                  aria-describedby={errors.purpose ? 'appraisal-purpose-error' : undefined}
                  disabled={submitting}
                  required
                >
                  {purposeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.purpose && <p id="appraisal-purpose-error" className="text-body-sm text-bhg-error mt-1" role="alert">{errors.purpose}</p>}
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"/>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} aria-hidden="true"/>
                    Submit Appraisal Request
                  </>
                )}
              </button>

              <p className="text-body-sm text-bhg-gray-600 text-center pt-1">
                We&apos;ll reply by email with next steps and the fee.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
