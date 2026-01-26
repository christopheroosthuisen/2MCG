import React, { useState, useEffect } from 'react';
import { Text, Button, Card, Input, Badge, ProgressBar } from './UIComponents';
import { ImportSource, StrokesGainedStats, RecommendationEngine, Drill, Course } from '../types';
import { COLORS, MOCK_DRILLS, MOCK_COURSES } from '../constants';

const Icons = {
    Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Activity: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Scan: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg>,
    ArrowRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
    Refresh: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
};

type WizardStep = 'SELECT_SOURCE' | 'INPUT_DATA' | 'PROCESSING' | 'RECOMMENDATION';

interface DataUploadWizardProps {
    onClose: () => void;
    onComplete: (stats: StrokesGainedStats) => void;
}

export const DataUploadWizard: React.FC<DataUploadWizardProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState<WizardStep>('SELECT_SOURCE');
    const [source, setSource] = useState<ImportSource | null>(null);
    const [stats, setStats] = useState<StrokesGainedStats>({
        offTee: 0,
        approach: 0,
        aroundGreen: 0,
        putting: 0,
        total: 0,
        handicap: 5.4 // Default mock
    });
    const [recommendation, setRecommendation] = useState<RecommendationEngine | null>(null);

    // --- LOGIC ---

    const generateRecommendations = (data: StrokesGainedStats): RecommendationEngine => {
        // Simple logic to find the weakest link
        const areas = [
            { id: 'DRIVING', val: data.offTee },
            { id: 'IRON_PLAY', val: data.approach },
            { id: 'SHORT_GAME', val: data.aroundGreen },
            { id: 'PUTTING', val: data.putting }
        ];

        // Sort by lowest value (worst performance)
        areas.sort((a, b) => a.val - b.val);
        const worstArea = areas[0];

        let rec: RecommendationEngine = {
            focusArea: worstArea.id as any,
            recommendedDrills: [],
            reasoning: ''
        };

        if (worstArea.id === 'PUTTING') {
            rec.recommendedCourseId = 'c7'; // Putting Mastery
            rec.recommendedDrills = ['3', 'd-putt-2'];
            rec.reasoning = `You are losing ${Math.abs(worstArea.val).toFixed(2)} strokes per round on the greens. This is your biggest opportunity for improvement.`;
        } else if (worstArea.id === 'SHORT_GAME') {
             rec.recommendedCourseId = 'c5'; // Chipping Artistry
             rec.recommendedDrills = ['4', 'd-chip-2', 'd-bunker-1'];
             rec.reasoning = `Your short game is costing you ${Math.abs(worstArea.val).toFixed(2)} strokes. Tightening up inside 50 yards will save par more often.`;
        } else if (worstArea.id === 'IRON_PLAY') {
             rec.recommendedCourseId = 'c3'; // Iron Play
             rec.recommendedDrills = ['1']; // Takeaway
             rec.reasoning = `Approach play is the key separator. You are losing ${Math.abs(worstArea.val).toFixed(2)} strokes here. Let's work on contact and distance control.`;
        } else {
             rec.recommendedCourseId = 'c1'; // Driving
             rec.recommendedDrills = ['1'];
             rec.reasoning = `Driving is setting you back ${Math.abs(worstArea.val).toFixed(2)} strokes. Finding the fairway and maximizing distance is our priority.`;
        }

        return rec;
    };

    const handleSubmitData = () => {
        setStep('PROCESSING');
        // Simulate processing delay
        setTimeout(() => {
            const rec = generateRecommendations(stats);
            setRecommendation(rec);
            setStep('RECOMMENDATION');
        }, 1500);
    };

    // --- SUB-COMPONENTS ---

    const SourceButton: React.FC<{ 
        id: ImportSource, 
        label: string, 
        icon?: React.ReactNode,
        isApp?: boolean
    }> = ({ id, label, icon, isApp }) => (
        <button
            onClick={() => {
                setSource(id);
                setStep('INPUT_DATA');
            }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all shadow-sm group h-32 w-full"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl shadow-sm ${isApp ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                {icon || label[0]}
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-orange-700">{label}</span>
        </button>
    );

    const StatInput: React.FC<{
        label: string;
        value: number;
        onChange: (v: number) => void;
    }> = ({ label, value, onChange }) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-700 text-sm">{label}</span>
            <div className="flex items-center gap-2">
                 <button 
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    onClick={() => onChange(Number((value - 0.1).toFixed(1)))}
                 >-</button>
                 <input 
                    type="number" 
                    step="0.1"
                    className="w-16 text-center font-mono font-bold bg-transparent outline-none"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                 />
                 <button 
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    onClick={() => onChange(Number((value + 0.1).toFixed(1)))}
                 >+</button>
            </div>
        </div>
    );

    // --- RENDER ---

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white sm:rounded-none animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-gray-900">
                    <Icons.Close />
                </button>
                <div className="text-center">
                    <Text variant="h4" className="text-base font-bold">Import Data</Text>
                    <div className="flex gap-1 justify-center mt-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 rounded-full w-4 ${
                                (step === 'SELECT_SOURCE' && i === 1) || 
                                (step === 'INPUT_DATA' && i === 2) || 
                                ((step === 'PROCESSING' || step === 'RECOMMENDATION') && i === 3)
                                ? 'bg-orange-500' 
                                : 'bg-gray-200'
                            }`} />
                        ))}
                    </div>
                </div>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
                
                {/* STEP 1: SELECT SOURCE */}
                {step === 'SELECT_SOURCE' && (
                    <div className="space-y-6 max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <Text variant="h2" className="mb-2">Where is your data?</Text>
                            <Text color="gray">Connect a device or import stats from your favorite tracking app.</Text>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <SourceButton id="ARCCOS" label="Arccos" icon={<img src="https://images.unsplash.com/photo-1629210087796-749e7b243452?w=50&h=50&fit=crop" className="w-full h-full object-cover rounded-lg opacity-80"/>} isApp />
                            <SourceButton id="TANGENT" label="Tangent" icon={<span className="font-serif italic text-white text-3xl">t</span>} isApp />
                            <SourceButton id="TRACKMAN" label="TrackMan" icon={<div className="w-6 h-6 bg-orange-500 rounded-full"/>} />
                            <SourceButton id="GCQUAD" label="GCQuad" icon={<div className="w-6 h-6 bg-gray-400 rounded-sm"/>} />
                            <SourceButton id="MANUAL" label="Manual Entry" icon={<Icons.Activity />} />
                        </div>
                    </div>
                )}

                {/* STEP 2: INPUT DATA */}
                {step === 'INPUT_DATA' && (
                    <div className="space-y-6 max-w-md mx-auto">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                {source && source[0]}
                            </div>
                            <div>
                                <Text variant="h3" className="text-lg">Input {source === 'MANUAL' ? 'Stats' : `${source} Data`}</Text>
                                <Text variant="caption">Enter your Strokes Gained (SG) values.</Text>
                            </div>
                        </div>

                        {/* Scanner Option (Simulated) */}
                        <div className="bg-gray-900 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-orange-400">
                                    <Icons.Scan />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Scan Screenshot</div>
                                    <div className="text-xs text-gray-400">Upload an image from your app</div>
                                </div>
                            </div>
                            <Badge variant="neutral" className="bg-white/10 text-white border-none">Auto-fill</Badge>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                             <div className="h-px bg-gray-200 flex-1"></div>
                             <span className="text-xs text-gray-400 font-bold uppercase">Or enter manually</span>
                             <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <div className="space-y-3">
                            <StatInput label="SG: Off the Tee" value={stats.offTee} onChange={(v) => setStats({...stats, offTee: v})} />
                            <StatInput label="SG: Approach" value={stats.approach} onChange={(v) => setStats({...stats, approach: v})} />
                            <StatInput label="SG: Around Green" value={stats.aroundGreen} onChange={(v) => setStats({...stats, aroundGreen: v})} />
                            <StatInput label="SG: Putting" value={stats.putting} onChange={(v) => setStats({...stats, putting: v})} />
                        </div>

                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-sm text-blue-800">
                            <strong>Note:</strong> Negative values indicate strokes lost against scratch.
                        </div>
                    </div>
                )}

                {/* STEP 3: PROCESSING */}
                {step === 'PROCESSING' && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                        <Text variant="h2" className="mb-2">Analyzing Data</Text>
                        <Text color="gray">The AI is identifying your biggest opportunities for improvement...</Text>
                    </div>
                )}

                 {/* STEP 4: RECOMMENDATION */}
                 {step === 'RECOMMENDATION' && recommendation && (
                    <div className="space-y-6 max-w-md mx-auto pb-20">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icons.Check />
                            </div>
                            <Text variant="h2" className="mb-2">Analysis Complete</Text>
                            <Text color="gray" className="text-sm">We've generated a custom plan based on your stats.</Text>
                        </div>

                        <Card variant="filled" className="bg-orange-50 border-orange-200">
                            <Text variant="caption" className="font-bold text-orange-800 uppercase tracking-widest mb-2">Primary Focus Area</Text>
                            <div className="flex items-center justify-between mb-2">
                                <Text variant="h2" className="text-gray-900">{recommendation.focusArea.replace('_', ' ')}</Text>
                                <Badge variant="error" className="bg-red-100 text-red-700">Needs Work</Badge>
                            </div>
                            <Text className="text-sm text-gray-700 leading-relaxed mb-4">
                                {recommendation.reasoning}
                            </Text>
                            <div className="flex items-center gap-2 text-xs font-bold text-orange-700">
                                <Icons.Activity />
                                Expected Improvement: 2.1 Strokes
                            </div>
                        </Card>

                        <div className="space-y-3">
                            <Text variant="h4" className="text-sm uppercase text-gray-400 font-bold tracking-widest">Recommended Plan</Text>
                            
                            {/* Course Recommendation */}
                            {recommendation.recommendedCourseId && (
                                <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 cursor-pointer hover:border-orange-500 transition-colors shadow-sm">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        {(() => {
                                            const c = MOCK_COURSES.find(co => co.id === recommendation.recommendedCourseId);
                                            return c ? <img src={c.thumbnailUrl} className="w-full h-full object-cover" /> : <div className="bg-gray-800 w-full h-full"/>
                                        })()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <Badge variant="info" className="text-[10px] py-0">Course</Badge>
                                        </div>
                                        <Text variant="body" className="font-bold text-sm leading-tight mb-1">
                                            {MOCK_COURSES.find(co => co.id === recommendation.recommendedCourseId)?.title}
                                        </Text>
                                        <Text variant="caption" className="text-xs">
                                            Master the fundamentals of {recommendation.focusArea.toLowerCase().replace('_', ' ')}.
                                        </Text>
                                    </div>
                                </div>
                            )}

                             {/* Drill Recommendation */}
                             {recommendation.recommendedDrills.slice(0, 1).map(drillId => {
                                 const drill = MOCK_DRILLS.find(d => d.id === drillId);
                                 if (!drill) return null;
                                 return (
                                    <div key={drillId} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 cursor-pointer hover:border-orange-500 transition-colors shadow-sm">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            <img src={drill.thumbnailUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <div className="text-white transform scale-75"><Icons.Activity /></div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <Badge variant="warning" className="text-[10px] py-0">Drill</Badge>
                                                <span className="text-[10px] text-gray-400">{drill.durationMinutes} min</span>
                                            </div>
                                            <Text variant="body" className="font-bold text-sm leading-tight mb-1">
                                                {drill.title}
                                            </Text>
                                            <Text variant="caption" className="text-xs line-clamp-1">
                                                {drill.description}
                                            </Text>
                                        </div>
                                    </div>
                                 );
                             })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 bg-white safe-area-bottom">
                {step === 'SELECT_SOURCE' && (
                    <Button fullWidth variant="ghost" onClick={onClose}>Cancel</Button>
                )}
                {step === 'INPUT_DATA' && (
                    <Button fullWidth onClick={handleSubmitData} icon={<Icons.ArrowRight />}>Analyze Data</Button>
                )}
                {step === 'RECOMMENDATION' && (
                    <Button 
                        fullWidth 
                        onClick={() => {
                            onComplete(stats);
                            onClose();
                        }} 
                        variant="primary"
                    >
                        Save & Start Practice
                    </Button>
                )}
            </div>
        </div>
    );
};