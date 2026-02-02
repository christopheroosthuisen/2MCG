

import React, { useState, useEffect, useRef } from 'react';
import { Text, Button, Card, ScreenHeader } from './UIComponents';
import { COLORS } from '../constants';

type GameMode = 'LONG_GAME' | 'SHORT_GAME';
type ToneMode = 'TONES' | 'VOICE';

interface TempoPreset {
    back: number;
    down: number;
    ratio: string;
}

const LONG_GAME_PRESETS: TempoPreset[] = [
    { back: 18, down: 6, ratio: '3:1' },
    { back: 21, down: 7, ratio: '3:1' },
    { back: 24, down: 8, ratio: '3:1' },
    { back: 27, down: 9, ratio: '3:1' },
];

const SHORT_GAME_PRESETS: TempoPreset[] = [
    { back: 14, down: 7, ratio: '2:1' },
    { back: 16, down: 8, ratio: '2:1' },
    { back: 18, down: 9, ratio: '2:1' },
    { back: 20, down: 10, ratio: '2:1' },
];

const FRAME_MS = 1000 / 30; // 33.333ms per frame at 30fps

export const TempoTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameMode, setGameMode] = useState<GameMode>('LONG_GAME');
    const [toneMode, setToneMode] = useState<ToneMode>('TONES');
    const [selectedPreset, setSelectedPreset] = useState<TempoPreset>(LONG_GAME_PRESETS[2]); // Default 24/8
    const [phase, setPhase] = useState<'IDLE' | 'BACK' | 'DOWN'>('IDLE');
    
    // Animation Ref
    const animationFrameRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Switch presets when mode changes
    useEffect(() => {
        stopSequence();
        if (gameMode === 'LONG_GAME') {
            setSelectedPreset(LONG_GAME_PRESETS[2]);
        } else {
            setSelectedPreset(SHORT_GAME_PRESETS[2]);
        }
    }, [gameMode]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopSequence();
    }, []);

    const playTone = (freq: number, type: OscillatorType = 'sine') => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
        }
        const ctx = audioContextRef.current;
        if(ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    };

    const runLoop = (timestamp: number) => {
        if (!isPlaying) return;
        if (!startTimeRef.current) startTimeRef.current = timestamp;

        const elapsed = timestamp - startTimeRef.current;
        const backDuration = selectedPreset.back * FRAME_MS;
        const downDuration = selectedPreset.down * FRAME_MS;
        const totalLoop = backDuration + downDuration + 1000; // 1s pause between swings

        if (elapsed < backDuration) {
            if (phase !== 'BACK') {
                setPhase('BACK');
                playTone(600); // Start Tone
            }
        } else if (elapsed < backDuration + downDuration) {
            if (phase !== 'DOWN') {
                setPhase('DOWN');
                playTone(800); // Top Tone
            }
        } else if (elapsed < totalLoop) {
            if (phase !== 'IDLE') {
                setPhase('IDLE');
                playTone(1000, 'square'); // Impact Tone
            }
        } else {
            // Reset loop
            startTimeRef.current = timestamp;
            setPhase('BACK');
            playTone(600);
        }

        animationFrameRef.current = requestAnimationFrame(runLoop);
    };

    const togglePlay = () => {
        if (isPlaying) {
            stopSequence();
        } else {
            setIsPlaying(true);
            setPhase('IDLE');
            startTimeRef.current = 0;
            animationFrameRef.current = requestAnimationFrame(runLoop);
        }
    };

    const stopSequence = () => {
        setIsPlaying(false);
        setPhase('IDLE');
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const activePresets = gameMode === 'LONG_GAME' ? LONG_GAME_PRESETS : SHORT_GAME_PRESETS;

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col animate-in slide-in-from-right duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-[#111827] to-black z-0 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full p-6">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white rounded-full bg-white/5 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <div className="text-center">
                        <div className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">MCG Tempo</div>
                        <div className="text-xl font-black italic">TOUR RHYTHM</div>
                    </div>
                    <div className="w-10"></div>
                </div>

                {/* Visualizer Area */}
                <div className="flex-1 flex flex-col items-center justify-center mb-8">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-gray-800"></div>
                        
                        {/* Animated Ring */}
                        <div className={`absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-100 ${isPlaying && phase === 'BACK' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} style={{ transitionDuration: `${selectedPreset.back * FRAME_MS}ms` }}></div>
                        <div className={`absolute inset-0 rounded-full border-4 border-orange-500 transition-all duration-75 ${isPlaying && phase === 'DOWN' ? 'scale-0 opacity-100' : 'scale-100 opacity-0'}`} style={{ transitionDuration: `${selectedPreset.down * FRAME_MS}ms` }}></div>

                        {/* Silhouette / Center Graphics */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="text-6xl font-black mb-2 flex items-baseline gap-1">
                                <span className={phase === 'BACK' ? 'text-blue-400' : 'text-white'}>{selectedPreset.back}</span>
                                <span className="text-2xl text-gray-600">/</span>
                                <span className={phase === 'DOWN' ? 'text-orange-500' : 'text-white'}>{selectedPreset.down}</span>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                {phase === 'IDLE' ? 'Ready' : phase === 'BACK' ? 'Takeaway' : 'Downswing'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="space-y-6">
                    
                    {/* Game Mode Toggles */}
                    <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                        <button 
                            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase transition-all ${gameMode === 'LONG_GAME' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-500 hover:text-white'}`}
                            onClick={() => setGameMode('LONG_GAME')}
                        >
                            Long Game
                        </button>
                        <button 
                            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase transition-all ${gameMode === 'SHORT_GAME' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-500 hover:text-white'}`}
                            onClick={() => setGameMode('SHORT_GAME')}
                        >
                            Short Game
                        </button>
                    </div>

                    {/* Presets Grid */}
                    <div>
                        <div className="flex justify-between items-center mb-3 px-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">Rhythm Presets</span>
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{selectedPreset.ratio} Ratio</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {activePresets.map((preset) => {
                                const isSelected = selectedPreset.back === preset.back;
                                return (
                                    <button
                                        key={preset.back}
                                        onClick={() => { stopSequence(); setSelectedPreset(preset); }}
                                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border ${isSelected ? 'bg-white text-black border-white scale-105 shadow-xl' : 'bg-gray-900 text-gray-500 border-gray-800 hover:bg-gray-800'}`}
                                    >
                                        <div className="text-lg font-black leading-none mb-1">{preset.back}</div>
                                        <div className="w-4 h-0.5 bg-current opacity-30 mb-1"></div>
                                        <div className="text-sm font-bold leading-none">{preset.down}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            className="bg-gray-800 text-white py-4 rounded-2xl font-bold text-sm border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                            onClick={() => setToneMode(toneMode === 'TONES' ? 'VOICE' : 'TONES')}
                        >
                            {toneMode === 'TONES' ? '🔊 Tones' : '🗣️ Voice'}
                        </button>
                        <button 
                            className={`py-4 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? 'Stop' : 'Start'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
