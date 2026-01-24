import React, { useState } from 'react';
import { Tab, ToolType, ClubCategory } from './types';
import { COLORS, MOCK_DRILLS, MOCK_RECENT_SWINGS, MOCK_USER_PROFILE } from './constants';
import { Text, Button, Card, Badge, ProgressBar } from './components/UIComponents';
import { VideoRecorder, AnalysisToolbar, SkeletonOverlay, MetricCard, KeyframeMarker } from './components/AnalysisViews';
import { LearnSystem } from './components/LearnViews';
import { PracticeSystem } from './components/PracticeViews';

// Icons as simple SVG components
const Icons = {
    Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Target: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
    Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    ArrowLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    Plus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Map: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
    Briefcase: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
};

const App: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<Tab>('HOME');
    const [subScreen, setSubScreen] = useState<{ type: 'DRILL' | 'ANALYSIS_RESULT', id: string } | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    // Navigation Helper
    const navigateTo = (tab: Tab) => {
        setCurrentTab(tab);
        setSubScreen(null);
    };

    const openDrill = (id: string) => setSubScreen({ type: 'DRILL', id });
    const openAnalysis = (id: string) => setSubScreen({ type: 'ANALYSIS_RESULT', id });
    const goBack = () => setSubScreen(null);

    // --- SCREEN COMPONENTS ---

    const HomeView = () => (
        <div className="space-y-6 pb-32">
            <header className="flex justify-between items-center bg-white p-6 pb-2 -mx-6 -mt-6 sticky top-0 z-10 border-b border-gray-50">
                <div>
                    <Text variant="caption" className="font-medium text-gray-500">Welcome back,</Text>
                    <Text variant="h2" className="text-gray-900">{MOCK_USER_PROFILE.name.split(' ')[0]}</Text>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigateTo('PROFILE')}>
                    <img src={MOCK_USER_PROFILE.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card variant="filled" className="bg-orange-50 border-orange-100 relative overflow-hidden cursor-pointer" onClick={() => navigateTo('PRACTICE')}>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2">
                        <Icons.Target />
                    </div>
                    <Text variant="metric-label" className="text-orange-700 mb-1">Handicap</Text>
                    <Text variant="metric" color={COLORS.primary}>
                        {MOCK_USER_PROFILE.swingDNA.handicap > 0 ? '+' : ''}{Math.abs(MOCK_USER_PROFILE.swingDNA.handicap).toFixed(1)}
                    </Text>
                    <div className="flex items-center text-xs text-orange-600 mt-2 font-bold">
                        <span className="mr-1">↓</span> 0.3 this month
                    </div>
                </Card>
                <Card variant="filled" className="bg-green-50 border-green-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2">
                        <Icons.Target />
                    </div>
                    <Text variant="metric-label" className="text-green-800 mb-1">Avg Score</Text>
                    <Text variant="metric" color={COLORS.secondary}>{MOCK_USER_PROFILE.stats.avgScore}</Text>
                    <div className="flex items-center text-xs text-green-700 mt-2 font-bold">
                        Last 5 rounds
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <section>
                <Card variant="filled" className="bg-gray-900 text-white relative overflow-hidden cursor-pointer group" onClick={() => setIsRecording(true)}>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                            <Icons.Camera />
                        </div>
                        <Text variant="h3" color="white" className="mb-1">AI Swing Check</Text>
                        <Text className="text-gray-400 mb-4 text-sm max-w-[80%]">Record your swing for instant AI analysis of your posture and plane.</Text>
                        <Button variant="primary" size="sm" className="bg-white text-gray-900 hover:bg-gray-100 border-none">Start Analysis</Button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-8 translate-y-8 scale-150">
                        <Icons.Camera />
                    </div>
                </Card>
            </section>

            {/* Recent Analysis */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <Text variant="h3">Recent Swings</Text>
                    <button className="text-sm font-bold text-orange-500 hover:text-orange-600">View All</button>
                </div>
                <div className="space-y-3">
                    {MOCK_RECENT_SWINGS.map(swing => (
                        <Card key={swing.id} onClick={() => openAnalysis(swing.id)} className="flex gap-4 p-3 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                            <div className="w-20 h-24 rounded-xl bg-gray-200 overflow-hidden relative flex-shrink-0 shadow-sm">
                                <img src={swing.thumbnailUrl} alt="Swing" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                                        <div className="w-4 h-4 text-orange-500 ml-0.5"><Icons.Play /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center py-1">
                                <div className="flex justify-between items-start mb-1">
                                    <Text variant="h4" className="text-base font-bold">{swing.clubUsed} Swing</Text>
                                    <Badge variant={swing.score > 80 ? 'success' : 'warning'}>{swing.score}</Badge>
                                </div>
                                <Text variant="caption" className="mb-3 text-xs flex items-center gap-1">
                                    <Icons.Clock /> {swing.date.toLocaleDateString()}
                                </Text>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Club Speed</div>
                                        <div className="text-sm font-bold">{swing.metrics.clubSpeed} <span className="text-[10px] font-normal text-gray-400">mph</span></div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Carry</div>
                                        <div className="text-sm font-bold">{swing.metrics.carryDistance} <span className="text-[10px] font-normal text-gray-400">yds</span></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );

    // --- DETAIL SCREENS ---

    const DrillDetail = ({ drillId }: { drillId: string }) => {
        const drill = MOCK_DRILLS.find(d => d.id === drillId);
        if (!drill) return null;

        return (
            <div className="bg-white min-h-screen pb-24 animate-in slide-in-from-right duration-300">
                <div className="relative h-64 bg-gray-900">
                    <img src={drill.thumbnailUrl} className="w-full h-full object-cover opacity-60" />
                    <button onClick={goBack} className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                        <Icons.ArrowLeft />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <Badge variant="info" className="mb-2">{drill.category}</Badge>
                        <Text variant="h2" color="white" className="mb-1">{drill.title}</Text>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                            <span>{drill.difficulty}</span>
                            <span>•</span>
                            <span>{drill.durationMinutes} min</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    <div>
                        <Text variant="h4" className="mb-2">Description</Text>
                        <Text color="gray">{drill.description}</Text>
                    </div>

                    <div>
                        <Text variant="h4" className="mb-4">Steps</Text>
                        <div className="space-y-4">
                            {drill.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                                        {step.order}
                                    </div>
                                    <div className="pt-1">
                                        <Text>{step.text}</Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 safe-area-bottom">
                         <Button fullWidth size="lg">Start Session</Button>
                    </div>
                </div>
            </div>
        );
    };

    const AnalysisResult = ({ analysisId }: { analysisId: string }) => {
        const swing = MOCK_RECENT_SWINGS.find(s => s.id === analysisId);
        const [activeTool, setActiveTool] = useState<ToolType | null>(null);
        const [activeColor, setActiveColor] = useState('#FF8200');
        const [showSkeleton, setShowSkeleton] = useState(false);

        if (!swing) return null;

        return (
            <div className="bg-black min-h-screen pb-24 text-white animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
                    <button onClick={goBack} className="p-2 text-white hover:bg-gray-800 rounded-full">
                        <Icons.ArrowLeft />
                    </button>
                    <div className="text-center">
                        <Text variant="h4" color="white" className="text-base">{swing.clubUsed} Analysis</Text>
                        <Text variant="caption" color="gray" className="text-xs">{swing.date.toLocaleDateString()}</Text>
                    </div>
                    <button className="text-orange-500 font-bold text-sm">Share</button>
                </div>

                {/* Video Area */}
                <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
                     {/* Placeholder for video */}
                     <img src={swing.thumbnailUrl} className="w-full h-full object-cover opacity-50" />
                     
                     {/* Overlay */}
                     <SkeletonOverlay />

                     <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                        <Text variant="caption" color="white" className="font-mono">00:01.42</Text>
                     </div>
                </div>

                {/* Controls & Metrics */}
                <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 overflow-hidden flex flex-col">
                    <div className="bg-gray-100 p-2 border-b border-gray-200">
                         <AnalysisToolbar 
                            activeTool={activeTool} 
                            onSelectTool={setActiveTool}
                            activeColor={activeColor}
                            onSelectColor={setActiveColor}
                            showSkeleton={showSkeleton}
                            onToggleSkeleton={() => setShowSkeleton(!showSkeleton)}
                         />
                    </div>

                    <div className="p-6 overflow-y-auto hide-scrollbar space-y-6">
                        {/* Timeline Mock */}
                        <div className="mb-2">
                             <KeyframeMarker 
                                keyframes={swing.keyframes.length ? swing.keyframes : [{id:'1', type:'TOP', timestamp: 1.2}, {id:'2', type:'IMPACT', timestamp: 2.1}]} 
                                duration={3.5} 
                                currentTime={1.2} 
                                onSeek={() => {}} 
                             />
                        </div>

                        {/* Metrics Grid */}
                        <div>
                            <Text variant="h4" className="mb-3 text-gray-900">Swing Metrics</Text>
                            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 hide-scrollbar">
                                <MetricCard label="Club Speed" value={swing.metrics.clubSpeed || '-'} unit="mph" />
                                <MetricCard label="Ball Speed" value={swing.metrics.ballSpeed || '-'} unit="mph" />
                                <MetricCard label="Carry" value={swing.metrics.carryDistance || '-'} unit="yds" />
                                <MetricCard label="Spin" value={swing.metrics.spinRate || '-'} unit="rpm" />
                                <MetricCard label="Launch" value={swing.metrics.launchAngle || '-'} unit="deg" />
                            </div>
                        </div>

                        {/* Feedback */}
                        <div>
                            <Text variant="h4" className="mb-3 text-gray-900">AI Coach Feedback</Text>
                            <div className="space-y-3">
                                {(swing.feedback.length ? swing.feedback : MOCK_RECENT_SWINGS[0].feedback).map((fb, i) => (
                                    <Card key={i} variant="filled" className="bg-blue-50 border-l-4 border-blue-500 rounded-l-md">
                                        <div className="flex gap-3">
                                            <div className="pt-1">
                                                {fb.severity === 'WARNING' ? (
                                                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">!</div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">i</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <Text variant="caption" className="font-bold text-gray-700">{fb.category}</Text>
                                                    <span className="text-[10px] text-gray-400 font-mono">@ {fb.timestamp}s</span>
                                                </div>
                                                <Text className="text-sm text-gray-800">{fb.text}</Text>
                                                {fb.correction && (
                                                    <Button variant="ghost" size="sm" className="mt-2 text-blue-600 pl-0 hover:bg-transparent justify-start h-auto py-0">
                                                        View Correction Drill →
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ProfileView = () => (
        <div className="space-y-6 pb-32 animate-in fade-in duration-500">
             {/* Profile Header */}
             <div className="bg-white p-6 -mx-6 -mt-6 pt-12 text-center border-b border-gray-100">
                 <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-xl relative">
                     <img src={MOCK_USER_PROFILE.avatarUrl} className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white text-white">
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                 </div>
                 <Text variant="h2" className="mb-1">{MOCK_USER_PROFILE.name}</Text>
                 <div className="flex items-center justify-center gap-2 mb-4">
                     <Badge variant="dark" className="text-[10px] tracking-widest">{MOCK_USER_PROFILE.memberStatus}</Badge>
                     <Text variant="caption" className="flex items-center gap-1"><Icons.Map /> {MOCK_USER_PROFILE.homeCourse}</Text>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mt-6">
                     <div className="text-center">
                         <div className="text-xl font-bold text-gray-900">{MOCK_USER_PROFILE.stats.roundsPlayed}</div>
                         <div className="text-[10px] text-gray-400 font-bold uppercase">Rounds</div>
                     </div>
                     <div className="text-center border-l border-gray-100">
                         <div className="text-xl font-bold text-gray-900">{MOCK_USER_PROFILE.stats.fairwaysHit}%</div>
                         <div className="text-[10px] text-gray-400 font-bold uppercase">FIR</div>
                     </div>
                     <div className="text-center border-l border-gray-100">
                         <div className="text-xl font-bold text-gray-900">{MOCK_USER_PROFILE.stats.greensInRegulation}%</div>
                         <div className="text-[10px] text-gray-400 font-bold uppercase">GIR</div>
                     </div>
                     <div className="text-center border-l border-gray-100">
                         <div className="text-xl font-bold text-gray-900">{MOCK_USER_PROFILE.stats.puttsPerRound}</div>
                         <div className="text-[10px] text-gray-400 font-bold uppercase">Putts</div>
                     </div>
                 </div>
             </div>

             {/* Swing DNA */}
             <div className="px-1">
                 <Text variant="h3" className="mb-3 px-1">Swing DNA</Text>
                 <div className="grid grid-cols-2 gap-3">
                     <Card variant="filled" className="flex items-center justify-between p-4 bg-gray-900 text-white">
                         <div>
                             <div className="text-xs text-gray-400 uppercase font-bold mb-1">Driver Speed</div>
                             <div className="text-2xl font-bold">{MOCK_USER_PROFILE.swingDNA.driverSpeed} <span className="text-sm font-normal text-gray-500">mph</span></div>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                             <Icons.Activity />
                         </div>
                     </Card>
                     <Card variant="filled" className="flex items-center justify-between p-4">
                         <div>
                             <div className="text-xs text-gray-400 uppercase font-bold mb-1">7-Iron Carry</div>
                             <div className="text-2xl font-bold">{MOCK_USER_PROFILE.swingDNA.ironCarry7} <span className="text-sm font-normal text-gray-500">yds</span></div>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                             <Icons.Target />
                         </div>
                     </Card>
                     <Card variant="filled" className="flex items-center justify-between p-4">
                         <div>
                             <div className="text-xs text-gray-400 uppercase font-bold mb-1">Tempo</div>
                             <div className="text-lg font-bold">{MOCK_USER_PROFILE.swingDNA.tempo}</div>
                         </div>
                     </Card>
                     <Card variant="filled" className="flex items-center justify-between p-4">
                         <div>
                             <div className="text-xs text-gray-400 uppercase font-bold mb-1">Shot Shape</div>
                             <div className="text-lg font-bold">{MOCK_USER_PROFILE.swingDNA.typicalShape}</div>
                         </div>
                     </Card>
                 </div>
             </div>

             {/* What's In The Bag */}
             <div className="px-1">
                 <div className="flex justify-between items-center mb-3 px-1">
                     <Text variant="h3">What's In The Bag</Text>
                     <Button size="sm" variant="ghost" className="text-orange-500 font-bold text-xs">Edit Bag</Button>
                 </div>
                 <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                     {(['WOOD', 'IRON', 'WEDGE', 'PUTTER'] as ClubCategory[]).map((category, idx) => {
                         const categoryClubs = MOCK_USER_PROFILE.bag.filter(c => c.category === category);
                         if (categoryClubs.length === 0) return null;
                         
                         return (
                             <div key={category} className={`p-5 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                                 <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                     {category}S
                                 </div>
                                 <div className="space-y-3">
                                     {categoryClubs.map(club => (
                                         <div key={club.id} className="flex justify-between items-center">
                                             <div>
                                                 <div className="font-bold text-gray-900">{club.type}</div>
                                                 <div className="text-xs text-gray-500">{club.name} {club.loft && `• ${club.loft}`}</div>
                                             </div>
                                             {club.shaft && (
                                                 <div className="text-xs text-gray-400 font-mono text-right max-w-[120px] truncate">{club.shaft}</div>
                                             )}
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             </div>

             {/* Settings Links */}
             <div className="space-y-2 pt-4">
                <Card variant="outlined" className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Icons.Settings />
                        <span className="font-bold text-gray-700">App Settings</span>
                    </div>
                    <Icons.ChevronRight />
                </Card>
                <Card variant="outlined" className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Icons.Briefcase />
                        <span className="font-bold text-gray-700">Subscription & Billing</span>
                    </div>
                    <Icons.ChevronRight />
                </Card>
                <div className="pt-4 px-4">
                    <Button variant="ghost" fullWidth className="text-red-500 hover:bg-red-50">Log Out</Button>
                    <Text align="center" variant="caption" className="mt-4 text-xs text-gray-300">Version 2.4.0 (Build 1042)</Text>
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER LOGIC ---

    if (isRecording) {
        return (
            <VideoRecorder 
                onAnalysisComplete={(res) => {
                    setIsRecording(false);
                    // In a real app, we'd navigate to the new analysis ID
                    openAnalysis('101'); 
                }} 
                onCancel={() => setIsRecording(false)} 
            />
        );
    }

    if (subScreen) {
        if (subScreen.type === 'DRILL') return <DrillDetail drillId={subScreen.id} />;
        if (subScreen.type === 'ANALYSIS_RESULT') return <AnalysisResult analysisId={subScreen.id} />;
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#4B4B4B] font-sans selection:bg-orange-100">
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-6 hide-scrollbar">
                    {currentTab === 'HOME' && <HomeView />}
                    {currentTab === 'PRACTICE' && <PracticeSystem />}
                    {currentTab === 'LEARN' && <LearnSystem />}
                    {currentTab === 'ANALYZE' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 pb-20 animate-in fade-in duration-500">
                             <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-2 relative">
                                <div className="absolute inset-0 border-2 border-orange-100 rounded-full animate-ping opacity-20"></div>
                                <div className="transform scale-150"><Icons.Camera /></div>
                             </div>
                             <div>
                                <Text variant="h2" className="mb-2">Ready to Swing?</Text>
                                <Text variant="body" className="max-w-[260px] mx-auto text-gray-500">Record your swing or upload a video to get AI-powered feedback instantly.</Text>
                             </div>
                             <div className="w-full max-w-xs space-y-3 pt-4">
                                 <Button fullWidth onClick={() => setIsRecording(true)} icon={<Icons.Camera />} className="shadow-lg shadow-orange-500/30">Record New Swing</Button>
                                 <Button fullWidth variant="outline" icon={<Icons.Plus />}>Upload Video</Button>
                             </div>
                        </div>
                    )}
                    {currentTab === 'PROFILE' && <ProfileView />}
                </div>

                {/* Bottom Navigation */}
                <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-8 flex justify-between items-center z-50 safe-area-bottom shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
                    <NavButton 
                        active={currentTab === 'HOME'} 
                        onClick={() => navigateTo('HOME')} 
                        icon={<Icons.Home />} 
                        label="Home" 
                    />
                    <NavButton 
                        active={currentTab === 'PRACTICE'} 
                        onClick={() => navigateTo('PRACTICE')} 
                        icon={<Icons.Target />} 
                        label="Practice" 
                    />
                    
                    {/* Floating Center Button */}
                    <div className="-mt-12 relative group">
                        <div className="absolute inset-0 bg-orange-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <button 
                            onClick={() => navigateTo('ANALYZE')}
                            className="w-16 h-16 bg-[#FF8200] rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center text-white transform hover:scale-105 transition-all duration-200 relative z-10 border-4 border-gray-50"
                        >
                            <div className="transform scale-125"><Icons.Camera /></div>
                        </button>
                    </div>

                    <NavButton 
                        active={currentTab === 'LEARN'} 
                        onClick={() => navigateTo('LEARN')} 
                        icon={<Icons.Book />} 
                        label="Learn" 
                    />
                    <NavButton 
                        active={currentTab === 'PROFILE'} 
                        onClick={() => navigateTo('PROFILE')} 
                        icon={<Icons.User />} 
                        label="Profile" 
                    />
                </nav>
            </main>
        </div>
    );
};

const NavButton: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-all duration-200 w-14 ${active ? 'text-[#FF8200] -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}
    >
        <div className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : ''}`}>{icon}</div>
        <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
    </button>
);

export default App;
