
import React, { useState } from 'react';
import { Text, Button, Card, Badge } from './UIComponents';
import { ImportSource, StrokesGainedStats, SwingMetrics } from '../types';

const Icons = {
    Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
};

class GolfPhysicsEngine {
    data: SwingMetrics;
    hand: 'Right' | 'Left';
    issues: string[] = [];
    praise: string[] = [];

    constructor(data: SwingMetrics, hand: 'Right' | 'Left' = 'Right') {
        this.data = data;
        this.hand = hand;
    }

    analyzeFlightLaws() {
        const path = this.data.path || 0;
        const face = this.data.faceAngle || 0;
        const calcPath = this.hand === 'Right' ? path : -path;
        const calcFace = this.hand === 'Right' ? face : -face;
        const faceToPath = calcFace - calcPath;
        
        let startDir = Math.abs(calcFace) < 1.0 ? "Straight" : calcFace > 0 ? "Right" : "Left";
        let curveType = Math.abs(faceToPath) < 1.5 ? "Straight" : faceToPath > 0 ? (this.hand === 'Right' ? "Fade/Slice" : "Fade/Slice") : (this.hand === 'Right' ? "Draw/Hook" : "Draw/Hook");

        const diagnosisText = `Ball started ${startDir} and hit a ${curveType}.`;
        
        if (faceToPath > 2.0) {
            if (calcPath < -2.0) this.issues.push(`Slice Cause (Over-the-Top)`);
            else this.issues.push(`Push-Slice Cause: Face wide open`);
        }
        if (faceToPath < -2.0) {
            if (calcPath > 2.0) this.issues.push(`Hook Cause (Stuck)`);
        }
        
        return { diagnosisText };
    }

    analyzeEfficiency() {
        let smash = this.data.smashFactor || 0;
        const cs = this.data.clubSpeed || 0;
        if (smash === 0 && cs > 0) smash = (this.data.ballSpeed || 0) / cs;

        if (smash >= 1.48) this.praise.push(`Elite Ball Striking (${smash.toFixed(2)})`);
        else if (smash < 1.43 && cs > 90) this.issues.push(`Low Efficiency (${smash.toFixed(2)})`);
        
        return smash;
    }
}

type WizardStep = 'SELECT_SOURCE' | 'INPUT_DATA' | 'PROCESSING' | 'RECOMMENDATION' | 'MANUAL_SCORE';

interface DataUploadWizardProps {
    onClose: () => void;
    onComplete: (stats: any) => void;
    onAskCoach?: (msg: string) => void;
}

