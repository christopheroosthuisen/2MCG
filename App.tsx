
import React, { useState } from 'react';
import { Tab, ToolType, ClubCategory } from './types';
import { COLORS } from './constants';
import { Text, Button, Card, Badge, Input, ProgressBar } from './components/UIComponents';
import { VideoRecorder, AnalysisResult, AnalyzeView } from './components/AnalysisViews';
import { LearnSystem } from './components/LearnViews';
import { PracticeSystem } from './components/PracticeViews';
import { TempoTool } from './components/TempoTool';
import { DataUploadWizard } from './components/DataUploadWizard';
import { BagOfShots } from './components/BagOfShots';
import { ProfileView } from './components/ProfileView';
import { OnCourseView } from './components/OnCourseView';
import { FitnessView } from './components/FitnessView';
import { askAICaddie } from './services/geminiService';
import { db } from './services/dataService';

const Icons = {
    Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>,
    Target: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>,
    Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
    Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Message: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
    Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    Activity: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Flag: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
};

// Helper for relative time
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

const QuickActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, colorClass: string }> = ({ icon, label, onClick, colorClass }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl shadow-sm transition-all duration-200 group-hover:scale-105 group-active:scale-95 border ${colorClass}`}>
            {icon}
        </div>
        <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
    </button>
);

const App: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<Tab>('HOME');
    const [subScreen, setSubScreen] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isUploadWizardOpen, setIsUploadWizardOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Get real user data
    const user = db.getUser();

    // Chat State
    const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);

    const handleSendChat = async () => {
        if (!input.trim()) return;
        const newMsg = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setLoadingChat(true);
        
        // Use the service to call Gemini with Grounding
        const response = await askAICaddie(input, messages);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        setLoadingChat(false);
    };

    const navigateTo = (tab: Tab) => {
        setCurrentTab(tab);
        setSubScreen(null);
    };

    if (isRecording) {
        return <VideoRecorder onAnalysisComplete={(res) => { setIsRecording(false); setSubScreen({ type: 'ANALYSIS_RESULT', id: res.id }); }} onCancel={() => setIsRecording(false)} />;
    }

    if (subScreen) {
        if (subScreen.type === 'ANALYSIS_RESULT') return <AnalysisResult analysisId={subScreen.id} onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'TOOL') return <TempoTool onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'BAG') return <BagOfShots onBack={() => setSubScreen(null)} />;
        if (subScreen.type === 'FITNESS') return <div className="p-4"><Button onClick={() => setSubScreen(null)}>Back</Button><FitnessView /></div>; // Simple wrapper
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#4B4B4B] font-sans selection:bg-orange-100">
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-6 hide-scrollbar pb-24">
                    {currentTab === 'HOME' && (
                        <div className="space-y-8 pt-6 pb-8">
                            {/* Header */}
                            <header className="flex justify-between items-center px-1">
                                <div>
                                    <Text variant="caption" className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
                                    <Text variant="h2" className="text-gray-900 leading-tight">Hello, {user.name.split(' ')[0]}</Text>
                                </div>
                                <div className="relative group">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer transition-transform group-hover:scale-105" onClick={() => navigateTo('PROFILE')}>
                                        <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                </div>
                            </header>

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-4 gap-4">
                                <QuickActionButton 
                                    icon={<Icons.Flag />} 
                                    label="Play" 
                                    onClick={() => navigateTo('PLAY')} 
                                    colorClass="bg-green-50 border-green-100 text-green-600" 
                                />
                                <QuickActionButton 
                                    icon={<Icons.Camera />} 
                                    label="Analyze" 
                                    onClick={() => setIsRecording(true)} 
                                    colorClass="bg-orange-50 border-orange-100 text-orange-600" 
                                />
                                <QuickActionButton 
                                    icon={<Icons.Target />} 
                                    label="Practice" 
                                    onClick={() => navigateTo('PRACTICE')} 
                                    colorClass="bg-blue-50 border-blue-100 text-blue-600" 
                                />
                                <QuickActionButton 
                                    icon={<Icons.Activity />} 
                                    label="Fitness" 
                                    onClick={() => setSubScreen({ type: 'FITNESS' })} 
                                    colorClass="bg-red-50 border-red-100 text-red-600" 
                                />
                            </div>

                            {/* AI Insight / Report Widget */}
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl transform rotate-1 opacity-50 blur-sm group-hover:rotate-2 transition-transform"></div>
                                <Card variant="filled" className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10"><Icons.Activity /></div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-orange-400 border border-white/10 backdrop-blur-md flex-shrink-0">
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

                            {/* Key Stats Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4 flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-all border-gray-100">
                                    <div className="absolute right-[-20px] top-[-20px] bg-green-50 w-24 h-24 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
                                    <div>
                                        <Text variant="caption" className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Handicap</Text>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <Text variant="h1" className="text-4xl">{user.swingDNA.handicap > 0 ? '+' : ''}{Math.abs(user.swingDNA.handicap)}</Text>
                                            <span className="text-green-600 text-[10px] font-bold bg-green-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                                <span className="text-xs">↓</span> 0.2
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                                        <div className="bg-green-500 h-full w-[70%] rounded-full"></div>
                                    </div>
                                    <Text className="text-[10px] text-gray-400 mt-2 font-medium">Top 5% of users</Text>
                                </Card>
                                <Card className="p-4 flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-all border-gray-100">
                                    <div className="absolute right-[-20px] top-[-20px] bg-orange-50 w-24 h-24 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
                                    <div>
                                        <Text variant="caption" className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Active Goal</Text>
                                        <Text variant="h3" className="text-lg leading-tight mt-1 line-clamp-2 min-h-[3rem]">{db.getGoals()[0]?.title || 'Set Goal'}</Text>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{db.getGoals()[0]?.progress || 0}%</span>
                                        </div>
                                        <ProgressBar progress={db.getGoals()[0]?.progress || 0} className="h-1.5" />
                                    </div>
                                </Card>
                            </div>

                            {/* Recent Activity List */}
                            <section>
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <Text variant="h3">Activity Log</Text>
                                </div>
                                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
                                    {db.getRecentActions().slice(0, 5).map((action, i) => (
                                        <div key={action.id} className={`flex gap-4 items-center p-3 rounded-2xl transition-colors hover:bg-gray-50 ${i !== db.getRecentActions().slice(0,5).length-1 ? 'border-b border-gray-50' : ''}`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-lg border border-gray-100/50 ${
                                                action.type === 'ADD_SWING' ? 'bg-blue-50 text-blue-500' :
                                                action.type === 'ADD_SESSION' ? 'bg-green-50 text-green-500' :
                                                action.type === 'MASTER_SHOT' ? 'bg-orange-50 text-orange-500' : 
                                                action.type === 'COMPLETE_LESSON' ? 'bg-purple-50 text-purple-500' : 
                                                action.type === 'ROUND_COMPLETE' ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-500'
                                            }`}>
                                                {action.type === 'ADD_SWING' && <Icons.Camera />}
                                                {action.type === 'ADD_SESSION' && <Icons.Target />}
                                                {action.type === 'MASTER_SHOT' && <div className="font-bold">★</div>}
                                                {action.type === 'UPDATE_GOAL' && <Icons.Activity />}
                                                {action.type === 'AI_CHAT' && <Icons.Message />}
                                                {action.type === 'COMPLETE_LESSON' && <Icons.Book />}
                                                {action.type === 'ROUND_COMPLETE' && <Icons.Flag />}
                                                {action.type === 'WORKOUT_COMPLETE' && <Icons.Activity />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-sm font-bold text-gray-900 truncate pr-2">
                                                        {action.type === 'ADD_SWING' && 'Swing Analysis'}
                                                        {action.type === 'ADD_SESSION' && 'Practice Session'}
                                                        {action.type === 'MASTER_SHOT' && 'Shot Mastered'}
                                                        {action.type === 'UPDATE_GOAL' && 'Goal Update'}
                                                        {action.type === 'AI_CHAT' && 'Caddie Chat'}
                                                        {action.type === 'COMPLETE_LESSON' && 'Lesson Complete'}
                                                        {action.type === 'ROUND_COMPLETE' && 'Round Played'}
                                                        {action.type === 'WORKOUT_COMPLETE' && 'Workout Done'}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-gray-400 flex-shrink-0">{timeAgo(action.timestamp)}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 truncate">
                                                    {action.type === 'ADD_SWING' && `Analyzed ${action.details.club || 'Swing'}`}
                                                    {action.type === 'ADD_SESSION' && `${action.details.shots} shots • ${db.getSessions().find(s=>s.id===action.details.id)?.club || 'Session'}`}
                                                    {action.type === 'MASTER_SHOT' && `Mastered: ${action.details.title}`}
                                                    {action.type === 'UPDATE_GOAL' && `Progress: ${action.details.progress}%`}
                                                    {action.type === 'AI_CHAT' && `Conversation`}
                                                    {action.type === 'COMPLETE_LESSON' && `${action.details.title} in ${action.details.course}`}
                                                    {action.type === 'ROUND_COMPLETE' && `${action.details.course} • ${action.details.score}`}
                                                    {action.type === 'WORKOUT_COMPLETE' && `${action.details.title}`}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {db.getRecentActions().length === 0 && (
                                        <div className="text-center py-8 text-gray-400 italic text-sm">
                                            No activity yet. Start practicing!
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                    {currentTab === 'PRACTICE' && <PracticeSystem onOpenTempoTool={() => setSubScreen({ type: 'TOOL' })} onOpenBagOfShots={() => setSubScreen({ type: 'BAG' })} />}
                    {currentTab === 'LEARN' && <LearnSystem />}
                    {currentTab === 'ANALYZE' && (
                        <AnalyzeView 
                            onRecord={() => setIsRecording(true)}
                            onSelectSwing={(id) => setSubScreen({ type: 'ANALYSIS_RESULT', id })}
                            onUpload={() => setIsUploadWizardOpen(true)}
                        />
                    )}
                    {currentTab === 'PLAY' && <OnCourseView />}
                    {currentTab === 'PROFILE' && <ProfileView />}
                </div>

                <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-8 flex justify-between items-center z-40 safe-area-bottom">
                    <NavButton active={currentTab === 'HOME'} onClick={() => navigateTo('HOME')} icon={<Icons.Home />} label="Home" />
                    <NavButton active={currentTab === 'PLAY'} onClick={() => navigateTo('PLAY')} icon={<Icons.Flag />} label="Play" />
                    <NavButton active={currentTab === 'PRACTICE'} onClick={() => navigateTo('PRACTICE')} icon={<Icons.Target />} label="Practice" />
                    <NavButton active={currentTab === 'ANALYZE'} onClick={() => navigateTo('ANALYZE')} icon={<Icons.Camera />} label="Analyze" />
                    <NavButton active={currentTab === 'LEARN'} onClick={() => navigateTo('LEARN')} icon={<Icons.Book />} label="Learn" />
                    <NavButton active={currentTab === 'PROFILE'} onClick={() => navigateTo('PROFILE')} icon={<Icons.User />} label="Profile" />
                </nav>

                {/* AI Caddie Floating Button */}
                <button 
                    onClick={() => setIsChatOpen(true)}
                    className="absolute bottom-24 right-6 w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-orange-600 transition-colors z-40 hover:scale-105 active:scale-95"
                >
                    <Icons.Message />
                </button>

                {/* AI Caddie Chat Overlay */}
                {isChatOpen && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 safe-area-top">
                            <div>
                                <Text variant="h4">AI Caddie</Text>
                                <Text variant="caption" className="text-xs">Powered by Gemini 3 Pro • Search • Maps</Text>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-2 text-gray-500"><Icons.Close /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-20">
                                    <p>Ask me about course rules, local weather, or strategy.</p>
                                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                                        <button onClick={() => setInput("What's the weather at Pebble Beach?")} className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">Weather @ Pebble</button>
                                        <button onClick={() => setInput("Explain the new drop rule")} className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">Drop Rules</button>
                                    </div>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${m.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loadingChat && <div className="text-xs text-gray-400 ml-4 animate-pulse">Thinking...</div>}
                        </div>
                        <div className="p-4 border-t border-gray-100 safe-area-bottom">
                            <div className="flex gap-2">
                                <Input 
                                    value={input} 
                                    onChange={(e) => setInput(e.target.value)} 
                                    placeholder="Ask your caddie..." 
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                />
                                <Button onClick={handleSendChat} disabled={loadingChat} className="px-3"><Icons.Send /></Button>
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
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all w-14 ${active ? 'text-[#FF8200] -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}>
        <div className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : ''}`}>{icon}</div>
        <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
    </button>
);

export default App;
