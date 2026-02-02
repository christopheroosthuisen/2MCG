
import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import { Text, Button, Card, Badge, Input, ProgressBar, QuickAction } from './components/UIComponents';
import { VideoRecorder, AnalysisResult, AnalyzeView } from './components/AnalysisViews';
import { LearnSystem } from './components/LearnViews';
import { PracticeSystem } from './components/PracticeViews';
import { TempoTool } from './components/TempoTool';
import { DataUploadWizard } from './components/DataUploadWizard';
import { BagOfShots } from './components/BagOfShots';
import { ProfileView } from './components/ProfileView';
import { FitnessView } from './components/FitnessView';
import { WarmupView } from './components/WarmupView';
import { SwingLibrary } from './components/SwingLibraryView'; 
import { SocialHub } from './components/SocialView';
import { StrokesGainedDashboard } from './components/StrokesGainedView';
import { StatisticsHub } from './components/StatisticsView';
import { RoundReplayHub } from './components/RoundReplayView';
import { Onboarding } from './components/Onboarding';
import { NotificationsView } from './components/NotificationsView';
import { SubscriptionView } from './components/SubscriptionView'; 
import { askAICaddie, connectLiveCoach } from './services/geminiService';
import { db } from './services/dataService';
import { MOCK_NOTIFICATIONS } from './constants';

const Icons = {
    Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>,
    Target: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>,
    Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
    Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Message: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
    Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Bell: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Coin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>,
    Activity: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Mic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>,
    MicOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
};

// ... (Helper functions match previous)
function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

function getGreeting(name: string) {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    if (hour < 21) return `Good evening, ${name}`;
    return `Night owl mode, ${name}`;
}

