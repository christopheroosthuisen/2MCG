
import React, { useState, useEffect, useRef } from 'react';
import { PracticeGoal, PracticeSession, Drill, SwingAnalysis, PracticeShot } from '../types';
import { COLORS, MOCK_SESSIONS } from '../constants';
import { Text, Card, Badge, ProgressBar, Button, Input, Tabs, Modal } from './UIComponents';
import { db } from '../services/dataService';
import { PuttingLabView } from './PuttingLabView';

const Icons = {
    Plus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    TrendUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    MapPin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Flag: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>,
    Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    Stop: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12"></rect></svg>,
    Minus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Grid: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Target: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    Mic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Share: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
};

export const PracticeSystem: React.FC<{ 
    onOpenTempoTool: () => void; 
    onOpenBagOfShots: () => void; 
    onAskCoach?: (msg: string) => void;
    onToggleLive?: () => void;
    isLiveActive?: boolean;
    initialDrill?: Drill; // Optional drill to start with
    onExit?: () => void;
}> = ({ onOpenTempoTool, onOpenBagOfShots, onAskCoach, onToggleLive, isLiveActive, initialDrill, onExit }) => {
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [isSessionActive, setIsSessionActive] = useState(!!initialDrill);
    const [showPuttingLab, setShowPuttingLab] = useState(false);

    if (showPuttingLab) {
        return <PuttingLabView onBack={() => setShowPuttingLab(false)} />;
    }

    if (initialDrill && isSessionActive) {
        return <PracticeTimer drill={initialDrill} onClose={() => { setIsSessionActive(false); if(onExit) onExit(); }} onToggleLive={onToggleLive} isLiveActive={isLiveActive} />;
    }

    return (
        <div className="space-y-6 pb-32 animate-in fade-in duration-500 relative">
            <div className="px-4 pt-6 bg-[#F5F5F7]/95 backdrop-blur-md sticky top-0 z-10 pb-2">
                <Text variant="caption" className="uppercase font-bold tracking-widest text-orange-500 mb-1">The Lab</Text>
                <div className="flex justify-between items-end mb-4">
                    <Text variant="h1" className="mb-0">Practice Hub</Text>
                    <Button size="sm" variant="primary" icon={isSessionActive ? <Icons.TrendUp /> : <Icons.Plus />} onClick={() => setIsSessionActive(true)}>
                        {isSessionActive ? 'Active Session' : 'Start Session'}
                    </Button>
                </div>
                <Tabs 
                    tabs={['DASHBOARD', 'PERFORMANCE', 'GOALS', 'HISTORY', 'SWINGS']} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />
            </div>

            <div className="px-4">
                {activeTab === 'DASHBOARD' && <PracticeDashboard onOpenTempoTool={onOpenTempoTool} onOpenBagOfShots={onOpenBagOfShots} onOpenPuttingLab={() => setShowPuttingLab(true)} onAskCoach={onAskCoach} />}
                {activeTab === 'PERFORMANCE' && <PerformanceDashboard />}
                {activeTab === 'GOALS' && <GoalsView onAskCoach={onAskCoach} />}
                {activeTab === 'HISTORY' && <HistoryView />}
                {activeTab === 'SWINGS' && <SwingLibraryView />}
            </div>

            {isSessionActive && (
                <div className="fixed inset-0 z-50 animate-in slide-in-from-bottom duration-300">
                    <PracticeTimer onClose={() => setIsSessionActive(false)} onToggleLive={onToggleLive} isLiveActive={isLiveActive} />
                </div>
            )}
        </div>
    );
};

