import React, { useState, useEffect, useRef } from 'react';
import { PracticeGoal, PracticeSession, Drill, SwingAnalysis, PracticeShot } from '../types';
import { COLORS, MOCK_SESSIONS } from '../constants';
import { Text, Card, Badge, ProgressBar, Button, Input, Tabs, Modal } from './UIComponents';
import { db } from '../services/dataService';
import { PuttingLabView } from './PuttingLabView';
import { SwingLibrary as SwingLibraryView } from './SwingLibraryView';

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

const PracticeDashboard: React.FC<{
    onOpenTempoTool: () => void;
    onOpenBagOfShots: () => void;
    onOpenPuttingLab: () => void;
    onAskCoach?: (msg: string) => void;
}> = ({ onOpenTempoTool, onOpenBagOfShots, onOpenPuttingLab, onAskCoach }) => {
    const sessions = db.getSessions();
    const goals = db.getGoals();
    const activeGoal = goals[0];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
                <button onClick={onOpenTempoTool} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-orange-200 transition-colors">
                    <span className="text-2xl mb-2">⏱️</span>
                    <span className="text-xs font-bold text-gray-700">Tempo</span>
                </button>
                <button onClick={onOpenBagOfShots} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-orange-200 transition-colors">
                    <span className="text-2xl mb-2">🎒</span>
                    <span className="text-xs font-bold text-gray-700">Bag Check</span>
                </button>
                <button onClick={onOpenPuttingLab} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-orange-200 transition-colors">
                    <span className="text-2xl mb-2">⛳</span>
                    <span className="text-xs font-bold text-gray-700">Putting</span>
                </button>
            </div>

            {activeGoal && (
                <Card>
                    <div className="flex justify-between items-center mb-2">
                        <Text variant="h4" className="text-sm font-bold">Active Goal</Text>
                        <span className="text-xs text-gray-500">{activeGoal.deadline?.toLocaleDateString()}</span>
                    </div>
                    <Text className="text-sm mb-3">{activeGoal.title}</Text>
                    <div className="flex items-center gap-3">
                        <ProgressBar progress={activeGoal.progress} className="h-2" />
                        <span className="text-xs font-bold text-gray-700">{activeGoal.progress}%</span>
                    </div>
                </Card>
            )}

            <div>
                <Text variant="h3" className="mb-3">Recent Sessions</Text>
                {sessions.slice(0, 3).map(session => (
                    <div key={session.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-sm text-gray-900">{session.club} Practice</div>
                            <div className="text-xs text-gray-500">{session.date.toLocaleDateString()} • {session.shotsHit} shots</div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-lg text-gray-900">{session.consistencyScore}%</div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold">Consistency</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PerformanceDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <Text variant="h3" className="mb-4">Consistency Trend</Text>
                <div className="h-40 flex items-end justify-between gap-2 px-2">
                    {[65, 70, 68, 72, 75, 82, 80].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                            <div className="w-full bg-orange-100 rounded-t-md relative hover:bg-orange-200 transition-colors" style={{ height: `${val}%` }}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
                            </div>
                            <div className="text-[10px] text-gray-400">Day {i+1}</div>
                        </div>
                    ))}
                </div>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-4">
                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">Total Shots</div>
                    <div className="text-3xl font-black text-gray-900">1,240</div>
                    <div className="text-xs text-green-600 font-bold mt-1">+12% vs last week</div>
                </Card>
                <Card className="text-center p-4">
                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">Practice Time</div>
                    <div className="text-3xl font-black text-gray-900">4.5h</div>
                    <div className="text-xs text-gray-500 font-bold mt-1">This week</div>
                </Card>
            </div>
        </div>
    );
};

const GoalsView: React.FC<{ onAskCoach?: (msg: string) => void }> = ({ onAskCoach }) => {
    const goals = db.getGoals();
    return (
        <div className="space-y-4">
            {goals.map(goal => (
                <Card key={goal.id}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <Text variant="h4" className="text-base font-bold">{goal.title}</Text>
                            <Text variant="caption" className="text-xs mt-1">Target: {goal.targetValue} {goal.unit}</Text>
                        </div>
                        <Badge variant="info">{goal.metric}</Badge>
                    </div>
                    <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Current: {goal.currentValue}</span>
                            <span>{goal.progress}%</span>
                        </div>
                        <ProgressBar progress={goal.progress} className="h-2" />
                    </div>
                    {onAskCoach && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button onClick={() => onAskCoach(`Help me achieve my goal: ${goal.title}`)} className="text-xs font-bold text-orange-600">Ask Coach for Drills</button>
                        </div>
                    )}
                </Card>
            ))}
            <Button variant="outline" fullWidth icon={<Icons.Plus />}>Add New Goal</Button>
        </div>
    );
};