const App: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<Tab>('HOME');
    const [analyzeTab, setAnalyzeTab] = useState<'VIDEO' | 'SG' | 'STATS' | 'REPLAY'>('VIDEO');
    const [subScreen, setSubScreen] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isUploadWizardOpen, setIsUploadWizardOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Get real user data
    const user = db.getUser();
    
    // Simple unread count mock
    const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length;

    // Check for onboarding or first time load logic
    useEffect(() => {
        if (!user.onboardingCompleted) {
            setShowOnboarding(true);
        }
    }, [user.onboardingCompleted]);

    const completeOnboarding = () => {
        setShowOnboarding(false);
    };

    // Chat State
    const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    
    // Live API State
    const [isLiveActive, setIsLiveActive] = useState(false);
    const [liveSession, setLiveSession] = useState<any>(null);

    const handleSendChat = async () => {
        if (!input.trim()) return;
        const newMsg = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setLoadingChat(true);
        
        const response = await askAICaddie(input, messages);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        setLoadingChat(false);
    };

    const toggleLiveMode = async () => {
        if (isLiveActive) {
            if (liveSession) {
                liveSession.disconnect();
                setLiveSession(null);
            }
            setIsLiveActive(false);
            setMessages(prev => [...prev, { role: 'model', text: "Live session ended." }]);
        } else {
            setIsLiveActive(true);
            const session = await connectLiveCoach((text) => {
                // Optional: Update UI with status messages from live coach
                // setMessages(prev => [...prev, { role: 'model', text: `[Live]: ${text}` }]);
            });
            setLiveSession(session);
        }
    };

    const navigateTo = (tab: Tab) => {
        setCurrentTab(tab);
        setSubScreen(null);
    };

    // --- Sub-Screen Rendering Logic ---
    if (showOnboarding) {
        return <Onboarding onComplete={completeOnboarding} />;
    }

    if (isRecording) {
        return <VideoRecorder onAnalysisComplete={(res) => { setIsRecording(false); setSubScreen({ type: 'ANALYSIS_RESULT', id: res.id }); }} onCancel={() => setIsRecording(false)} />;
    }
    
    if (showNotifications) {
        return <NotificationsView onBack={() => setShowNotifications(false)} />;
    }

    // Render Sub-screens over the main layout
    if (subScreen) {
        if (subScreen.type === 'ANALYSIS_RESULT') return <AnalysisResult analysisId={subScreen.id} onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'TOOL') return <TempoTool onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'BAG') return <BagOfShots onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'FITNESS') return <div className="min-h-screen bg-white"><FitnessView onBack={() => setSubScreen(null)} /></div>; 
        if (subScreen.type === 'WARMUP') return <div className="min-h-screen bg-white"><WarmupView onBack={() => setSubScreen(null)} /></div>; 
        if (subScreen.type === 'SUBSCRIPTION') return <div className="min-h-screen bg-white"><SubscriptionView onBack={() => setSubScreen(null)} /></div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#111827] font-sans selection:bg-orange-100">
            <main className="max-w-md mx-auto min-h-screen bg-[#F5F5F7] shadow-2xl relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 hide-scrollbar pb-32">
                    {currentTab === 'HOME' && (
                        <div className="space-y-8 pt-6 pb-8 screen-enter">
                            {/* Header */}
                            <header className="flex justify-between items-center px-2">
                                <div>
                                    <Text variant="caption" className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
                                    <Text variant="h2" className="text-gray-900 leading-tight tracking-tight">{getGreeting(user.name.split(' ')[0])}</Text>
                                    
                                    {/* Streak Widget */}
                                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full mt-2 inline-flex border border-orange-100 animate-in fade-in zoom-in duration-300">
                                        <span className="text-lg">🔥</span>
                                        <span className="font-bold text-orange-600 text-xs">{user.stats.streak} Day Streak</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => setSubScreen({ type: 'SUBSCRIPTION' })}
                                    >
                                        <span className="text-yellow-500 text-sm"><Icons.Coin /></span>
                                        <span className="text-gray-900 font-bold text-xs">{user.credits}</span>
                                    </div>
                                    <button 
                                        className="relative p-2.5 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm border border-gray-100 transition-colors"
                                        onClick={() => setShowNotifications(true)}
                                    >
                                        <Icons.Bell />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </button>
                                    <div className="relative group cursor-pointer transition-transform hover:scale-105" onClick={() => navigateTo('PROFILE')}>
                                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                                            <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Quick Actions Grid */}
                            <div>
                                <Text variant="h4" className="mb-3 px-2 text-sm font-bold uppercase tracking-wider text-gray-400">Improvement Hub</Text>
                                <div className="grid grid-cols-3 gap-3">
                                    <QuickAction 
                                        icon="📥" 
                                        label="Import" 
                                        onClick={() => setIsUploadWizardOpen(true)} 
                                    />
                                    <QuickAction 
                                        icon="⛳" 
                                        label="Practice" 
                                        onClick={() => navigateTo('PRACTICE')} 
                                    />
                                    <QuickAction 
                                        icon="📹" 
                                        label="Analyze" 
                                        onClick={() => navigateTo('ANALYZE')} 
                                    />
                                </div>
                            </div>

                            {/* AI Insight / Report Widget */}
                            <div className="relative group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl transform rotate-1 opacity-50 blur-sm group-hover:rotate-2 transition-transform"></div>
                                <Card variant="filled" className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden shadow-xl">
                                    <div className="absolute top-0 right-0 p-6 opacity-10"><Icons.Activity /></div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-orange-400 border border-white/10 backdrop-blur-md flex-shrink-0 animate-pulse">
                                            <span className="text-xl">💡</span>
                                        </div>
                                        <div className="flex-1">
                                            <Text variant="h4" color="white" className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">AI Insight</Text>
                                            <Text className="text-base font-medium leading-snug mb-3">Your driver spin rate is averaging 2900rpm (+400 vs target). Try teeing the ball slightly higher.</Text>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-xs h-8 px-3 border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-400">View Data</Button>
                                                <Button size="sm" variant="primary" className="text-xs h-8 px-3 bg-orange-600 hover:bg-orange-500 border-none shadow-orange-900/20">Fix It</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Key Stats Row (Enhanced) */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="col-span-2 bg-white p-5 border border-gray-100 shadow-sm rounded-3xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Text variant="metric-label" className="text-gray-400">Handicap Index</Text>
                                            <div className="flex items-baseline gap-2">
                                                <Text variant="metric" className="text-5xl text-gray-900 tracking-tighter mt-1">{user.swingDNA.handicap > 0 ? '+' : ''}{Math.abs(user.swingDNA.handicap)}</Text>
                                                <span className="text-sm font-bold text-gray-400">HCP</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-green-600 mt-2 text-xs font-bold bg-green-50 px-2 py-1 rounded-full inline-block border border-green-100">
                                                <span>↓</span> 0.3 this month
                                            </div>
                                        </div>
                                        {/* Mini visual trend */}
                                        <div className="flex items-end gap-1.5 h-16 opacity-80">
                                            {[40, 55, 35, 70, 50, 80, 65].map((h, i) => (
                                                <div key={i} className="w-3 bg-gray-900 rounded-t-sm" style={{ height: `${h}%`, opacity: (i+3)/10 }} />
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                                
                                <Card className="p-4 flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-all border border-gray-100 bg-white">
                                    <div className="absolute right-[-20px] top-[-20px] bg-orange-50 w-24 h-24 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
                                    <div>
                                        <Text variant="caption" className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Active Goal</Text>
                                        <Text variant="h3" className="text-lg leading-tight mt-1 line-clamp-2 min-h-[3rem] text-gray-900">{db.getGoals()[0]?.title || 'Set Goal'}</Text>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{db.getGoals()[0]?.progress || 0}%</span>
                                        </div>
                                        <ProgressBar progress={db.getGoals()[0]?.progress || 0} className="h-1.5" />
                                    </div>
                                </Card>

                                <Card className="p-4 flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-all border border-gray-100 cursor-pointer bg-white" onClick={() => setIsRecording(true)}>
                                    <div className="absolute right-[-20px] top-[-20px] bg-blue-50 w-24 h-24 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                        <Icons.Camera />
                                    </div>
                                    <div>
                                        <Text variant="h4" className="text-base font-bold text-gray-900">Record Swing</Text>
                                        <Text variant="caption" className="text-xs text-gray-500">AI Analysis</Text>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                    {currentTab === 'PRACTICE' && <div className="screen-enter"><PracticeSystem onOpenTempoTool={() => setSubScreen({ type: 'TOOL' })} onOpenBagOfShots={() => setSubScreen({ type: 'BAG' })} /></div>}
                    {currentTab === 'LEARN' && <div className="screen-enter"><LearnSystem /></div>}
                    
                    {/* Updated Analyze Tab Structure */}
                    {currentTab === 'ANALYZE' && (
                        <div className="screen-enter flex flex-col h-full">
                            <div className="px-4 pt-6 pb-2 bg-[#F5F5F7]/95 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/50">
                                <Text variant="caption" className="uppercase font-bold tracking-widest text-orange-500 mb-1">Data & Video</Text>
                                <Text variant="h1" className="mb-4">Analyze</Text>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setAnalyzeTab('VIDEO')}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${analyzeTab === 'VIDEO' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Video
                                    </button>
                                    <button 
                                        onClick={() => setAnalyzeTab('SG')}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${analyzeTab === 'SG' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Gained
                                    </button>
                                    <button 
                                        onClick={() => setAnalyzeTab('STATS')}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${analyzeTab === 'STATS' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Stats
                                    </button>
                                    <button 
                                        onClick={() => setAnalyzeTab('REPLAY')}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${analyzeTab === 'REPLAY' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Replay
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 pt-4">
                                {analyzeTab === 'VIDEO' && <SwingLibrary onRecord={() => setIsRecording(true)} />}
                                {analyzeTab === 'SG' && <StrokesGainedDashboard />}
                                {analyzeTab === 'STATS' && <StatisticsHub />}
                                {analyzeTab === 'REPLAY' && <RoundReplayHub onBack={() => setAnalyzeTab('VIDEO')} />}
                            </div>
                        </div>
                    )}
                    
                    {currentTab === 'PROFILE' && <div className="screen-enter"><ProfileView /></div>}
                    {currentTab === 'SOCIAL' && <div className="screen-enter"><SocialHub /></div>}
                </div>

                {/* Floating Navigation Bar */}
                <div className="absolute bottom-6 left-4 right-4 z-40 safe-area-bottom">
                    <nav className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl px-2 py-3 flex justify-between items-center border border-white/10">
                        <NavButton active={currentTab === 'HOME'} onClick={() => navigateTo('HOME')} icon={<Icons.Home />} label="Home" />
                        <NavButton active={currentTab === 'PRACTICE'} onClick={() => navigateTo('PRACTICE')} icon={<Icons.Target />} label="Practice" />
                        <div className="relative -top-6">
                            <button 
                                onClick={() => setIsChatOpen(true)}
                                className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center text-white hover:scale-105 transition-transform border-4 border-[#F5F5F7]"
                            >
                                <Icons.Message />
                            </button>
                        </div>
                        <NavButton active={currentTab === 'ANALYZE'} onClick={() => navigateTo('ANALYZE')} icon={<Icons.Camera />} label="Analyze" />
                        <NavButton active={currentTab === 'LEARN'} onClick={() => navigateTo('LEARN')} icon={<Icons.Book />} label="Learn" />
                    </nav>
                </div>

                {/* AI Caddie Chat Overlay */}
                {isChatOpen && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 safe-area-top">
                            <div>
                                <Text variant="h4">AI Caddie</Text>
                                <Text variant="caption" className="text-xs">Powered by Gemini 3 Pro • Search • Maps</Text>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-2 text-gray-500 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"><Icons.Close /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative">
                            {messages.length === 0 && !isLiveActive && (
                                <div className="text-center text-gray-400 mt-20">
                                    <p className="mb-4">Ask me about course rules, local weather, or strategy.</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <button onClick={() => setInput("What's the weather at Pebble Beach?")} className="text-xs bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">Weather @ Pebble</button>
                                        <button onClick={() => setInput("Explain the new drop rule")} className="text-xs bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">Drop Rules</button>
                                    </div>
                                </div>
                            )}
                            
                            {isLiveActive && (
                                <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white z-10 p-6 text-center">
                                    <div className="w-24 h-24 rounded-full bg-orange-500 animate-pulse flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(249,115,22,0.5)]">
                                        <Icons.Mic />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Live Coach Active</h3>
                                    <p className="text-gray-400">Listening... Speak naturally to your coach.</p>
                                    <Button variant="outline" className="mt-8 border-white/20 text-white hover:bg-white/10" onClick={toggleLiveMode}>End Session</Button>
                                </div>
                            )}

                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${m.role === 'user' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loadingChat && <div className="text-xs text-gray-400 ml-4 animate-pulse">Thinking...</div>}
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 safe-area-bottom bg-white">
                            <div className="flex gap-2">
                                <button 
                                    onClick={toggleLiveMode}
                                    className={`p-3 rounded-xl transition-colors ${isLiveActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {isLiveActive ? <Icons.MicOff /> : <Icons.Mic />}
                                </button>
                                <Input 
                                    value={input} 
                                    onChange={(e) => setInput(e.target.value)} 
                                    placeholder="Ask your caddie..." 
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    disabled={isLiveActive}
                                />
                                <Button onClick={handleSendChat} disabled={loadingChat || isLiveActive} className="px-3"><Icons.Send /></Button>
                            </div>
                        </div>
                    </div>
                )}

                {isUploadWizardOpen && <DataUploadWizard onClose={() => setIsUploadWizardOpen(false)} onComplete={() => {}} />}
            </main>
        </div>
    );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }> = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`relative flex flex-col items-center gap-1 transition-all w-16 group`}>
        <div className={`w-6 h-6 transition-colors duration-200 ${active ? 'text-orange-500 stroke-[2.5px]' : 'text-gray-400 group-hover:text-gray-200'}`}>
            {icon}
        </div>
        <span className={`text-[9px] font-bold transition-colors duration-200 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{label}</span>
        {active && <div className="absolute -bottom-2 w-1 h-1 bg-orange-500 rounded-full" />}
    </button>
);

export default App;