const PracticeTimer: React.FC<{ drill?: Drill; onClose: () => void; onToggleLive?: () => void; isLiveActive?: boolean }> = ({ drill, onClose, onToggleLive, isLiveActive }) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [selectedClub, setSelectedClub] = useState('Driver');
    const [sessionShots, setSessionShots] = useState<PracticeShot[]>([]);
    
    // Derived Stats
    const totalShots = sessionShots.length;
    const pureCount = sessionShots.filter(s => s.result === 'PURE').length;
    const consistency = totalShots > 0 ? Math.round((pureCount / totalShots) * 100) : 0;

    const clubs = ['Driver', '3 Wood', 'Hybrid', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron', 'PW', 'SW', 'LW'];

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleLogShot = (result: PracticeShot['result']) => {
        const newShot: PracticeShot = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            club: selectedClub,
            result: result
        };
        setSessionShots(prev => [newShot, ...prev]);
    };

    const handleEndSession = () => {
        if (totalShots === 0) {
            onClose();
            return;
        }
        
        const newSession: PracticeSession = {
            id: crypto.randomUUID(),
            date: new Date(),
            location: 'The Lab',
            shotsHit: totalShots,
            club: selectedClub as any, // Simplified for demo
            avgMetrics: {},
            bestMetrics: {},
            consistencyScore: consistency, 
            notes: `Duration: ${formatTime(seconds)}`,
            shots: sessionShots,
            drillId: drill?.id
        };
        db.addSession(newSession);
        onClose();
    };

    const ShotButton: React.FC<{ result: PracticeShot['result']; label: string; color: string }> = ({ result, label, color }) => (
        <button 
            onClick={() => handleLogShot(result)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${color} hover:brightness-95`}
        >
            <span className="text-xl font-bold">{label}</span>
        </button>
    );

    return (
        <div className="h-full bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-800 bg-[#111827] safe-area-top">
                <div>
                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">{drill ? drill.title.toUpperCase() : 'ACTIVE SESSION'}</div>
                    <div className="font-mono text-3xl font-black">{formatTime(seconds)}</div>
                </div>
                <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={handleEndSession}>Finish</Button>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">{drill ? 'Progress' : 'Shots Hit'}</div>
                        <div className="text-3xl font-black">{totalShots}{drill?.goalCount ? <span className="text-lg text-gray-500 font-medium">/{drill.goalCount}</span> : ''}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Consistency</div>
                        <div className={`text-3xl font-black ${consistency >= 80 ? 'text-green-500' : consistency >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{consistency}%</div>
                    </div>
                </div>

                {/* Club Selector */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Select Club</span>
                        <span className="text-orange-500 font-bold text-sm">{selectedClub}</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {clubs.map(c => (
                            <button
                                key={c}
                                onClick={() => setSelectedClub(c)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${selectedClub === c ? 'bg-white text-gray-900 border-white' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shot Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-3">
                        <ShotButton result="PURE" label="🔥 PURE" color="bg-green-600 border-green-500 text-white" />
                    </div>
                    <ShotButton result="LEFT" label="← Left" color="bg-gray-800 border-gray-700 text-gray-300" />
                    <ShotButton result="SHORT" label="↓ Short" color="bg-gray-800 border-gray-700 text-gray-300" />
                    <ShotButton result="RIGHT" label="Right →" color="bg-gray-800 border-gray-700 text-gray-300" />
                    <ShotButton result="THIN" label="Thin" color="bg-gray-800 border-gray-700 text-gray-400 text-xs" />
                    <ShotButton result="LONG" label="↑ Long" color="bg-gray-800 border-gray-700 text-gray-300" />
                    <ShotButton result="FAT" label="Fat" color="bg-gray-800 border-gray-700 text-gray-400 text-xs" />
                </div>

                {/* Coach Integration */}
                {onToggleLive && (
                    <button 
                        onClick={onToggleLive}
                        className={`w-full p-4 rounded-2xl flex items-center justify-center gap-3 transition-all border ${isLiveActive ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 'bg-blue-600 border-blue-500 text-white'}`}
                    >
                        <Icons.Mic />
                        <span className="font-bold">{isLiveActive ? 'Live Coach Active (Tap to End)' : 'Connect Virtual Coach'}</span>
                    </button>
                )}

                {/* History List */}
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase mb-3 border-b border-gray-800 pb-2">Session History</div>
                    <div className="space-y-2">
                        {sessionShots.map((shot, i) => (
                            <div key={shot.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-xl border border-gray-700 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 font-mono w-6">#{totalShots - i}</span>
                                    <span className="font-bold text-sm">{shot.club}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        shot.result === 'PURE' ? 'bg-green-500/20 text-green-400' : 
                                        ['LEFT', 'RIGHT'].includes(shot.result) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {shot.result}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{shot.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                </div>
                            </div>
                        ))}
                        {sessionShots.length === 0 && (
                            <div className="text-center text-gray-600 text-xs py-4">No shots logged yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PerformanceDashboard: React.FC = () => {
    return (
        <div className="bg-[#111827] text-white p-4 rounded-3xl -mx-4 md:mx-0 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <Text variant="h2" color="white" className="mb-0">PERFORMANCE</Text>
                <div className="flex gap-4 text-gray-400">
                    <Icons.Settings />
                    <span className="text-xs font-bold uppercase tracking-wider">SHARE</span>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold uppercase tracking-wider">Practice Discipline</span>
                    <span className="text-2xl font-bold text-blue-400">72%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4 mb-1">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                    <span>Slacking</span>
                    <span>Grinding</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                    <span>Scores Breakdown</span>
                    <span>Progress</span>
                </div>

                {[
                    { label: 'OFF THE TEE', value: 45, color: 'bg-purple-500' },
                    { label: 'APPROACH', value: 60, color: 'bg-blue-500' },
                    { label: 'SHORT GAME', value: 25, color: 'bg-green-500' },
                    { label: 'PUTTING', value: 80, color: 'bg-yellow-500' },
                    { label: 'RECOVERY', value: 10, color: 'bg-red-500' },
                ].map((stat) => (
                    <div key={stat.label}>
                        <div className="flex justify-between mb-2">
                            <span className="font-bold">{stat.label}</span>
                            <span className="font-mono">{stat.value}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                            <div className={`${stat.color} h-3 rounded-full`} style={{ width: `${stat.value}%` }}></div>
                        </div>
                        <div className="mt-1 text-[10px] text-gray-600 font-bold uppercase tracking-wider">Discipline</div>
                    </div>
                ))}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-800">
                <Text variant="caption" className="uppercase font-bold text-gray-500 mb-4">Insights</Text>
                <div className="space-y-4">
                    <div>
                        <div className="text-2xl font-bold">21</div>
                        <div className="text-xs font-bold text-gray-500 uppercase">Drills Completed</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">1</div>
                        <div className="text-xs font-bold text-gray-500 uppercase">Day of Practice</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">Less than 1</div>
                        <div className="text-xs font-bold text-gray-500 uppercase">Hour of Practice</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const PracticeDashboard: React.FC<{ onOpenTempoTool: () => void; onOpenBagOfShots: () => void; onOpenPuttingLab: () => void; onAskCoach?: (msg: string) => void }> = ({ onOpenTempoTool, onOpenBagOfShots, onOpenPuttingLab, onAskCoach }) => {
    const [drillFilter, setDrillFilter] = useState<'ALL' | 'PUTTING' | 'CHIPPING' | 'BUNKER'>('ALL');
    const [editGoalOpen, setEditGoalOpen] = useState(false);
    const goals = db.getGoals();
    const primaryGoal = goals[0];
    const drills = db.getDrills();
    const sessions = db.getSessions();

    const [editingGoalValue, setEditingGoalValue] = useState(primaryGoal?.targetValue.toString() || '0');

    const filteredDrills = drills.filter(d => {
        if (drillFilter === 'ALL') return d.category === 'PUTTING' || d.category === 'CHIPPING' || d.category === 'BUNKER' || d.category === 'SHORT_GAME';
        if (drillFilter === 'CHIPPING') return d.category === 'CHIPPING' || d.category === 'SHORT_GAME';
        return d.category === drillFilter;
    });

    const getDifficultyLevel = (diff: string) => diff === 'ADVANCED' ? 3 : diff === 'INTERMEDIATE' ? 2 : 1;

    const handleSaveGoal = () => {
        if (primaryGoal) {
            db.updateGoal(primaryGoal.id, { targetValue: Number(editingGoalValue) });
            setEditGoalOpen(false);
        }
    };

    return (
        <div className="space-y-8">
            {primaryGoal && (
                <section>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <Text variant="h3">Primary Focus</Text>
                        <Text variant="caption" className="text-orange-600 font-bold cursor-pointer" onClick={() => setEditGoalOpen(true)}>Edit Goal</Text>
                    </div>
                    <Card variant="filled" className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden shadow-lg shadow-gray-900/20">
                        <div className="absolute right-0 top-0 p-8 opacity-5">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Text variant="caption" className="text-gray-400 uppercase font-bold tracking-wider mb-1">Current Target</Text>
                                    <Text variant="h2" color="white">{primaryGoal.title}</Text>
                                </div>
                                <Badge variant="success">On Track</Badge>
                            </div>
                            <div className="flex items-end gap-2 mb-2">
                                <Text variant="metric" color="white" className="text-5xl">{primaryGoal.currentValue}</Text>
                                <Text variant="h4" className="text-gray-400 mb-2">/ {primaryGoal.targetValue} {primaryGoal.unit}</Text>
                            </div>
                            <ProgressBar progress={primaryGoal.progress} color={COLORS.primary} className="bg-gray-700 h-2 mb-2" />
                            <Text variant="caption" className="text-gray-400 text-xs">+2 {primaryGoal.unit} this week • {30} days remaining</Text>
                        </div>
                    </Card>

                    <Modal isOpen={editGoalOpen} onClose={() => setEditGoalOpen(false)} title="Update Goal" footer={
                        <div className="flex gap-2">
                            <Button fullWidth variant="ghost" onClick={() => setEditGoalOpen(false)}>Cancel</Button>
                            <Button fullWidth onClick={handleSaveGoal}>Save Changes</Button>
                        </div>
                    }>
                        <div className="space-y-4">
                            <Input label="Goal Title" defaultValue={primaryGoal.title} />
                            <Input label={`Target Value (${primaryGoal.unit})`} type="number" value={editingGoalValue} onChange={(e) => setEditingGoalValue(e.target.value)} />
                        </div>
                    </Modal>
                </section>
            )}
            
            <section>
                 <Text variant="h3" className="mb-4 px-1">Tools</Text>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="outlined" className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 group border-orange-100 bg-orange-50/30" onClick={onOpenTempoTool}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Icons.Activity /></div>
                            <div>
                                <Text variant="h4" className="text-base font-bold">Tempo Trainer</Text>
                                <Text variant="caption" className="text-xs">Perfect your swing rhythm</Text>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm group-hover:text-orange-500"><Icons.ChevronRight /></div>
                    </Card>
                    <Card variant="outlined" className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 group border-green-100 bg-green-50/30" onClick={onOpenPuttingLab}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Icons.Target /></div>
                            <div>
                                <Text variant="h4" className="text-base font-bold">Putting Lab</Text>
                                <Text variant="caption" className="text-xs">Green Reading & Speed</Text>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm group-hover:text-green-500"><Icons.ChevronRight /></div>
                    </Card>
                    <Card variant="outlined" className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 group border-gray-200" onClick={onOpenBagOfShots}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform"><Icons.Grid /></div>
                            <div>
                                <Text variant="h4" className="text-base font-bold">Bag of Shots</Text>
                                <Text variant="caption" className="text-xs">Your mastery library</Text>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm group-hover:text-gray-900"><Icons.ChevronRight /></div>
                    </Card>
                 </div>
            </section>

             <section className="bg-green-50/50 p-4 -mx-4 rounded-3xl border border-green-50">
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center"><Icons.Flag /></div>
                        <div>
                            <Text variant="h3" className="leading-none text-green-900">Short Game Lab</Text>
                            <Text variant="caption" className="text-xs text-green-700">Scoring zone drills</Text>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar px-1">
                    {['ALL', 'PUTTING', 'CHIPPING', 'BUNKER'].map(filter => (
                        <button key={filter} onClick={() => setDrillFilter(filter as any)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${drillFilter === filter ? 'bg-green-700 text-white border-green-700 shadow-md' : 'bg-white text-green-800 border-green-200 hover:bg-green-50'}`}>{filter.charAt(0) + filter.slice(1).toLowerCase()}</button>
                    ))}
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {filteredDrills.length > 0 ? filteredDrills.map(drill => (
                        <div key={drill.id} className="min-w-[220px] max-w-[220px] bg-white rounded-2xl p-3 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                            <div className="h-28 rounded-xl bg-gray-200 mb-3 overflow-hidden relative">
                                <img src={drill.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><Icons.Clock /> {drill.durationMinutes}m</div>
                            </div>
                            <div className="flex items-center justify-between mb-1">
                                <Badge variant={drill.category === 'PUTTING' ? 'info' : (drill.category === 'BUNKER' ? 'warning' : 'success')} className="text-[10px] py-0.5">{drill.category}</Badge>
                                <div className="flex gap-0.5" title={`Difficulty: ${drill.difficulty}`}>{[1,2,3].map(i => (<div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= getDifficultyLevel(drill.difficulty) ? 'bg-gray-800' : 'bg-gray-200'}`} />))}</div>
                            </div>
                            <Text variant="h4" className="text-sm font-bold mb-1 truncate">{drill.title}</Text>
                            <Text variant="caption" className="text-xs line-clamp-2 leading-relaxed">{drill.description}</Text>
                        </div>
                    )) : <div className="w-full text-center py-8 text-gray-400 text-sm italic">No drills found.</div>}
                </div>
            </section>

            <section>
                <Text variant="h3" className="mb-4 px-1">Recent Sessions</Text>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.slice(0, 3).map((session) => (
                        <Card key={session.id} className="p-4 cursor-pointer hover:bg-gray-50 border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="neutral" className="text-[10px]">{session.club}</Badge>
                                        <Text variant="caption" className="text-xs flex items-center gap-1"><Icons.Calendar /> {session.date.toLocaleDateString()}</Text>
                                    </div>
                                    <Text variant="caption" className="text-xs flex items-center gap-1 text-gray-400"><Icons.MapPin /> {session.location} • {session.shotsHit} shots</Text>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-gray-900">{session.consistencyScore}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Consistency</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-3 bg-gray-50 p-2 rounded-xl">
                                <div className="text-center"><div className="text-[10px] text-gray-400 font-bold">SPD</div><div className="font-bold text-gray-800">{session.avgMetrics.clubSpeed || '-'}</div></div>
                                <div className="text-center"><div className="text-[10px] text-gray-400 font-bold">CRY</div><div className="font-bold text-gray-800">{session.avgMetrics.carryDistance || '-'}</div></div>
                                <div className="text-center"><div className="text-[10px] text-gray-400 font-bold">SPN</div><div className="font-bold text-gray-800">{session.avgMetrics.spinRate || '-'}</div></div>
                                <div className="text-center border-l border-gray-200"><div className="text-[10px] text-green-600 font-bold">MAX</div><div className="font-bold text-green-700">{session.bestMetrics.clubSpeed || '-'}</div></div>
                            </div>
                            {session.notes && <Text variant="caption" className="text-xs italic bg-yellow-50 p-2 rounded text-yellow-800 border border-yellow-100">"{session.notes}"</Text>}
                        </Card>
                    ))}
                    {sessions.length === 0 && <div className="text-center py-8 text-gray-400 text-sm col-span-full">No practice sessions logged yet.</div>}
                </div>
            </section>
        </div>
    );
};

const GoalsView: React.FC<{ onAskCoach?: (msg: string) => void }> = ({ onAskCoach }) => {
    const goals = db.getGoals();
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <div className="text-2xl">🤖</div>
                <div className="flex-1">
                    <Text variant="h4" className="text-blue-900 text-sm font-bold">AI Coach Recommendation</Text>
                    <Text variant="caption" className="text-blue-800 text-xs mt-1">Based on your last 3 driver sessions, your spin rate is too high (2900rpm). Set a goal to lower it to 2400rpm to gain ~12 yards.</Text>
                    <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">Set Spin Goal</Button>
                        {onAskCoach && (
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-blue-600 hover:bg-blue-100" 
                                onClick={() => onAskCoach("Why is my driver spin rate 2900rpm too high, and how do I lower it?")}
                            >
                                Ask Coach Why
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                    <Card key={goal.id} className="p-5 border-l-4 border-l-orange-500">
                        <div className="flex justify-between items-start mb-4">
                            <div><Text variant="h3">{goal.title}</Text><Text variant="caption" className="text-xs">Deadline: {goal.deadline?.toLocaleDateString()}</Text></div>
                            <div className="text-right"><Text variant="metric" color={COLORS.primary}>{goal.currentValue} <span className="text-lg text-gray-400 font-normal">{goal.unit}</span></Text><Text variant="caption" className="text-xs">Target: {goal.targetValue} {goal.unit}</Text></div>
                        </div>
                        <ProgressBar progress={goal.progress} />
                        <div className="flex justify-between mt-2 text-xs font-bold text-gray-400"><span>Start</span><span>{goal.progress}% Achieved</span><span>Goal</span></div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const HistoryView: React.FC = () => {
    const sessions = db.getSessions();
    const drills = db.getDrills();

    // Helper to get shot details if detailed shots exist
    const getShotData = (session: PracticeSession) => {
        if (!session.shots || session.shots.length === 0) return null;
        return session.shots;
    };

    return (
        <div className="space-y-4">
             <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {['All', 'Driver', 'Irons', 'Wedges'].map((cat, i) => (<button key={cat} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${i === 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>))}
            </div>
             <div className="grid grid-cols-1 gap-4">
                 {sessions.map((session) => {
                    const drill = session.drillId ? drills.find(d => d.id === session.drillId) : null;
                    const shotData = getShotData(session);

                    return (
                        <div key={session.id} className="border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
                            {/* Summary Header */}
                            <div className="flex gap-4 items-center p-3 cursor-pointer">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0"><span className="text-xs font-bold text-gray-500">{session.date.toLocaleDateString(undefined, {month:'short'})}</span><span className="text-lg font-bold text-gray-900">{session.date.getDate()}</span></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <Text variant="body" className="font-bold">{drill ? drill.title : `${session.club} Session`}</Text>
                                        <Text variant="caption" className="font-mono">{session.shotsHit} shots</Text>
                                    </div>
                                    <div className="flex gap-3 mt-1">
                                        {session.avgMetrics.clubSpeed && <span className="text-xs bg-gray-50 px-1.5 py-0.5 rounded text-gray-600">Avg Speed: <b>{session.avgMetrics.clubSpeed}</b></span>}
                                        {session.bestMetrics.clubSpeed && <span className="text-xs bg-gray-50 px-1.5 py-0.5 rounded text-gray-600">Best: <b>{session.bestMetrics.clubSpeed}</b></span>}
                                    </div>
                                </div>
                                <Icons.ChevronRight />
                            </div>

                            {/* Detailed Shot List (Table View) - If shots exist */}
                            {shotData && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-2 overflow-x-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead>
                                            <tr className="text-gray-400 font-bold uppercase">
                                                <th className="px-2 py-1">#</th>
                                                <th className="px-2 py-1">Result</th>
                                                <th className="px-2 py-1 text-center">Flexion</th>
                                                <th className="px-2 py-1 text-center">Ulnar</th>
                                                <th className="px-2 py-1 text-center">Rot</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shotData.map((shot, idx) => (
                                                <tr key={shot.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-100 transition-colors">
                                                    <td className="px-2 py-2 font-mono text-gray-500">{idx + 1}</td>
                                                    <td className="px-2 py-2">
                                                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                                                            shot.result === 'PURE' ? 'bg-green-100 text-green-700' :
                                                            shot.result === 'THIN' || shot.result === 'FAT' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>{shot.result}</span>
                                                    </td>
                                                    <td className="px-2 py-2 text-center font-bold">{shot.metrics?.wristFlexion || '-'}</td>
                                                    <td className="px-2 py-2 text-center font-bold">{shot.metrics?.ulnarRadial || '-'}</td>
                                                    <td className="px-2 py-2 text-center font-bold">{shot.metrics?.hipRotation || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                 })}
             </div>
        </div>
    );
};

const SwingLibraryView: React.FC = () => {
    const swings = db.getSwings();
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"><Icons.Plus /><span className="text-xs font-bold mt-2">Add Swing</span></div>
            {swings.map((swing) => (
                <div key={swing.id} className="aspect-[3/4] rounded-2xl bg-gray-900 relative overflow-hidden group cursor-pointer shadow-sm">
                    <img src={swing.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Icons.Play /></div></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <Text variant="caption" color="white" className="font-bold text-xs mb-0.5">{swing.clubUsed}</Text>
                        <Text variant="caption" className="text-[10px] text-gray-300">{swing.date.toLocaleDateString()}</Text>
                         <div className="mt-1 flex items-center gap-1"><Badge variant={swing.score > 80 ? 'success' : 'warning'} className="text-[10px] px-1.5 h-4">{swing.score}</Badge></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
