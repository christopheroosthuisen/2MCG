
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Text, Card, Badge, ProgressBar } from './UIComponents';
import { COLORS } from '../constants';
import { AnalysisStatus, FeedbackMessage, Keyframe, PlaybackSpeed, ToolType, SwingAnalysis, SkeletonConfig, DrawnAnnotation, Point } from '../types';
import { analyzeSwingFrame, editSwingImage, animateSwingPhoto } from '../services/geminiService';
import { generateSwingReport } from '../services/swingAnalysisService';
import { db } from '../services/dataService';

// --- ICONS ---
const Icons = {
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Pause: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>,
    SkipBack: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>,
    SkipForward: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Split: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>,
    Tag: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
    Maximize: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>,
    Layers: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
    Volume2: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>,
    VolumeX: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>,
    Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    EyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
    Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
    Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    Trash: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Folder: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
    Cloud: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>,
    Scissors: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>,
    Wand: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2l2.5 5.5L26 10l-5.5 2.5L18 18l-2.5-5.5L10 10l5.5-2.5zM2 10l1.5 3.5L7 15l-3.5 1.5L2 20l-1.5-3.5L-3 15l3.5-1.5z"></path></svg>,
    Film: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
    BarChart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    Target: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    Record: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>,
    Stop: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>,
    Save: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
    Grid: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
};

// ... (AnnotationOverlay matches previous)
const AnnotationOverlay: React.FC<{
    width: number;
    height: number;
    activeTool: ToolType | null;
    annotations: DrawnAnnotation[];
    onAddAnnotation: (a: DrawnAnnotation) => void;
}> = ({ width, height, activeTool, annotations, onAddAnnotation }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw saved annotations
        annotations.forEach(ann => {
            ctx.beginPath();
            ctx.strokeStyle = ann.color;
            ctx.lineWidth = ann.strokeWidth;
            if (ann.type === 'LINE' && ann.points.length === 2) {
                ctx.moveTo(ann.points[0].x, ann.points[0].y);
                ctx.lineTo(ann.points[1].x, ann.points[1].y);
            } else if (ann.type === 'CIRCLE' && ann.points.length === 2) {
                const r = Math.sqrt(Math.pow(ann.points[1].x - ann.points[0].x, 2) + Math.pow(ann.points[1].y - ann.points[0].y, 2));
                ctx.arc(ann.points[0].x, ann.points[0].y, r, 0, 2 * Math.PI);
            } else if (ann.type === 'FREEHAND' && ann.points.length > 1) {
                ctx.moveTo(ann.points[0].x, ann.points[0].y);
                ann.points.forEach(p => ctx.lineTo(p.x, p.y));
            }
            ctx.stroke();
        });

        // Draw current stroke
        if (currentPoints.length > 0 && activeTool) {
            ctx.beginPath();
            ctx.strokeStyle = COLORS.primary;
            ctx.lineWidth = 3;
            if (activeTool === 'LINE') {
                ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
                const last = currentPoints[currentPoints.length - 1];
                ctx.lineTo(last.x, last.y);
            } else if (activeTool === 'CIRCLE') {
                const first = currentPoints[0];
                const last = currentPoints[currentPoints.length - 1];
                const r = Math.sqrt(Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2));
                ctx.arc(first.x, first.y, r, 0, 2 * Math.PI);
            } else if (activeTool === 'FREEHAND') {
                ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
                currentPoints.forEach(p => ctx.lineTo(p.x, p.y));
            }
            ctx.stroke();
        }
    }, [width, height, annotations, currentPoints, activeTool]);

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!activeTool) return;
        setIsDrawing(true);
        const p = getCoords(e);
        setCurrentPoints([p]);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const p = getCoords(e);
        if (activeTool === 'FREEHAND') {
            setCurrentPoints(prev => [...prev, p]);
        } else {
            setCurrentPoints(prev => [prev[0], p]);
        }
    };

    const handleEnd = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentPoints.length > 1 && activeTool) {
            onAddAnnotation({
                id: crypto.randomUUID(),
                type: activeTool,
                points: currentPoints,
                color: COLORS.primary,
                strokeWidth: 3
            });
        }
        setCurrentPoints([]);
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`absolute inset-0 z-30 ${activeTool ? 'cursor-crosshair touch-none' : 'pointer-events-none'}`}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        />
    );
};

