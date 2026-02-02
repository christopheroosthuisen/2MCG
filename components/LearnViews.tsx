
import React, { useState } from 'react';
import { Course, CourseCategoryType, CourseLesson, Drill, TrainingPlan } from '../types';
import { COLORS, MOCK_LEARNING_PATHS, MOCK_DRILLS, MOCK_PLANS } from '../constants';
import { Text, Card, Badge, ProgressBar, Button, Tabs, ScreenHeader, Input } from './UIComponents';
import { db } from '../services/dataService';
import { generateConceptImage, generateDrillVideo } from '../services/geminiService';
import { PracticeSystem } from './PracticeViews'; // Import to switch to practice

const Icons = {
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Grid: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
    ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
};

type ViewState = 'HOME' | 'PLAN_DETAIL' | 'DRILL_LIST' | 'DRILL_DETAIL' | 'PRACTICE_MODE';

export const LearnSystem: React.FC = () => {
    const [view, setView] = useState<ViewState>('HOME');
    const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
    const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('FULL_SWING');

    const handleSelectPlan = (plan: TrainingPlan) => {
        setSelectedPlan(plan);
        setView('PLAN_DETAIL');
    };

    const handleSelectDrill = (drill: Drill) => {
        setSelectedDrill(drill);
        setView('DRILL_DETAIL');
    };

    const handleStartPractice = (drill: Drill) => {
        setSelectedDrill(drill);
        setView('PRACTICE_MODE');
    };

    const handleBack = () => {
        if (view === 'PRACTICE_MODE') setView('DRILL_DETAIL');
        else if (view === 'DRILL_DETAIL') {
            if (selectedPlan) setView('PLAN_DETAIL');
            else setView('DRILL_LIST');
        } 
        else if (view === 'PLAN_DETAIL' || view === 'DRILL_LIST') setView('HOME');
    };

    if (view === 'HOME') return <LearnHome onSelectPlan={handleSelectPlan} onBrowseLibrary={(cat) => { setSelectedCategory(cat); setView('DRILL_LIST'); }} />;
    if (view === 'PLAN_DETAIL' && selectedPlan) return <PlanDetail plan={selectedPlan} onBack={handleBack} onSelectDrill={handleSelectDrill} />;
    if (view === 'DRILL_LIST') return <DrillList category={selectedCategory} onBack={handleBack} onSelectDrill={handleSelectDrill} />;
    if (view === 'DRILL_DETAIL' && selectedDrill) return <DrillDetail drill={selectedDrill} onBack={handleBack} onStartPractice={() => handleStartPractice(selectedDrill)} />;
    if (view === 'PRACTICE_MODE' && selectedDrill) return <PracticeSystem onOpenTempoTool={()=>{}} onOpenBagOfShots={()=>{}} initialDrill={selectedDrill} onExit={handleBack} />;

    return null;
};