export const DataUploadWizard: React.FC<DataUploadWizardProps> = ({ onClose, onComplete, onAskCoach }) => {
    const [step, setStep] = useState<WizardStep>('SELECT_SOURCE');
    const [source, setSource] = useState<ImportSource | null>(null);
    const [dexterity, setDexterity] = useState<'Right' | 'Left'>('Right');
    
    const [sgStats, setSgStats] = useState<StrokesGainedStats>({
        offTee: 0, approach: 0, aroundGreen: 0, putting: 0, total: 0, handicap: 0
    });

    const [shotMetrics, setShotMetrics] = useState<SwingMetrics>({
        clubSpeed: 105, ballSpeed: 155, spinRate: 2800, 
        path: -2.5, faceAngle: 1.5, attackAngle: -1.2, smashFactor: 1.47
    });

    const [analysisResult, setAnalysisResult] = useState<{diagnosis: string, issues: string[], praise: string[]} | null>(null);

    const handleSourceSelect = (s: ImportSource) => {
        setSource(s);
        if (s === 'MANUAL') setStep('MANUAL_SCORE');
        else if (s === 'SHOT_DOCTOR') setStep('INPUT_DATA');
        else {
            setStep('PROCESSING');
            setTimeout(() => {
                setSgStats({ offTee: 0.5, approach: -1.2, aroundGreen: 0.2, putting: -0.8, total: -1.3, handicap: 5 });
                setStep('RECOMMENDATION');
            }, 1000);
        }
    };

    const handleAnalyzeShot = () => {
        const engine = new GolfPhysicsEngine(shotMetrics, dexterity);
        const { diagnosisText } = engine.analyzeFlightLaws();
        engine.analyzeEfficiency();
        
        setAnalysisResult({
            diagnosis: diagnosisText,
            issues: engine.issues,
            praise: engine.praise
        });
        setStep('RECOMMENDATION');
    };

    const handleAskCoach = () => {
        if (onAskCoach) {
            let context = '';
            if (analysisResult) {
                context = `I just analyzed a shot. Diagnosis: ${analysisResult.diagnosis}. Issues: ${analysisResult.issues.join(', ')}. Can you help me fix this?`;
            } else {
                context = `I just imported my strokes gained data: Off Tee ${sgStats.offTee}, Approach ${sgStats.approach}, Putting ${sgStats.putting}. What should I focus on?`;
            }
            onAskCoach(context);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card variant="elevated" className="w-full max-w-lg bg-white relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Icons.Close />
                </button>

                <div className="p-2">
                    {step === 'SELECT_SOURCE' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                <Icons.Upload />
                            </div>
                            <Text variant="h2" className="mb-2">Import Data</Text>
                            <Text className="text-gray-500 mb-8">Connect your devices or enter data manually.</Text>
                            
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button onClick={() => handleSourceSelect('ARCCOS')} className="p-4 border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center gap-2">
                                    <span className="text-2xl">📱</span>
                                    <span className="font-bold text-sm">Arccos</span>
                                </button>
                                <button onClick={() => handleSourceSelect('TRACKMAN')} className="p-4 border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center gap-2">
                                    <span className="text-2xl">📡</span>
                                    <span className="font-bold text-sm">TrackMan</span>
                                </button>
                                <button onClick={() => handleSourceSelect('MANUAL')} className="p-4 border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center gap-2">
                                    <span className="text-2xl">✏️</span>
                                    <span className="font-bold text-sm">Scorecard</span>
                                </button>
                                <button onClick={() => handleSourceSelect('SHOT_DOCTOR')} className="p-4 border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center gap-2">
                                    <span className="text-2xl">🩺</span>
                                    <span className="font-bold text-sm">Shot Doctor</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'INPUT_DATA' && (
                        <div>
                            <Text variant="h3" className="mb-4">Shot Metrics</Text>
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Club Speed (mph)</label>
                                        <input type="number" value={shotMetrics.clubSpeed} onChange={e => setShotMetrics({...shotMetrics, clubSpeed: Number(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Spin Rate (rpm)</label>
                                        <input type="number" value={shotMetrics.spinRate} onChange={e => setShotMetrics({...shotMetrics, spinRate: Number(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Path (Deg)</label>
                                        <input type="number" value={shotMetrics.path} onChange={e => setShotMetrics({...shotMetrics, path: Number(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Face Angle (Deg)</label>
                                        <input type="number" value={shotMetrics.faceAngle} onChange={e => setShotMetrics({...shotMetrics, faceAngle: Number(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold" />
                                    </div>
                                </div>
                                <div className="flex justify-center gap-4 text-sm font-bold">
                                    <button onClick={() => setDexterity('Right')} className={`px-4 py-2 rounded-lg ${dexterity === 'Right' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Righty</button>
                                    <button onClick={() => setDexterity('Left')} className={`px-4 py-2 rounded-lg ${dexterity === 'Left' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Lefty</button>
                                </div>
                            </div>
                            <Button fullWidth onClick={handleAnalyzeShot}>Analyze Shot</Button>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="text-center py-12">
                            <div className="animate-spin text-4xl mb-4">⚙️</div>
                            <Text variant="h3">Crunching Numbers...</Text>
                            <Text className="text-gray-500">Analyzing strokes gained data</Text>
                        </div>
                    )}

                    {step === 'RECOMMENDATION' && (
                        <div>
                            <Text variant="h3" className="mb-4">Analysis Result</Text>
                            
                            {analysisResult ? (
                                <div className="space-y-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                                        <Text variant="h4" className="mb-2">Diagnosis</Text>
                                        <p className="text-sm font-medium text-gray-800">{analysisResult.diagnosis}</p>
                                    </div>
                                    {analysisResult.issues.length > 0 && (
                                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                                            <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm uppercase"><span>⚠️</span> Issues</div>
                                            <ul className="space-y-2">
                                                {analysisResult.issues.map((issue, i) => (
                                                    <li key={i} className="text-sm text-red-800 leading-snug">• {issue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className={`p-4 rounded-xl border ${sgStats.offTee < -0.5 ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                                        <div className="text-xs font-bold uppercase mb-1">Off Tee</div>
                                        <div className="text-2xl font-black">{sgStats.offTee > 0 ? '+' : ''}{sgStats.offTee}</div>
                                    </div>
                                    <div className={`p-4 rounded-xl border ${sgStats.approach < -0.5 ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                                        <div className="text-xs font-bold uppercase mb-1">Approach</div>
                                        <div className="text-2xl font-black">{sgStats.approach > 0 ? '+' : ''}{sgStats.approach}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button fullWidth variant="outline" onClick={() => setStep('SELECT_SOURCE')}>Back</Button>
                                {onAskCoach && (
                                    <Button fullWidth onClick={handleAskCoach}>Ask Coach</Button>
                                )}
                                <Button fullWidth onClick={() => { onComplete(sgStats); onClose(); }}>Save</Button>
                            </div>
                        </div>
                    )}

                    {step === 'MANUAL_SCORE' && (
                        <div className="text-center py-12">
                            <Text>Manual Scorecard coming soon...</Text>
                            <Button className="mt-4" onClick={() => setStep('SELECT_SOURCE')}>Back</Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