export const MediaCaptureWizard: React.FC<{
    onComplete: (videoUrl: string, thumbUrl: string) => void;
    onCancel: () => void;
}> = ({ onComplete, onCancel }) => {
    const [status, setStatus] = useState<AnalysisStatus>('SELECT_SOURCE');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    // Camera Handling
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setStatus('RECORDING');
        } catch (e) {
            alert("Camera access denied or unavailable.");
        }
    };

    const startRecording = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setStatus('PREVIEW');
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                    videoRef.current.src = url;
                    videoRef.current.muted = false;
                    videoRef.current.loop = true;
                    videoRef.current.play();
                }
                // Stop camera tracks
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            // Timer
            setRecordingTime(0);
            timerRef.current = window.setInterval(() => setRecordingTime(t => t + 1), 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setStatus('PREVIEW');
        }
    };

    const handleConfirm = () => {
        if (previewUrl && videoRef.current) {
            // Create a thumbnail
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth || 640;
            canvas.height = videoRef.current.videoHeight || 360;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const thumbUrl = canvas.toDataURL('image/jpeg');
            
            onComplete(previewUrl, thumbUrl);
        }
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (status === 'SELECT_SOURCE') {
        return (
            <div className="flex flex-col h-full bg-[#111827] text-white p-6 justify-center">
                <div className="text-center mb-12">
                    <Text variant="h2" color="white" className="mb-2">New Analysis</Text>
                    <Text className="text-gray-400">Record or upload your swing</Text>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                    <button onClick={startCamera} className="aspect-square bg-gray-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-gray-700 transition-all border border-gray-700 group">
                        <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center text-4xl shadow-lg shadow-orange-900/50 group-hover:scale-110 transition-transform"><Icons.Camera /></div>
                        <span className="font-bold text-lg">Record Swing</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="aspect-square bg-gray-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-gray-700 transition-all border border-gray-700 group">
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-4xl shadow-lg shadow-blue-900/50 group-hover:scale-110 transition-transform"><Icons.Upload /></div>
                        <span className="font-bold text-lg">Upload Video</span>
                    </button>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileSelect} />
                
                <button onClick={onCancel} className="mt-12 text-gray-500 font-bold hover:text-white transition-colors">Cancel</button>
            </div>
        );
    }

    if (status === 'RECORDING') {
        return (
            <div className="flex flex-col h-full bg-black relative">
                <video ref={videoRef} className="flex-1 w-full h-full object-cover" muted playsInline autoPlay />
                
                {/* HUD */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <button onClick={() => { 
                        // Stop tracks manually if cancelling
                        if (videoRef.current?.srcObject) {
                            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                        }
                        setStatus('SELECT_SOURCE'); 
                    }} className="text-white p-2 bg-black/20 backdrop-blur rounded-full"><span className="text-2xl">✕</span></button>
                    <div className="bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="font-mono font-bold text-sm">{mediaRecorderRef.current?.state === 'recording' ? formatTime(recordingTime) : 'READY'}</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                </div>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center bg-gradient-to-t from-black/80 to-transparent">
                    {mediaRecorderRef.current?.state === 'recording' ? (
                        <button onClick={stopRecording} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:scale-105 transition-transform">
                            <div className="w-8 h-8 bg-white rounded-sm"></div>
                        </button>
                    ) : (
                        <button onClick={startRecording} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:scale-105 transition-transform">
                            <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse"></div>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (status === 'PREVIEW' && previewUrl) {
        return (
            <div className="flex flex-col h-full bg-black text-white">
                <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
                    <video ref={videoRef} src={previewUrl} controls className="max-h-full max-w-full" playsInline />
                </div>
                <div className="bg-[#1F2937] p-6 border-t border-gray-700 safe-area-bottom">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <Text variant="h4" color="white" className="text-sm font-bold">Review Swing</Text>
                            <Text className="text-xs text-gray-400">Ready for AI analysis?</Text>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="ghost" fullWidth onClick={() => setStatus('SELECT_SOURCE')}>Retake</Button>
                        <Button variant="primary" fullWidth onClick={handleConfirm}>Analyze Swing</Button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// Video Zoom & Pan Controls
const VideoZoomControls: React.FC<{
    scale: number;
    onScaleChange: (s: number) => void;
    onReset: () => void;
}> = ({ scale, onScaleChange, onReset }) => (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-40 bg-black/60 backdrop-blur-sm p-2 rounded-xl border border-white/10">
        <button onClick={() => onScaleChange(Math.min(3, scale + 0.5))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white font-bold hover:bg-white/20">+</button>
        <div className="text-center text-[10px] font-bold text-gray-300">{scale.toFixed(1)}x</div>
        <button onClick={() => onScaleChange(Math.max(1, scale - 0.5))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white font-bold hover:bg-white/20">-</button>
        <button onClick={onReset} className="text-[10px] text-orange-400 font-bold mt-1">Reset</button>
    </div>
);

export const ProVideoPlayer: React.FC<{
    src: string;
    isPlaying: boolean;
    playbackRate: number;
    activeTool: ToolType | null;
    annotations: DrawnAnnotation[];
    onTogglePlay: () => void;
    onAddAnnotation: (a: DrawnAnnotation) => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    currentTime: number;
    keyframes?: Keyframe[];
}> = ({ src, isPlaying, playbackRate, activeTool, annotations, onTogglePlay, onAddAnnotation, videoRef, currentTime, keyframes }) => {
    const [dims, setDims] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Zoom/Pan State
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (videoRef.current) videoRef.current.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        if (videoRef.current) isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }, [isPlaying]);

    useEffect(() => {
        const updateDims = () => {
            if (containerRef.current) {
                setDims({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };
        window.addEventListener('resize', updateDims);
        updateDims();
        return () => window.removeEventListener('resize', updateDims);
    }, []);

    // Current P-Position Badge Logic
    const currentKeyframe = keyframes?.find(kf => Math.abs(kf.timestamp - currentTime) < 0.1);

    // Pan Logic
    const handleDragStart = (clientX: number, clientY: number) => {
        if (scale > 1) {
            setIsDragging(true);
            setLastPos({ x: clientX, y: clientY });
        }
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (isDragging && scale > 1) {
            const dx = clientX - lastPos.x;
            const dy = clientY - lastPos.y;
            setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setLastPos({ x: clientX, y: clientY });
        }
    };

    const handleDragEnd = () => setIsDragging(false);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden group touch-none">
            {/* Zoom Controls */}
            <VideoZoomControls 
                scale={scale} 
                onScaleChange={setScale} 
                onReset={() => { setScale(1); setTranslate({x:0,y:0}); }} 
            />

            {/* Current P-Position Overlay */}
            {currentKeyframe && (
                <div className="absolute top-4 left-4 z-40 animate-in fade-in zoom-in duration-200 pointer-events-none">
                    <div className="bg-orange-600 text-white px-3 py-1.5 rounded-lg shadow-lg border border-white/20 backdrop-blur-md">
                        <div className="text-[10px] font-bold uppercase opacity-80">Position</div>
                        <div className="text-lg font-black leading-none">{currentKeyframe.label || currentKeyframe.type}</div>
                    </div>
                </div>
            )}

            <div 
                className="relative w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `scale(${scale}) translate(${translate.x/scale}px, ${translate.y/scale}px)` }}
                onMouseDown={e => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={e => handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={e => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={e => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
            >
                <video 
                    ref={videoRef} 
                    src={src} 
                    className="max-h-full max-w-full object-contain pointer-events-none" 
                    playsInline 
                    loop 
                    muted 
                    onLoadedMetadata={() => {
                        if (containerRef.current) {
                            setDims({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
                        }
                    }}
                />
                
                <AnnotationOverlay 
                    width={dims.width} 
                    height={dims.height} 
                    activeTool={activeTool} 
                    annotations={annotations}
                    onAddAnnotation={onAddAnnotation}
                />
            </div>

            {!isPlaying && !activeTool && scale === 1 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/10 transition-opacity pointer-events-auto" onClick={onTogglePlay}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg hover:scale-110 transition-transform">
                        <Icons.Play />
                    </div>
                </div>
            )}
        </div>
    );
};

export const TransportControls: React.FC<{
    isPlaying: boolean;
    onTogglePlay: () => void;
    currentTime: number;
    duration: number;
    playbackRate: number;
    onSeek: (time: number) => void;
    onRateChange: (rate: number) => void;
    onFrameStep: (frames: number) => void;
    keyframes?: Keyframe[];
    onKeyframeSelect?: (time: number) => void;
}> = ({ isPlaying, onTogglePlay, currentTime, duration, playbackRate, onSeek, onRateChange, onFrameStep, keyframes, onKeyframeSelect }) => {
    const formatTime = (t: number) => {
        const s = Math.floor(t);
        const ms = Math.floor((t % 1) * 100);
        return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-[#111827] border-t border-gray-800 p-2 safe-area-bottom z-30">
            {/* Scrubber with Keyframes */}
            <div className="relative h-12 mb-2 group cursor-pointer select-none" 
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    onSeek(pos * (duration || 1));
                }}
            >
                <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-700 rounded-full overflow-visible">
                    {/* Keyframe Markers */}
                    {keyframes?.map((kf) => (
                        <div 
                            key={kf.id}
                            className="absolute top-1/2 w-3 h-3 bg-yellow-500 rounded-full -translate-y-1/2 -translate-x-1/2 z-10 cursor-pointer border border-black hover:scale-125 transition-transform"
                            style={{ left: `${(kf.timestamp / (duration || 1)) * 100}%` }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if(onKeyframeSelect) onKeyframeSelect(kf.timestamp);
                            }}
                        >
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[8px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {kf.label || kf.type}
                            </div>
                        </div>
                    ))}
                    {/* Progress Fill */}
                    <div className="absolute top-0 bottom-0 left-0 bg-orange-500 rounded-full" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
                    {/* Scrubber Handle */}
                    <div 
                        className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-md -translate-y-1/2 -translate-x-1/2 border-2 border-orange-500 z-20"
                        style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                    ></div>
                </div>
                
                {/* Time Display */}
                <div className="absolute top-0 left-0 text-[10px] font-mono font-bold text-gray-500">
                    {formatTime(currentTime)}
                </div>
                <div className="absolute top-0 right-0 text-[10px] font-mono font-bold text-gray-500">
                    {formatTime(duration)}
                </div>
            </div>

            <div className="flex justify-between items-center px-2">
                <div className="flex gap-2">
                    {[0.25, 0.5, 1.0].map(rate => (
                        <button 
                            key={rate} 
                            onClick={() => onRateChange(rate)}
                            className={`text-[10px] font-bold px-2 py-1 rounded border ${playbackRate === rate ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-700 text-gray-400 hover:text-white'}`}
                        >
                            {rate}x
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => onFrameStep(-1)} className="text-gray-400 hover:text-white p-2 active:scale-95"><Icons.SkipBack /></button>
                    <button 
                        onClick={onTogglePlay} 
                        className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                        {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                    </button>
                    <button onClick={() => onFrameStep(1)} className="text-gray-400 hover:text-white p-2 active:scale-95"><Icons.SkipForward /></button>
                </div>

                <div className="w-20 text-right">
                    {/* Placeholder for alignment */}
                </div>
            </div>
        </div>
    );
};

export const AnalysisToolbar: React.FC<{ 
    activeTool: ToolType | null;
    onSelectTool: (t: ToolType | null) => void;
    onClear: () => void;
    onMagicEdit: () => void;
    onAnimate: () => void;
}> = ({ activeTool, onSelectTool, onClear, onMagicEdit, onAnimate }) => (
    <div className="bg-[#1F2937] border-t border-gray-700 p-2 safe-area-bottom z-30">
        <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {[
                    { id: 'LINE', icon: '📏', label: 'Line' },
                    { id: 'CIRCLE', icon: '⭕', label: 'Circle' },
                    { id: 'FREEHAND', icon: '✏️', label: 'Draw' },
                ].map(tool => (
                    <button 
                        key={tool.id} 
                        onClick={() => onSelectTool(activeTool === tool.id ? null : tool.id as ToolType)}
                        className={`flex-1 flex flex-col items-center justify-center min-w-[56px] h-14 rounded-xl transition-all ${
                            activeTool === tool.id 
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/50 scale-105' 
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-lg mb-0.5">{tool.icon}</span>
                        <span className="text-[9px] font-bold uppercase">{tool.label}</span>
                    </button>
                ))}
                {/* AI Tools */}
                <button 
                    onClick={onMagicEdit}
                    className="flex flex-col items-center justify-center min-w-[56px] h-14 rounded-xl transition-all bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300"
                >
                    <span className="text-lg mb-0.5">✨</span>
                    <span className="text-[9px] font-bold uppercase">Edit</span>
                </button>
                <button 
                    onClick={onAnimate}
                    className="flex flex-col items-center justify-center min-w-[56px] h-14 rounded-xl transition-all bg-gray-800 text-purple-400 hover:bg-gray-700 hover:text-purple-300"
                >
                    <span className="text-lg mb-0.5">🎬</span>
                    <span className="text-[9px] font-bold uppercase">Animate</span>
                </button>
            </div>
            <div className="h-8 w-px bg-gray-700 mx-2"></div>
            <button onClick={onClear} className="flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl bg-gray-800 text-red-400 hover:bg-gray-700 hover:text-red-300">
                <Icons.Trash />
                <span className="text-[9px] font-bold uppercase mt-1">Clear</span>
            </button>
        </div>
    </div>
);

// --- KEYFRAME EDITOR COMPONENT ---
const KeyframeEditor: React.FC<{
    keyframes: Keyframe[];
    currentTimestamp: number;
    onUpdateKeyframe: (id: string, newTime: number) => void;
    onClose: () => void;
    onSeek: (time: number) => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onFrameStep: (frames: number) => void;
}> = ({ keyframes, currentTimestamp, onUpdateKeyframe, onClose, onSeek, isPlaying, onTogglePlay, onFrameStep }) => {
    // Sort keyframes by timestamp order for display
    const sortedKeyframes = [...keyframes].sort((a,b) => a.timestamp - b.timestamp);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <div className="bg-[#1F2937] border-t-2 border-orange-500 p-4 safe-area-bottom z-40 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-4">
                <Text variant="h4" color="white" className="text-sm font-bold uppercase tracking-wider">Adjust Positions</Text>
                <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-white bg-gray-700 px-3 py-1 rounded">Done</button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-2">
                {sortedKeyframes.map(kf => {
                    const isSelected = selectedId === kf.id;
                    return (
                        <button
                            key={kf.id}
                            onClick={() => {
                                setSelectedId(kf.id);
                                onSeek(kf.timestamp);
                            }}
                            className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl border transition-all ${
                                isSelected 
                                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/50' 
                                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <span className="text-[10px] font-bold uppercase">{kf.label || kf.type}</span>
                            <span className="text-[9px] font-mono opacity-70">{kf.timestamp.toFixed(2)}s</span>
                        </button>
                    );
                })}
            </div>

            {/* Precision Controls */}
            <div className="flex items-center justify-center gap-6 mb-4 bg-gray-800/50 p-2 rounded-xl border border-gray-700/50">
                <button onClick={() => onFrameStep(-1)} className="p-3 text-white hover:bg-gray-700 rounded-full active:scale-95 transition-all flex items-center">
                    <span className="text-xs font-bold mr-1">-1</span> <Icons.SkipBack /> 
                </button>
                <button onClick={onTogglePlay} className="p-4 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg">
                    {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                </button>
                <button onClick={() => onFrameStep(1)} className="p-3 text-white hover:bg-gray-700 rounded-full active:scale-95 transition-all flex items-center">
                    <Icons.SkipForward /> <span className="text-xs font-bold ml-1">+1</span>
                </button>
            </div>

            {selectedId ? (
                <Button 
                    fullWidth 
                    variant="primary" 
                    className="bg-orange-500 hover:bg-orange-400 h-12 text-sm uppercase tracking-wide shadow-lg shadow-orange-900/20"
                    onClick={() => onUpdateKeyframe(selectedId, currentTimestamp)}
                >
                    Update {keyframes.find(k => k.id === selectedId)?.label}
                </Button>
            ) : (
                <div className="text-center text-xs text-gray-500 py-3 font-medium bg-gray-800/30 rounded-lg border border-gray-700 border-dashed">
                    Select a position above to adjust
                </div>
            )}
        </div>
    );
};

// --- SCREEN RECORDER COMPONENT ---
const ScreenRecorderUI: React.FC<{
    isRecording: boolean;
    onStop: () => void;
    duration: number;
}> = ({ isRecording, onStop, duration }) => {
    if (!isRecording) return null;

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-in fade-in duration-200">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-mono font-bold">{formatTime(duration)}</span>
            <div className="w-px h-4 bg-white/30"></div>
            <button onClick={onStop} className="font-bold text-xs uppercase hover:bg-red-700 px-2 py-1 rounded">Stop</button>
        </div>
    );
};

// Sequence Modal Component
const SwingSequenceModal: React.FC<{ images: {label: string, src: string}[], onClose: () => void }> = ({ images, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
        <div className="p-4 flex justify-between items-center bg-gray-900 border-b border-gray-800">
            <Text variant="h3" color="white">Swing Sequence</Text>
            <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                        <div className="aspect-[3/4] relative">
                            <img src={img.src} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
                                <p className="text-center text-white text-xs font-bold uppercase tracking-wider">{img.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="p-4 bg-gray-900 border-t border-gray-800 safe-area-bottom">
            <Button fullWidth variant="primary" icon={<Icons.Download />} onClick={() => alert("Saved to Photos!")}>Save All</Button>
        </div>
    </div>
);

// --- MAIN WRAPPER COMPONENT ---
export const AnalysisResult: React.FC<{ analysisId: string; onBack: () => void; onAskCoach: (msg: string) => void }> = ({ analysisId, onBack, onAskCoach }) => {
    const swing = db.getSwings().find(s => s.id === analysisId) || db.getSwings()[0];
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // State
    const [viewMode, setViewMode] = useState<'PLAYER' | 'REPORT'>('PLAYER');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [activeTool, setActiveTool] = useState<ToolType | null>(null);
    const [annotations, setAnnotations] = useState<DrawnAnnotation[]>(swing.annotations || []);
    const [keyframes, setKeyframes] = useState<Keyframe[]>(swing.keyframes || []);
    
    // Editor State
    const [isEditingKeyframes, setIsEditingKeyframes] = useState(false);

    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    
    // Generative AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
    const [analysisReport, setAnalysisReport] = useState<any>(null);

    // Sequence Export State
    const [isGeneratingSequence, setIsGeneratingSequence] = useState(false);
    const [sequenceImages, setSequenceImages] = useState<{label: string, src: string}[]>([]);
    const [showSequenceModal, setShowSequenceModal] = useState(false);

    // Auto-Analyze New Swings
    useEffect(() => {
        if (!swing.feedback || swing.feedback.length === 0) {
            startAnalysis();
        } else {
            // Populate if already exists
            setAnalysisReport({
                overallScore: swing.score || 85,
                feedback: swing.feedback,
                metrics: swing.metrics || { clubSpeed: 105, ballSpeed: 152 }
            });
            if(swing.keyframes && swing.keyframes.length > 0) {
                setKeyframes(swing.keyframes);
            }
        }
    }, [swing.id]);

    // Sync Time
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        const updateTime = () => setCurrentTime(vid.currentTime);
        const updateDur = () => setDuration(vid.duration);
        
        vid.addEventListener('timeupdate', updateTime);
        vid.addEventListener('loadedmetadata', updateDur);
        return () => {
            vid.removeEventListener('timeupdate', updateTime);
            vid.removeEventListener('loadedmetadata', updateDur);
        };
    }, []);

    // Recording Timer
    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => setRecordingDuration(d => d + 1), 1000);
        } else {
            setRecordingDuration(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startAnalysis = async () => {
        setIsAnalyzing(true);
        // Simulate AI Analysis process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockReport = {
            overallScore: 82,
            overallGrade: 'B+',
            metrics: { clubSpeed: 108, ballSpeed: 158, efficiency: 1.46 },
            feedback: [
                { category: 'POSTURE', severity: 'WARNING', text: 'Spine angle is slightly too upright at address. Flex forward from hips.', correction: 'Tilt forward 5 degrees more.' },
                { category: 'TEMPO', severity: 'INFO', text: 'Backswing to downswing ratio is 2.8:1 (Good range).', correction: '' },
                { category: 'PLANE', severity: 'CRITICAL', text: 'Club path is coming over the top in transition.', correction: 'Feel like your back stays to target longer.' }
            ]
        };

        // Generate P1-P10 Keyframes based on video duration
        const estimatedDur = swing.metrics?.clubSpeed ? 3.0 : 3.5; // fallback
        const newKeyframes = [
            { id: 'k1', type: 'P1', label: 'P1 Address', timestamp: estimatedDur * 0.1 },
            { id: 'k2', type: 'P2', label: 'P2 Club Parallel', timestamp: estimatedDur * 0.25 },
            { id: 'k3', type: 'P4', label: 'P4 Top', timestamp: estimatedDur * 0.45 },
            { id: 'k4', type: 'P5', label: 'P5 Transition', timestamp: estimatedDur * 0.55 },
            { id: 'k5', type: 'P7', label: 'P7 Impact', timestamp: estimatedDur * 0.65 },
            { id: 'k6', type: 'P10', label: 'P10 Finish', timestamp: estimatedDur * 0.9 },
        ] as Keyframe[];
        
        // Update DB in real app
        swing.score = mockReport.overallScore;
        swing.feedback = mockReport.feedback as any;
        swing.metrics = mockReport.metrics;
        swing.keyframes = newKeyframes;
        
        setKeyframes(newKeyframes);
        setAnalysisReport(mockReport);
        setIsAnalyzing(false);
    };

    const handleSeek = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleFrameStep = (frames: number) => {
        const step = 1/30;
        handleSeek(Math.min(Math.max(0, currentTime + (frames * step)), duration));
    };

    const handleAddAnnotation = (ann: DrawnAnnotation) => {
        setAnnotations(prev => [...prev, ann]);
        setActiveTool(null);
    };

    // Keyframe Editing
    const handleUpdateKeyframe = (id: string, newTime: number) => {
        const updated = keyframes.map(kf => kf.id === id ? { ...kf, timestamp: newTime } : kf);
        setKeyframes(updated);
        // Persist to DB immediately or wait for save? For simplicity, we assume auto-save effect
        swing.keyframes = updated;
    };

    const generateSequence = async () => {
        if (!videoRef.current || !keyframes.length) return;
        
        setIsGeneratingSequence(true);
        const video = videoRef.current;
        const originalTime = video.currentTime;
        const wasPlaying = !video.paused;
        
        if (wasPlaying) video.pause();

        const images: {label: string, src: string}[] = [];
        const sortedKeyframes = [...keyframes].sort((a,b) => a.timestamp - b.timestamp);

        try {
            for (const kf of sortedKeyframes) {
                // Seek
                video.currentTime = kf.timestamp;
                await new Promise<void>(resolve => {
                    const handler = () => {
                        video.removeEventListener('seeked', handler);
                        resolve();
                    };
                    video.addEventListener('seeked', handler);
                });

                // Capture
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    images.push({
                        label: kf.label || kf.type,
                        src: canvas.toDataURL('image/jpeg', 0.8)
                    });
                }
            }
        } catch (e) {
            console.error("Sequence generation failed", e);
        } finally {
            // Restore
            video.currentTime = originalTime;
            if (wasPlaying) video.play();
            setSequenceImages(images);
            setIsGeneratingSequence(false);
            setShowSequenceModal(true);
        }
    };

    // Screen Recording
    const handleStartRecording = async () => {
        try {
            // Get screen stream
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
                video: { width: 1280, height: 720 }, 
                audio: false // System audio usually not needed for voiceover feedback
            });
            
            // Get mic stream
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Combine tracks
            const tracks = [...screenStream.getVideoTracks(), ...micStream.getAudioTracks()];
            const combinedStream = new MediaStream(tracks);

            const recorder = new MediaRecorder(combinedStream);
            mediaRecorderRef.current = recorder;
            recordedChunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    recordedChunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                // Cleanup tracks
                screenStream.getTracks().forEach(track => track.stop());
                micStream.getTracks().forEach(track => track.stop());
                
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                
                // For demo, just play it back in overlay
                setGeneratedMediaUrl(url);
                setIsRecording(false);
            };

            recorder.start();
            setIsRecording(true);

        } catch (e) {
            console.error("Recording failed", e);
            alert("Could not start recording. Ensure permissions are granted.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    // ... (captureFrame, handleMagicEdit, handleAnimate match previous)
    const captureFrame = () => {
        if (!videoRef.current) return null;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        return canvas.toDataURL('image/jpeg');
    };

    const handleMagicEdit = async () => {
        const frame = captureFrame();
        if (!frame) return;
        const userPrompt = window.prompt("What would you like to edit? (e.g., 'Add a retro filter', 'Remove background')");
        if (!userPrompt) return;
        setIsProcessingAI(true);
        const result = await editSwingImage(frame, userPrompt);
        setIsProcessingAI(false);
        if (result) setGeneratedMediaUrl(result);
    };

    const handleAnimate = async () => {
        const frame = captureFrame();
        if (!frame) return;
        setIsProcessingAI(true);
        const result = await animateSwingPhoto(frame, "A cinematic slow motion golf swing");
        setIsProcessingAI(false);
        if (result) setGeneratedMediaUrl(result);
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-black text-white fixed inset-0 z-50 animate-in slide-in-from-right duration-300">
             {/* Header */}
             <div className="flex items-center justify-between p-3 bg-[#111827] border-b border-gray-800 safe-area-top z-50 relative">
                <button onClick={onBack} className="p-2 text-gray-400 hover:text-white flex items-center gap-1">
                    <Icons.SkipBack /> Back
                </button>
                
                {/* View Switcher */}
                <div className="flex bg-gray-800 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('PLAYER')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'PLAYER' ? 'bg-gray-600 text-white shadow' : 'text-gray-400 hover:text-gray-300'}`}
                    >
                        Video
                    </button>
                    <button 
                        onClick={() => setViewMode('REPORT')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'REPORT' ? 'bg-gray-600 text-white shadow' : 'text-gray-400 hover:text-gray-300'}`}
                    >
                        Report
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={generateSequence}
                        className="p-2 text-xs font-bold bg-gray-800 text-gray-300 hover:text-white rounded-lg flex items-center gap-1"
                        title="Export Sequence"
                    >
                        <Icons.Image />
                    </button>
                    <button 
                        onClick={isEditingKeyframes ? () => setIsEditingKeyframes(false) : () => setIsEditingKeyframes(true)}
                        className={`p-2 text-xs font-bold rounded-lg ${isEditingKeyframes ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white bg-gray-800'}`}
                    >
                        Adjust
                    </button>
                    <button 
                        onClick={handleStartRecording}
                        className="p-2 text-red-500 font-bold text-xs bg-red-500/10 rounded-lg flex items-center gap-1 hover:bg-red-500/20"
                        title="Record Feedback"
                    >
                        <Icons.Record />
                    </button>
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 relative bg-black flex flex-col overflow-hidden">
                <ScreenRecorderUI isRecording={isRecording} onStop={handleStopRecording} duration={recordingDuration} />

                {isAnalyzing || isGeneratingSequence ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40 backdrop-blur-sm">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <Text variant="h3" color="white" className="animate-pulse">{isGeneratingSequence ? "Generating Sequence..." : "Analyzing Swing..."}</Text>
                        <Text className="text-gray-400 text-sm mt-2">{isGeneratingSequence ? "Extracting high-res frames" : "Checking mechanics & tempo"}</Text>
                    </div>
                ) : null}

                {/* Player Mode */}
                <div className={`flex-1 relative flex items-center justify-center h-full w-full ${viewMode === 'PLAYER' ? 'block' : 'hidden'}`}>
                    {isProcessingAI ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <Text>Generating with Gemini...</Text>
                        </div>
                    ) : generatedMediaUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                            {generatedMediaUrl.startsWith('data:image') ? (
                                <img src={generatedMediaUrl} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <video src={generatedMediaUrl} controls autoPlay className="max-h-full max-w-full object-contain" />
                            )}
                            <button 
                                onClick={() => setGeneratedMediaUrl(null)} 
                                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white hover:bg-black/80"
                            >
                                <span className="text-xl">×</span>
                            </button>
                            {/* If it's a recorded video, show a save button */}
                            {!generatedMediaUrl.startsWith('data:image') && (
                                <button className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
                                    <Icons.Save /> Save Recording
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <ProVideoPlayer 
                                src={swing.videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                                isPlaying={isPlaying} 
                                playbackRate={playbackRate}
                                activeTool={activeTool}
                                annotations={annotations}
                                onTogglePlay={() => setIsPlaying(!isPlaying)}
                                onAddAnnotation={handleAddAnnotation}
                                videoRef={videoRef}
                                currentTime={currentTime}
                                keyframes={keyframes}
                            />
                            {/* Floating "View Report" button if analysis done */}
                            {!isAnalyzing && analysisReport && !isEditingKeyframes && !isRecording && (
                                <div className="absolute bottom-4 right-4 z-40 animate-in slide-in-from-right duration-500">
                                    <button 
                                        onClick={() => setViewMode('REPORT')}
                                        className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 border border-white/20 hover:bg-white hover:scale-105 transition-all"
                                    >
                                        View Analysis <span className="text-orange-600">→</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Report Mode */}
                {viewMode === 'REPORT' && analysisReport && (
                    <div className="flex-1 bg-gray-900 overflow-y-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="max-w-md mx-auto space-y-6 pb-20">
                            {/* Score Card */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700 shadow-xl text-center">
                                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Swing Score</Text>
                                <div className="text-6xl font-black text-white mb-2 tracking-tighter">{analysisReport.overallScore}</div>
                                <Badge variant={analysisReport.overallScore > 80 ? 'success' : 'warning'}>
                                    {analysisReport.overallScore > 80 ? 'Tour Level' : 'Needs Work'}
                                </Badge>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">Club Speed</div>
                                    <div className="text-2xl font-bold text-white">{analysisReport.metrics.clubSpeed} <span className="text-sm font-normal text-gray-500">mph</span></div>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">Ball Speed</div>
                                    <div className="text-2xl font-bold text-white">{analysisReport.metrics.ballSpeed} <span className="text-sm font-normal text-gray-500">mph</span></div>
                                </div>
                            </div>

                            {/* Feedback List */}
                            <div>
                                <Text variant="h4" color="white" className="mb-4">AI Coach Insights</Text>
                                <div className="space-y-3">
                                    {analysisReport.feedback.map((item: any, i: number) => (
                                        <div key={i} className="bg-gray-800 p-4 rounded-2xl border-l-4 border-l-orange-500 border border-gray-700 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant={item.severity === 'CRITICAL' ? 'error' : item.severity === 'WARNING' ? 'warning' : 'info'} className="text-[10px]">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                            <Text className="text-sm text-gray-200 leading-relaxed mb-2">{item.text}</Text>
                                            {item.correction && (
                                                <div className="bg-gray-900/50 p-3 rounded-xl mt-2">
                                                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase mb-1">
                                                        <span>✓</span> Correction
                                                    </div>
                                                    <Text className="text-xs text-gray-400">{item.correction}</Text>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4">
                                <Button fullWidth variant="primary" onClick={() => onAskCoach("Help me fix my swing path issues based on this report.")}>
                                    Ask Coach for Drills
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
             </div>

             {/* Footer Controls (Only in Player Mode) */}
             {viewMode === 'PLAYER' && (
                 <>
                    {/* Conditionally Render Toolbar vs Keyframe Editor */}
                    {!isEditingKeyframes ? (
                        <>
                            <TransportControls 
                                isPlaying={isPlaying} 
                                onTogglePlay={() => setIsPlaying(!isPlaying)} 
                                currentTime={currentTime}
                                duration={duration}
                                playbackRate={playbackRate}
                                onSeek={handleSeek}
                                onRateChange={setPlaybackRate}
                                onFrameStep={handleFrameStep}
                                keyframes={keyframes}
                                onKeyframeSelect={handleSeek}
                            />
                            <AnalysisToolbar 
                                activeTool={activeTool} 
                                onSelectTool={(t) => {
                                    setIsPlaying(false);
                                    setActiveTool(t);
                                }} 
                                onClear={() => setAnnotations([])}
                                onMagicEdit={handleMagicEdit}
                                onAnimate={handleAnimate}
                            />
                        </>
                    ) : (
                        <KeyframeEditor 
                            keyframes={keyframes}
                            currentTimestamp={currentTime}
                            onUpdateKeyframe={handleUpdateKeyframe}
                            onClose={() => setIsEditingKeyframes(false)}
                            onSeek={handleSeek}
                            isPlaying={isPlaying}
                            onTogglePlay={() => setIsPlaying(!isPlaying)}
                            onFrameStep={handleFrameStep}
                        />
                    )}
                </>
             )}

             {showSequenceModal && (
                 <SwingSequenceModal images={sequenceImages} onClose={() => setShowSequenceModal(false)} />
             )}
        </div>
    );
};

export const AnalyzeView: React.FC<{
    onRecord: () => void;
    onSelectSwing: (id: string) => void;
    onUpload: () => void;
}> = ({ onRecord, onSelectSwing, onUpload }) => {
    // ... (Keep existing implementation of AnalyzeView)
    const [isCapturing, setIsCapturing] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const swings = db.getSwings();

    const handleNewCapture = () => setIsCapturing(true);

    const handleCaptureComplete = (videoUrl: string, thumbUrl: string) => {
        const newSwing: SwingAnalysis = {
            id: crypto.randomUUID(),
            date: new Date(),
            videoUrl: videoUrl,
            thumbnailUrl: thumbUrl,
            clubUsed: 'DRIVER',
            tags: ['New Import'],
            metrics: {},
            feedback: [],
            keyframes: [],
            score: 0,
            annotations: []
        };
        db.addSwing(newSwing);
        setIsCapturing(false);
        onSelectSwing(newSwing.id);
    };

    if (isCapturing) {
        return <MediaCaptureWizard onComplete={handleCaptureComplete} onCancel={() => setIsCapturing(false)} />;
    }

    const filteredSwings = swings.filter(s => {
        if (filter === 'ALL') return true;
        const club = s.clubUsed;
        if (filter === 'DRIVER') return club === 'DRIVER';
        if (filter === 'IRONS') return club.includes('IRON');
        return true;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-32">
            <div className="px-1 pt-6 bg-white sticky top-0 z-10 pb-4 shadow-sm">
                <div className="flex justify-between items-end mb-4 px-4">
                    <div>
                        <Text variant="caption" className="uppercase font-bold tracking-widest text-orange-500 mb-1">Analysis</Text>
                        <Text variant="h1" className="mb-0">Swing Library</Text>
                    </div>
                    <Button size="sm" variant="primary" icon={<Icons.Pause />} onClick={handleNewCapture}>+ New</Button>
                </div>

                <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4">
                    {['ALL', 'DRIVER', 'IRONS', 'WEDGES'].map(f => (
                         <button 
                            key={f} 
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${
                                filter === f 
                                    ? 'bg-gray-900 text-white border-gray-900' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div 
                        className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all active:scale-95 bg-gray-50/50 group"
                        onClick={handleNewCapture}
                    >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 text-gray-600 group-hover:scale-110 transition-transform">
                            <Icons.Pause />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Analyze New</span>
                    </div>

                    {filteredSwings.map(swing => (
                            <div key={swing.id} className="relative group cursor-pointer transition-transform active:scale-95" onClick={() => onSelectSwing(swing.id)}>
                            <div className="aspect-[3/4] rounded-2xl bg-gray-900 overflow-hidden shadow-md border border-gray-100 relative">
                                <img src={swing.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg">
                                        <Icons.Play />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                    <Text variant="caption" color="white" className="font-bold text-xs mb-0.5 shadow-sm">{swing.clubUsed}</Text>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${swing.score > 80 ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.6)]'}`}></span>
                                        <span className="text-[10px] text-gray-300 font-medium">{swing.date.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                    </div>
                                </div>
                                {swing.score > 0 && (
                                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
                                        {swing.score}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const VideoRecorder = MediaCaptureWizard;
