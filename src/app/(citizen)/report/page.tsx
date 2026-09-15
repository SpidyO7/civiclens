'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, CheckCircle2, ChevronRight, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import DynamicMap from '@/components/shared/DynamicMap';

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  // Step 1: Capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable", err);
    }
  };

  useEffect(() => {
    if (step === 1) startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

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
              {image && <img src={image} alt="Captured" className="w-full h-full object-cover" />}
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" /> Location Detected
              </h3>
              <div className="h-40 rounded-lg overflow-hidden bg-gray-100 mb-3">
                <DynamicMap center={[19.076, 72.8777]} zoom={15} markers={[{id: 'curr', lat: 19.076, lng: 72.8777, color: '#ef4444'}]} />
              </div>
              <p className="text-sm text-gray-600 font-medium">Demo Address, Mumbai, 400001</p>
              <p className="text-xs text-gray-400 mt-1">19.076° N, 72.8777° E</p>
            </div>

            <div className="flex gap-3 mt-auto">
              <button onClick={() => setStep(1)} className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">Retake</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium shadow-md">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 flex flex-col min-h-full space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertTriangle className="text-green-600 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-semibold">AI Classification: Pothole</span>
                <p className="text-green-700/80 text-xs mt-0.5">94% confidence based on image</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border bg-white focus:ring-blue-500 focus:border-blue-500">
                  <option>Roads & Infrastructure</option>
                  <option>Water & Sanitation</option>
                  <option>Electricity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Low', 'Medium', 'High', 'Critical'].map(s => (
                    <button key={s} className="py-2 text-xs font-medium border rounded-md hover:bg-gray-50">{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  Description
                  <button className="text-blue-600 text-xs">AI Generate</button>
                </label>
                <textarea 
                  rows={4}
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the issue..."
                  defaultValue="Large pothole on the main road, causing traffic slow down and potential hazard."
                />
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button onClick={() => setStep(4)} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold shadow-md">Review & Submit</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-4 flex flex-col h-full items-center justify-center text-center space-y-4">
            <CheckCircle2 size={64} className="text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Issue Reported!</h2>
            <p className="text-gray-600">Your report has been successfully submitted and assigned an ID.</p>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full text-left">
              <div className="font-mono text-lg font-bold text-blue-900 text-center mb-2">CL-84920</div>
              <p className="text-sm text-gray-600 text-center mb-4">Routed to: BMC Road Dept, Ward K/West</p>
            </div>
            <div className="w-full space-y-3 pt-4">
              <button onClick={() => window.location.href = '/incident/CL-84920'} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium shadow-md">View Report Status</button>
              <button onClick={() => setStep(1)} className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">Report Another Issue</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