// --- MCG LEARNING HOME ---
const LearnHome: React.FC<{ onSelectPlan: (plan: TrainingPlan) => void; onBrowseLibrary: (category: string) => void }> = ({ onSelectPlan, onBrowseLibrary }) => {
    return (
        <div className="bg-[#F5F5F7] min-h-screen pb-32 animate-in fade-in duration-500">
            <div className="px-4 pt-6 pb-2 sticky top-0 bg-[#F5F5F7] z-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-2xl tracking-tighter text-gray-900">MCG</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 mt-1">Conservatory</span>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-gray-900"><Icons.Grid /></button>
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* Hero / Main Categories */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 relative rounded-2xl overflow-hidden h-48 cursor-pointer group" onClick={() => onBrowseLibrary('FULL_SWING')}>
                        <img src="https://images.unsplash.com/photo-1593111774240-d529f12db464?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end p-6">
                            <Text variant="caption" className="text-orange-400 font-bold uppercase tracking-wider mb-1">TrackMan Maestro</Text>
                            <div className="text-white text-3xl font-black leading-none uppercase">The Mayo<br/>Method</div>
                        </div>
                    </div>
                    
                    <div className="col-span-1 relative rounded-2xl overflow-hidden aspect-square cursor-pointer group" onClick={() => onBrowseLibrary('ALL')}>
                        <div className="absolute inset-0 bg-gray-900"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
                            <div className="text-4xl mb-2">📹</div>
                            <h3 className="font-bold text-white text-lg">Video<br/>Library</h3>
                        </div>
                    </div>
                    
                    <div className="col-span-1 relative rounded-2xl overflow-hidden aspect-square cursor-pointer group" onClick={() => onBrowseLibrary('SHORT_GAME')}>
                        <div className="absolute inset-0 bg-orange-600"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
                            <div className="text-4xl mb-2">⛳</div>
                            <h3 className="font-bold text-white text-lg">Short<br/>Game</h3>
                        </div>
                    </div>
                </div>

                {/* Plans Carousel */}
                <div className="pt-6">
                    <div className="flex justify-between items-end mb-4">
                        <Text variant="h2" className="text-2xl">Training Plans</Text>
                        <Button size="sm" variant="outline" icon={<Icons.Plus />}>My List</Button>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                        {MOCK_PLANS.map(plan => (
                            <div key={plan.id} onClick={() => onSelectPlan(plan)} className="min-w-[220px] bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                                <div className="h-28 relative">
                                    <img src={plan.thumbnailUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <Badge className="absolute bottom-2 left-2 bg-white/20 backdrop-blur text-white border-white/20 font-bold">{plan.category}</Badge>
                                </div>
                                <div className="p-3">
                                    <h4 className="text-gray-900 font-bold text-sm uppercase truncate mb-1">{plan.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{plan.totalDrills} Drills</span>
                                        <span>•</span>
                                        <span>{plan.durationLabel}</span>
                                    </div>
                                    {plan.progress > 0 && (
                                        <div className="mt-3">
                                            <ProgressBar progress={plan.progress} className="h-1" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Theory Section */}
                <div className="pt-2">
                    <Text variant="h2" className="text-xl mb-3">Swing Theory</Text>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer" onClick={() => onBrowseLibrary('QUANT_ANALYSIS')}>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">D</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">D-Plane Explained</h4>
                                <p className="text-xs text-gray-500">Understanding Path & Face</p>
                            </div>
                            <Icons.ChevronRight />
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer" onClick={() => onBrowseLibrary('FULL_SWING')}>
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold">K</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">Kinematic Sequence</h4>
                                <p className="text-xs text-gray-500">Efficiency in the Downswing</p>
                            </div>
                            <Icons.ChevronRight />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PLAN DETAIL ---
const PlanDetail: React.FC<{ plan: TrainingPlan; onBack: () => void; onSelectDrill: (d: Drill) => void }> = ({ plan, onBack, onSelectDrill }) => {
    // Determine which drills are in this plan
    const planDrills = MOCK_DRILLS.filter(d => plan.drillIds.includes(d.id));

    return (
        <div className="bg-white min-h-screen">
            <div className="h-64 relative">
                <img src={plan.thumbnailUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <button onClick={onBack} className="absolute top-6 left-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"><Icons.ChevronLeft /></button>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <Badge className="bg-orange-500 text-white mb-2 border-none">{plan.category}</Badge>
                    <h1 className="text-3xl font-black uppercase leading-none mb-2">{plan.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                        <span>{plan.totalDrills} Drills</span>
                        <span>•</span>
                        <span>{plan.durationLabel}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Curriculum</h3>
                    <span className="text-xs font-bold text-gray-500 uppercase">{plan.progress}% Complete</span>
                </div>
                
                <div className="space-y-4">
                    {planDrills.map((drill, index) => (
                        <div key={drill.id} onClick={() => onSelectDrill(drill)} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-all cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs group-hover:border-orange-500 group-hover:text-orange-500">{index + 1}</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">{drill.title}</h4>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{drill.description}</p>
                            </div>
                            <div className="text-gray-300 group-hover:text-orange-500"><Icons.ChevronRight /></div>
                        </div>
                    ))}
                    {planDrills.length === 0 && <div className="text-center text-gray-400 py-4">No drills in this plan yet.</div>}
                </div>
            </div>
        </div>
    );
};

// --- DRILL LIST ---
const DrillList: React.FC<{ category: string; onBack: () => void; onSelectDrill: (d: Drill) => void }> = ({ category, onBack, onSelectDrill }) => {
    const drills = MOCK_DRILLS.filter(d => category === 'ALL' || d.category === category);
    
    // Group by subcategory
    const groupedDrills = drills.reduce((acc, drill) => {
        const sub = drill.subcategory || 'General';
        if (!acc[sub]) acc[sub] = [];
        acc[sub].push(drill);
        return acc;
    }, {} as Record<string, Drill[]>);

    return (
        <div className="bg-[#F5F5F7] min-h-screen">
            <div className="sticky top-0 bg-[#F5F5F7] z-10 px-4 pt-6 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full"><Icons.ChevronLeft /></button>
                    <h1 className="font-bold text-xl text-gray-900">{category.replace('_', ' ')}</h1>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {Object.entries(groupedDrills).map(([sub, subDrills]) => (
                    <div key={sub}>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3 px-1">{sub}</h3>
                        <div className="space-y-3">
                            {subDrills.map(drill => (
                                <div key={drill.id} onClick={() => onSelectDrill(drill)} className="bg-white p-3 rounded-xl shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-100">
                                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative">
                                        <img src={drill.thumbnailUrl} className="w-full h-full object-cover" />
                                        {drill.videoUrl && <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white"><Icons.Play /></div>}
                                    </div>
                                    <div className="flex-1 py-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 text-sm">{drill.title}</h4>
                                            <Icons.ChevronRight />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{drill.description}</p>
                                        <div className="mt-2 flex gap-2">
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{drill.difficulty}</span>
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{drill.durationMinutes} min</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- DRILL DETAIL ---
const DrillDetail: React.FC<{ drill: Drill; onBack: () => void; onStartPractice: () => void }> = ({ drill, onBack, onStartPractice }) => {
    const [isVideoGenerating, setIsVideoGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

    const handleGenerateVideo = async () => {
        setIsVideoGenerating(true);
        const vid = await generateDrillVideo(drill.title);
        setGeneratedVideo(vid);
        setIsVideoGenerating(false);
    };

    return (
        <div className="bg-[#111827] min-h-screen text-white flex flex-col">
            <div className="px-4 py-6">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                    <Icons.ChevronLeft /> <span className="text-sm font-bold">Back</span>
                </button>
                
                <Badge variant="warning" className="mb-2 bg-orange-500 text-white border-none">{drill.category}</Badge>
                <h1 className="text-2xl font-black uppercase mb-4">{drill.title}</h1>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{drill.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-8">
                    <span>{drill.durationMinutes} Minutes</span>
                    <span>{drill.facility || 'Range'}</span>
                    <span>{drill.goalCount} {drill.goalUnit || 'Reps'}</span>
                </div>

                {generatedVideo ? (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 border border-gray-700 shadow-lg">
                        <video src={generatedVideo} controls className="w-full h-full" />
                    </div>
                ) : (
                    <div className="mb-8 p-6 bg-gray-800 rounded-xl flex flex-col items-center text-center border border-gray-700">
                        <div className="text-3xl mb-2">📹</div>
                        <span className="text-sm font-bold mb-3">AI Demonstration</span>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-white" onClick={handleGenerateVideo} disabled={isVideoGenerating}>
                            {isVideoGenerating ? 'Generating Video...' : 'Generate Demo'}
                        </Button>
                    </div>
                )}

                <div className="mb-8">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Instructions</div>
                    <div className="space-y-4">
                        {drill.steps.map((step) => (
                            <div key={step.order} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-orange-900 text-orange-500 flex items-center justify-center font-bold text-xs flex-shrink-0">{step.order}</div>
                                <p className="text-sm text-gray-300">{step.text}</p>
                            </div>
                        ))}
                        {drill.steps.length === 0 && <p className="text-sm text-gray-500">Follow the video demonstration for this drill.</p>}
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-gray-800 bg-[#111827] sticky bottom-0 safe-area-bottom">
                <Button fullWidth variant="primary" size="lg" className="bg-orange-600 text-white hover:bg-orange-500 border-none font-black" onClick={onStartPractice}>
                    START SESSION
                </Button>
            </div>
        </div>
    );
};
