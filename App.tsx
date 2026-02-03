
import React, { useState, useEffect } from 'react';
import { Tab, SwingAnalysis } from './types';
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
import { OnCourseView } from './components/OnCourseView';
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

// Helper functions
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

    const openChatWithContext = (message: string) => {
        setInput(message);
        setIsChatOpen(true);
    };

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

    const handleRecordingComplete = (videoUrl: string, thumbUrl: string) => {
        const newSwing: SwingAnalysis = {
            id: crypto.randomUUID(),
            date: new Date(),
            videoUrl: videoUrl,
            thumbnailUrl: thumbUrl,
            clubUsed: 'DRIVER', // Default, could be selectable
            tags: ['New Import'],
            metrics: {},
            feedback: [],
            keyframes: [],
            score: 0,
            annotations: []
        };
        db.addSwing(newSwing);
        setIsRecording(false);
        setSubScreen({ type: 'ANALYSIS_RESULT', id: newSwing.id });
    };

    // --- Sub-Screen Rendering Logic ---
    if (showOnboarding) {
        return <Onboarding onComplete={completeOnboarding} />;
    }

    if (isRecording) {
        return <VideoRecorder onComplete={handleRecordingComplete} onCancel={() => setIsRecording(false)} />;
    }
    
    if (showNotifications) {
        return <NotificationsView onBack={() => setShowNotifications(false)} onAskCoach={openChatWithContext} />;
    }

    if (isUploadWizardOpen) {
        return <DataUploadWizard onClose={() => setIsUploadWizardOpen(false)} onComplete={(stats) => { console.log('Data saved', stats); }} onAskCoach={openChatWithContext} />;
    }

    // Render Sub-screens over the main layout
    if (subScreen) {
        if (subScreen.type === 'ANALYSIS_RESULT') return <AnalysisResult analysisId={subScreen.id} onBack={() => setSubScreen(null)} onAskCoach={openChatWithContext} />;
        if (subScreen.type === 'TOOL') return <TempoTool onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'BAG') return <BagOfShots onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'FITNESS') return <div className="min-h-screen bg-white"><FitnessView onBack={() => setSubScreen(null)} /></div>; 
        if (subScreen.type === 'WARMUP') return <div className="min-h-screen bg-white"><WarmupView onBack={() => setSubScreen(null)} /></div>; 
        if (subScreen.type === 'SUBSCRIPTION') return <div className="min-h-screen bg-white"><SubscriptionView onBack={() => setSubScreen(null)} /></div>;
        if (subScreen.type === 'ON_COURSE') return <div className="min-h-screen bg-white"><OnCourseView /></div>;
    }

    // Responsive Desktop Sidebar
    const Sidebar = () => (
        <div className="hidden md:flex flex-col w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 border-r border-gray-800 z-40">
            <div className="p-6 border-b border-gray-800">
                <Text variant="h2" color="white" className="mb-0">MCG</Text>
                <Text variant="caption" className="text-gray-500">Mayo Conservatory of Golf</Text>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
                {[
                    { id: 'HOME', icon: <Icons.Home />, label: 'Dashboard' },
                    { id: 'PRACTICE', icon: <Icons.Target />, label: 'Practice' },
                    { id: 'ANALYZE', icon: <Icons.Camera />, label: 'Analyze' },
                    { id: 'LEARN', icon: <Icons.Book />, label: 'Learn' },
                    { id: 'SOCIAL', icon: <Icons.User />, label: 'Community' },
                    { id: 'PROFILE', icon: <Icons.User />, label: 'Profile' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigateTo(item.id as Tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentTab === item.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        {item.icon}
                        <span className="font-bold text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button 
                    onClick={toggleLiveMode}
                    className={`w-full p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all ${isLiveActive ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                    {isLiveActive ? <Icons.MicOff /> : <Icons.Mic />}
                    {isLiveActive ? 'End Live Coach' : 'Live Coach'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50 safe-area-bottom">
                {[
                    { id: 'HOME', icon: <Icons.Home />, label: 'Home' },
                    { id: 'PRACTICE', icon: <Icons.Target />, label: 'Practice' },
                    { id: 'ANALYZE', icon: <Icons.Camera />, label: 'Analyze' },
                    { id: 'LEARN', icon: <Icons.Book />, label: 'Learn' },
                    { id: 'PROFILE', icon: <Icons.User />, label: 'Profile' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigateTo(item.id as Tab)}
                        className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentTab === item.id ? 'text-orange-500' : 'text-gray-400'}`}
                    >
                        <div className="text-2xl">{item.icon}</div>
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="md:ml-64 min-h-screen relative">
                {/* Global Live Coach Overlay */}
                {isLiveActive && (
                    <div className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8">
                        <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 animate-in slide-in-from-bottom">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                                    <Icons.Mic />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
                            </div>
                            <div>
                                <div className="text-sm font-bold">AI Coach Listening...</div>
                                <div className="text-xs text-gray-400">Ask about your swing or strategy</div>
                            </div>
                            <button onClick={toggleLiveMode} className="p-2 hover:bg-white/10 rounded-full"><Icons.Close /></button>
                        </div>
                    </div>
                )}

                {/* AI Assistant FAB */}
                {!isLiveActive && !isChatOpen && (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-orange-600 rounded-full shadow-lg shadow-orange-600/30 flex items-center justify-center text-white hover:scale-105 hover:bg-orange-500 transition-all active:scale-95 animate-in zoom-in duration-300"
                        title="Chat with AI Coach"
                    >
                        <Icons.Message />
                    </button>
                )}

                {/* Chat Interface Overlay */}
                {isChatOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
                        <div className="w-full md:w-96 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-900">AI Caddie Chat</h3>
                                <button onClick={() => setIsChatOpen(false)}><Icons.Close /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-400 text-sm mt-8">
                                        <div className="text-4xl mb-2">⛳</div>
                                        <p>Ask me anything about golf!</p>
                                        <p className="text-xs mt-2">"How do I fix a slice?"</p>
                                        <p className="text-xs">"What's a good drill for putting?"</p>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {loadingChat && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500 transition-colors"
                                        placeholder="Ask about drills, rules..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                                    />
                                    <button onClick={handleSendChat} className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors">
                                        <Icons.Send />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Tab Rendering */}
                <div className="h-full">
                    {currentTab === 'HOME' && (
                        <div className="p-4 space-y-6 pb-24">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Text variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
                                    <Text variant="h1">{getGreeting(user.name.split(' ')[0])}</Text>
                                </div>
                                <div className="flex gap-3">
                                    <button className="relative p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow" onClick={() => setShowNotifications(true)}>
                                        <Icons.Bell />
                                        {unreadCount > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm" onClick={() => navigateTo('PROFILE')}>
                                        <img src={user.avatarUrl} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card variant="elevated" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none relative overflow-hidden" onClick={() => navigateTo('ANALYZE')}>
                                    <div className="relative z-10">
                                        <div className="text-xs font-bold uppercase opacity-80 mb-1">Latest Swing</div>
                                        <div className="text-3xl font-black mb-1">82 <span className="text-lg font-medium opacity-80">/ 100</span></div>
                                        <div className="text-xs font-medium bg-white/20 inline-block px-2 py-0.5 rounded">View Analysis</div>
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path></svg>
                                    </div>
                                </Card>
                                <Card variant="elevated" className="bg-white" onClick={() => navigateTo('PRACTICE')}>
                                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Weekly Goal</div>
                                    <div className="text-3xl font-black text-gray-900 mb-1">3 <span className="text-lg font-medium text-gray-400">/ 5</span></div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </Card>
                            </div>

                            {/* Main Actions */}
                            <div>
                                <Text variant="h3" className="mb-3">Quick Actions</Text>
                                <div className="grid grid-cols-4 gap-3">
                                    <QuickAction icon="⛳" label="Round" onClick={() => setSubScreen({ type: 'ON_COURSE' })} />
                                    <QuickAction icon="🎯" label="Practice" onClick={() => navigateTo('PRACTICE')} />
                                    <QuickAction icon="📹" label="Analyze" onClick={() => setIsRecording(true)} />
                                    <QuickAction icon="🧘" label="Warmup" onClick={() => setSubScreen({ type: 'WARMUP' })} />
                                </div>
                            </div>

                            {/* Recent Activity / Feed Preview */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <Text variant="h3">Recent Activity</Text>
                                    <button className="text-orange-500 text-xs font-bold" onClick={() => navigateTo('SOCIAL')}>View All</button>
                                </div>
                                <div className="space-y-3">
                                    <Card className="flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🏌️</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">Round at Seaside Links</div>
                                            <div className="text-xs text-gray-500">Score: 74 (+2) • 2 days ago</div>
                                        </div>
                                        <Badge variant="success">Completed</Badge>
                                    </Card>
                                    <Card className="flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🤖</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">Swing Analysis</div>
                                            <div className="text-xs text-gray-500">Driver • Tempo Issue Detected</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs">82</div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentTab === 'PRACTICE' && <PracticeSystem onOpenTempoTool={() => setSubScreen({ type: 'TOOL' })} onOpenBagOfShots={() => setSubScreen({ type: 'BAG' })} onAskCoach={openChatWithContext} onToggleLive={toggleLiveMode} isLiveActive={isLiveActive} />}
                    
                    {currentTab === 'ANALYZE' && (
                        <div className="pb-24">
                            <div className="px-4 pt-6 bg-white sticky top-0 z-10">
                                <Text variant="h1" className="mb-4">Analyze</Text>
                                <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                                    {['VIDEO', 'SG', 'STATS', 'REPLAY'].map((tab) => (
                                        <button 
                                            key={tab} 
                                            onClick={() => setAnalyzeTab(tab as any)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${analyzeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {analyzeTab === 'VIDEO' && <AnalyzeView onRecord={() => setIsRecording(true)} onSelectSwing={(id) => setSubScreen({ type: 'ANALYSIS_RESULT', id })} onUpload={() => setIsUploadWizardOpen(true)} />}
                            {analyzeTab === 'SG' && <StrokesGainedDashboard />}
                            {analyzeTab === 'STATS' && <StatisticsHub />}
                            {analyzeTab === 'REPLAY' && <RoundReplayHub onBack={() => setAnalyzeTab('VIDEO')} />}
                        </div>
                    )}

                    {currentTab === 'LEARN' && <LearnSystem />}
                    {currentTab === 'SOCIAL' && <SocialHub />}
                    {currentTab === 'PROFILE' && <ProfileView />}
                </div>
            </div>
            
            {/* Conditional Sub-screens that overlay full viewport */}
            {subScreen?.type === 'ON_COURSE' && (
                <div className="fixed inset-0 z-50 bg-white">
                    <OnCourseView />
                    <button onClick={() => setSubScreen(null)} className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white z-50">
                        <Icons.Close />
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