const HistoryView: React.FC = () => {
    const sessions = db.getSessions();
    return (
        <div className="space-y-4">
            {sessions.map(session => (
                <div key={session.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="font-bold text-gray-900">{session.club} Session</div>
                            <div className="text-xs text-gray-500">{session.date.toLocaleDateString()} at {session.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                        <Badge variant="neutral">{session.shotsHit} Shots</Badge>
                    </div>
                    {session.notes && <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mb-2">{session.notes}</p>}
                    <div className="flex gap-4 text-xs">
                        <div>
                            <span className="text-gray-400 font-bold uppercase">Consistency</span>
                            <div className="font-bold text-gray-900">{session.consistencyScore}%</div>
                        </div>
                        {session.drillId && (
                            <div>
                                <span className="text-gray-400 font-bold uppercase">Drill</span>
                                <div className="font-bold text-orange-600">Active</div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
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

            <div className="px-4 max-w-7xl mx-auto w-full">
                {activeTab === 'DASHBOARD' && <PracticeDashboard onOpenTempoTool={onOpenTempoTool} onOpenBagOfShots={onOpenBagOfShots} onOpenPuttingLab={() => setShowPuttingLab(true)} onAskCoach={onAskCoach} />}
                {activeTab === 'PERFORMANCE' && <PerformanceDashboard />}
                {activeTab === 'GOALS' && <GoalsView onAskCoach={onAskCoach} />}
                {activeTab === 'HISTORY' && <HistoryView />}
                {activeTab === 'SWINGS' && <SwingLibraryView onRecord={()=>{}} />}
            </div>

            {isSessionActive && (
                <div className="fixed inset-0 z-50 flex justify-center items-end md:items-center pointer-events-none">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={() => setIsSessionActive(false)}></div>
                    <div className="w-full md:max-w-2xl h-full md:h-[90vh] bg-gray-900 md:rounded-2xl relative pointer-events-auto overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <PracticeTimer onClose={() => setIsSessionActive(false)} onToggleLive={onToggleLive} isLiveActive={isLiveActive} />
                    </div>
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
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Club Selection</span>
                        <span className="text-sm font-bold text-orange-500">{selectedClub}</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                        {clubs.map(club => (
                            <button 
                                key={club}
                                onClick={() => setSelectedClub(club)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${selectedClub === club ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            >
                                {club}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shot Logging Grid */}
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Log Result</div>
                    <div className="grid grid-cols-3 gap-3">
                        <ShotButton result="PURE" label="Pure" color="bg-green-600 border-green-500 text-white" />
                        <ShotButton result="THIN" label="Thin" color="bg-gray-800 border-gray-700 text-gray-300" />
                        <ShotButton result="FAT" label="Fat" color="bg-gray-800 border-gray-700 text-gray-300" />
                        <ShotButton result="LEFT" label="Left" color="bg-blue-900 border-blue-800 text-blue-300" />
                        <ShotButton result="RIGHT" label="Right" color="bg-blue-900 border-blue-800 text-blue-300" />
                        <ShotButton result="SHORT" label="Short" color="bg-red-900 border-red-800 text-red-300" />
                        <ShotButton result="LONG" label="Long" color="bg-red-900 border-red-800 text-red-300" />
                        <ShotButton result="TOE" label="Toe" color="bg-gray-800 border-gray-700 text-gray-300" />
                        <ShotButton result="HEEL" label="Heel" color="bg-gray-800 border-gray-700 text-gray-300" />
                    </div>
                </div>

                {/* Live Coach Integration */}
                <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-bold">AI Coach</div>
                        {isLiveActive && <Badge variant="success" className="animate-pulse">Live</Badge>}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">Need real-time feedback? Activate voice coach.</p>
                    <Button 
                        fullWidth 
                        variant={isLiveActive ? "danger" : "primary"} 
                        icon={isLiveActive ? <Icons.Mic /> : <Icons.Mic />}
                        onClick={onToggleLive}
                    >
                        {isLiveActive ? 'Stop Coaching' : 'Start Voice Coach'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
