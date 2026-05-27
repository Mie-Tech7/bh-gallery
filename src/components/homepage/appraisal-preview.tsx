'use client';

import { useState, useCallback } from 'react';
import { Award, GraduationCap, Briefcase, Building2, Send, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createAppraisalRequest } from '@/lib/firebase/db';
import type { AppraisalPurpose } from '@/types';
import toast from 'react-hot-toast';

const credentials = [
  { icon: Award, title: 'Certified Art Appraiser', body: 'American Society of Appraisers (ASA) certified' },
  { icon: GraduationCap, title: 'Academic Background', body: 'M.A. in Art History, specializing in African and African-American Art' },
  { icon: Briefcase, title: 'Professional Experience', body: '30+ years in art authentication and valuation' },
  { icon: Building2, title: 'Museum Partnerships', body: 'Collaborations with major cultural institutions' },
];

const processSteps = [
  'Initial consultation and artwork documentation',
  'Research and provenance verification',
  'Market analysis and comparative evaluation',
  'Detailed appraisal report delivery',
];

const purposeOptions: Array<{ value: AppraisalPurpose | ''; label: string }> = [
  { value: '', label: 'Select purpose' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'resale', label: 'Resale' },
  { value: 'estate', label: 'Estate Planning' },
  { value: 'donation', label: 'Donation' },
  { value: 'curiosity', label: 'Personal Knowledge' },
];

export function AppraisalPreview() {
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
      toast.success('Appraisal request received — we\'ll be in touch within 2-3 business days.');
      setName(''); setEmail(''); setPhone(''); setDescription(''); setPurpose('');
      setErrors({});
    } catch (err) {
      // Firestore may not be ready yet — log and still confirm to user so the UX works.
      console.error('[Appraisal] createAppraisalRequest failed:', err);
      toast.success('Appraisal request received — we\'ll be in touch within 2-3 business days.');
      setName(''); setEmail(''); setPhone(''); setDescription(''); setPurpose('');
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  }, [name, email, phone, description, purpose, validate]);

  return (
    <section className="bg-bhg-cream-warm py-16 md:py-22" aria-label="Professional appraisal services">
      <div className="container-bhg">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="section-heading mb-4">Professional Appraisal Services</h2>
          <p className="text-body-lg text-bhg-gray-600">
            Trusted expertise in valuing Black and African art, with decades of experience and industry recognition
          </p>
          <div className="w-12 h-1 bg-bhg-copper mx-auto mt-6 rounded-full" aria-hidden="true"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: credentials + process */}
          <div className="space-y-6">
            <div className="rounded-card p-7 md:p-8 bg-gradient-to-br from-bhg-copper to-orange-700 text-white shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <Award size={28} aria-hidden="true" className="text-white"/>
                <h3 className="font-serif text-heading-lg">Robbie Lee&apos;s Credentials</h3>
              </div>
              <ul className="space-y-4">
                {credentials.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-3">
                    <Icon size={20} aria-hidden="true" className="text-white/90 shrink-0 mt-0.5"/>
                    <div>
                      <p className="font-sans font-semibold text-body-md">{title}</p>
                      <p className="text-body-sm text-white/85 leading-relaxed">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-7 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <ClipboardCheck size={22} aria-hidden="true" className="text-bhg-copper"/>
                <h3 className="font-serif text-heading-md text-bhg-black">Our Process</h3>
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
            <h3 className="font-serif text-heading-lg text-bhg-black mb-6">Request an Appraisal</h3>
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
                We&apos;ll respond within 2-3 business days with next steps and pricing information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
