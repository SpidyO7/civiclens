'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, CheckCircle2, ChevronRight, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import DynamicMap from '@/components/shared/DynamicMap';
import type { Incident, IncidentCategory, IncidentSubcategory, Severity } from '@/types';
import { getCategoryLabel, getSubcategoryLabel } from '@/lib/utils';

const defaultLocation = { lat: 19.076, lng: 72.8777 };

const categoryOptions: { value: IncidentCategory; label: string; subcategories: IncidentSubcategory[] }[] = [
  { value: 'road', label: 'Road & Infrastructure', subcategories: ['pothole', 'damaged_road', 'damaged_footpath', 'waterlogging', 'damaged_traffic_sign'] },
  { value: 'water', label: 'Water & Drainage', subcategories: ['water_leakage', 'overflowing_drain'] },
  { value: 'waste', label: 'Waste Management', subcategories: ['garbage_accumulation', 'illegal_dumping'] },
  { value: 'electricity', label: 'Electricity', subcategories: ['broken_streetlight', 'damaged_electrical'] },
  { value: 'public_safety', label: 'Public Safety', subcategories: ['open_manhole', 'fallen_tree'] },
  { value: 'other', label: 'Other', subcategories: ['other'] },
];

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [address, setAddress] = useState('Detecting current location...');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'ready' | 'fallback'>('idle');
  const [category, setCategory] = useState<IncidentCategory>('road');
  const [subcategory, setSubcategory] = useState<IncidentSubcategory>('pothole');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('Large pothole on the main road, causing traffic slow down and potential hazard.');
  const [submitting, setSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    if (step === 1) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(mediaStream => {
          if (cancelled) {
            mediaStream.getTracks().forEach(track => track.stop());
            return;
          }

          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(err => {
          console.warn("Camera access denied or unavailable", err);
        });
    }

    return () => {
      cancelled = true;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [step]);

  const loadAddress = useCallback(async (coords: { lat: number; lng: number }) => {
    try {
      const response = await fetch(`/api/geocode?lat=${coords.lat}&lng=${coords.lng}`);
      if (!response.ok) throw new Error('Unable to resolve address');
      const result = await response.json() as { address: string; wardName?: string; municipality?: string };
      setAddress([result.address, result.wardName, result.municipality].filter(Boolean).join(', '));
    } catch {
      setAddress(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
    }
  }, []);

  const setFallbackLocation = useCallback(async () => {
    setLocation(defaultLocation);
    setLocationStatus('fallback');
    await loadAddress(defaultLocation);
  }, [loadAddress]);

  const detectLocation = useCallback(() => {
    setLocationStatus('detecting');

    if (!navigator.geolocation) {
      setFallbackLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const detected = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(detected);
        setLocationStatus('ready');
        await loadAddress(detected);
      },
      () => setFallbackLocation(),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, [loadAddress, setFallbackLocation]);

  useEffect(() => {
    if (step !== 2 || location) return;
    detectLocation();
  }, [detectLocation, location, step]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL('image/jpeg'));
    } else {
      // Fallback dummy image
      setImage('/api/placeholder/400/300');
    }
    setStep(2);
  };

  const selectCategory = (nextCategory: IncidentCategory) => {
    const option = categoryOptions.find(option => option.value === nextCategory);
    setCategory(nextCategory);
    setSubcategory(option?.subcategories[0] || 'other');
  };

  const submitReport = async () => {
    const coords = location || defaultLocation;
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subcategory,
          description,
          latitude: coords.lat,
          longitude: coords.lng,
          address,
          imageUrl: image || '',
          severity,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit report');
      const incident = await response.json() as Incident;
      setSubmittedIncident(incident);
      setStep(4);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const currentLocation = location || defaultLocation;
  const currentSubcategories = categoryOptions.find(option => option.value === category)?.subcategories || ['other'];

  // UI rendering based on steps
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-gray-50">
      {/* Progress */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <span className={step >= 1 ? 'text-blue-600' : ''}>1. Capture</span>
          <ChevronRight size={14} />
          <span className={step >= 2 ? 'text-blue-600' : ''}>2. Location</span>
          <ChevronRight size={14} />
          <span className={step >= 3 ? 'text-blue-600' : ''}>3. Details</span>
          <ChevronRight size={14} />
          <span className={step >= 4 ? 'text-blue-600' : ''}>4. Submit</span>
        </div>
        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="flex flex-col h-full relative">
            <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
              {!videoRef.current?.srcObject && (
                <div className="text-white text-center p-6 z-10 bg-black/50 rounded-xl">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Camera preview unavailable.</p>
                  <p className="text-sm opacity-70">Will use demo photo on capture.</p>
                </div>
              )}
            </div>
            <div className="bg-black p-6 pb-24 flex justify-center border-t border-gray-800">
              <button 
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <div className="w-14 h-14 rounded-full border-2 border-black"></div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 flex flex-col h-full space-y-4">
            <div className="rounded-xl overflow-hidden shadow-sm h-48 relative bg-gray-200">
              {image && <Image src={image} alt="Captured civic issue" fill unoptimized className="object-cover" />}
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" /> Location Detected
              </h3>
              <div className="h-40 rounded-lg overflow-hidden bg-gray-100 mb-3">
                <DynamicMap center={[currentLocation.lat, currentLocation.lng]} zoom={15} markers={[{id: 'curr', lat: currentLocation.lat, lng: currentLocation.lng, color: '#ef4444'}]} />
              </div>
              <p className="text-sm text-gray-600 font-medium">{address}</p>
              <p className="text-xs text-gray-400 mt-1">{currentLocation.lat.toFixed(6)}° N, {currentLocation.lng.toFixed(6)}° E</p>
              {locationStatus === 'fallback' && <p className="text-xs text-amber-600 mt-2">Using demo location because browser GPS is unavailable.</p>}
            </div>

            <div className="flex gap-3 mt-auto">
              <button onClick={() => setStep(1)} className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">Retake</button>
              <button onClick={() => setStep(3)} disabled={locationStatus === 'detecting'} className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium shadow-md disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 flex flex-col min-h-full space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertTriangle className="text-green-600 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-semibold">Suggested classification: Pothole</span>
                <p className="text-green-700/80 text-xs mt-0.5">Review and edit the category before submitting</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={category} onChange={event => selectCategory(event.target.value as IncidentCategory)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border bg-white focus:ring-blue-500 focus:border-blue-500">
                  {categoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select value={subcategory} onChange={event => setSubcategory(event.target.value as IncidentSubcategory)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border bg-white focus:ring-blue-500 focus:border-blue-500">
                  {currentSubcategories.map(option => <option key={option} value={option}>{getSubcategoryLabel(option)}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as Severity[]).map(option => (
                    <button key={option} onClick={() => setSeverity(option)} className={`py-2 text-xs font-medium border rounded-md hover:bg-gray-50 capitalize ${severity === option ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}>{option}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  Description
                  <button className="text-blue-600 text-xs">Use suggestion</button>
                </label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the issue..."
                />
              </div>
            </div>

            <div className="mt-auto pt-4">
              {submitError && <p className="text-sm text-red-600 mb-2">{submitError}</p>}
              <button onClick={submitReport} disabled={submitting || !description.trim()} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold shadow-md disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-4 flex flex-col h-full items-center justify-center text-center space-y-4">
            <CheckCircle2 size={64} className="text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Issue Reported!</h2>
            <p className="text-gray-600">Your report has been successfully submitted and assigned an ID.</p>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full text-left">
              <div className="font-mono text-lg font-bold text-blue-900 text-center mb-2">{submittedIncident?.incidentId}</div>
              <p className="text-sm text-gray-600 text-center mb-4">{getCategoryLabel(submittedIncident?.category || category)} · {submittedIncident?.address || address}</p>
            </div>
            <div className="w-full space-y-3 pt-4">
              <button onClick={() => submittedIncident && (window.location.href = `/incident/${submittedIncident.incidentId}`)} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium shadow-md">View Report Status</button>
              <button onClick={() => { setImage(null); setSubmittedIncident(null); setStep(1); }} className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">Report Another Issue</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
