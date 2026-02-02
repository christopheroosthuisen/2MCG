
import React, { useState, useMemo } from 'react';
import { Drill, TrainingPlan, Course } from '../types';
import { MOCK_DRILLS, MOCK_PLANS, MOCK_COURSES } from '../constants';
import { Text, Card, Badge, ProgressBar, Button, ScreenHeader, Input } from './UIComponents';
import { generateDrillVideo } from '../services/geminiService';
import { PracticeSystem } from './PracticeViews';

const Icons = {
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
};

type ViewState = 'HOME' | 'PLAN_DETAIL' | 'DRILL_LIST' | 'DRILL_DETAIL' | 'PRACTICE_MODE';

export const LearnSystem: React.FC = () => {
    const [view, setView] = useState<ViewState>('HOME');
    const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
    const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('ALL');

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
            else setView('HOME');
        } 
        else if (view === 'PLAN_DETAIL' || view === 'DRILL_LIST') setView('HOME');
    };

    if (view === 'HOME') return <LearnHome onSelectPlan={handleSelectPlan} onSelectDrill={handleSelectDrill} initialCategory={filterCategory} />;
    if (view === 'PLAN_DETAIL' && selectedPlan) return <PlanDetail plan={selectedPlan} onBack={handleBack} onSelectDrill={handleSelectDrill} />;
    if (view === 'DRILL_DETAIL' && selectedDrill) return <DrillDetail drill={selectedDrill} onBack={handleBack} onStartPractice={() => handleStartPractice(selectedDrill)} />;
    if (view === 'PRACTICE_MODE' && selectedDrill) return <PracticeSystem onOpenTempoTool={()=>{}} onOpenBagOfShots={()=>{}} initialDrill={selectedDrill} onExit={handleBack} />;

    return null;
};

// --- COMPONENTS ---

const CategoryPill: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            active 
                ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
        }`}
    >
        {label}
    </button>
);

const PlanCard: React.FC<{ plan: TrainingPlan; onClick: () => void; compact?: boolean }> = ({ plan, onClick, compact }) => (
    <div 
        onClick={onClick} 
        className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group h-full flex flex-col ${compact ? 'min-w-[260px]' : ''}`}
    >
        <div className="relative h-40 overflow-hidden">
            <img src={plan.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute top-3 left-3">
                <Badge variant="warning" className="border-none shadow-sm">{plan.category}</Badge>
            </div>
            <div className="absolute bottom-3 left-3 text-white">
                <div className="text-xs font-bold opacity-90 mb-0.5">{plan.totalDrills} Drills • {plan.durationLabel}</div>
                <h3 className="font-bold text-lg leading-tight">{plan.title}</h3>
            </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
            <Text className="text-xs text-gray-500 line-clamp-2 mb-3">{plan.description}</Text>
            <div>
                {plan.progress > 0 ? (
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                            <span>Progress</span>
                            <span>{plan.progress}%</span>
                        </div>
                        <ProgressBar progress={plan.progress} className="h-1.5" />
                    </div>
                ) : (
                    <div className="flex items-center text-xs font-bold text-orange-600 group-hover:underline">
                        Start Plan <Icons.ChevronRight />
                    </div>
                )}
            </div>
        </div>
    </div>
);

const CourseCard: React.FC<{ course: Course; onClick: () => void }> = ({ course, onClick }) => (
    <div onClick={onClick} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
        <div className="w-24 h-24 rounded-xl bg-gray-200 flex-shrink-0 relative overflow-hidden">
            <img src={course.thumbnailUrl} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Icons.Play />
            </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-1">
                <Badge variant="neutral" className="text-[9px] py-0.5">{course.category.replace('_', ' ')}</Badge>
                {course.progress > 0 && <span className="text-[10px] font-bold text-green-600">{course.progress}%</span>}
            </div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">{course.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-1 mb-2">{course.description}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <span>{course.instructor}</span>
                <span>•</span>
                <span>{course.totalDuration} Min</span>
            </div>
        </div>
    </div>
);

// --- MAIN HOME VIEW ---

const LearnHome: React.FC<{ onSelectPlan: (plan: TrainingPlan) => void; onSelectDrill: (drill: Drill) => void; initialCategory?: string }> = ({ onSelectPlan, onSelectDrill, initialCategory }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState(initialCategory || 'ALL');

    const categories = ['ALL', 'FULL_SWING', 'SHORT_GAME', 'PUTTING', 'STRATEGY', 'MENTAL'];
    
    // Filtering Logic
    const filteredPlans = useMemo(() => {
        return MOCK_PLANS.filter(p => {
            const matchesCategory = category === 'ALL' || p.category.toUpperCase().replace(' ', '_') === category;
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [category, searchQuery]);

    const filteredCourses = useMemo(() => {
        return MOCK_COURSES.filter(c => {
            const matchesCategory = category === 'ALL' || c.category === category;
            const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [category, searchQuery]);

    const activePlans = MOCK_PLANS.filter(p => p.progress > 0 && p.progress < 100);

    return (
        <div className="bg-[#F5F5F7] min-h-screen pb-32 animate-in fade-in duration-500">
            {/* Sticky Header with Search & Filters */}
            <div className="sticky top-0 z-20 bg-[#F5F5F7]/95 backdrop-blur-md pb-2 border-b border-gray-200/50">
                <ScreenHeader 
                    title="Academy" 
                    subtitle="MCG Conservatory"
                    rightAction={<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs border border-orange-200">12</div>} // Learning streak or points
                />
                
                <div className="px-4 space-y-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icons.Search />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search drills, plans, lessons..." 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                        {categories.map(cat => (
                            <CategoryPill 
                                key={cat} 
                                label={cat.replace('_', ' ')} 
                                active={category === cat} 
                                onClick={() => setCategory(cat)} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 max-w-7xl mx-auto space-y-8 pt-6">
                
                {/* Continue Learning Section (Only if active plans exist and no search) */}
                {!searchQuery && category === 'ALL' && activePlans.length > 0 && (
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <Text variant="h3">In Progress</Text>
                        </div>
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
                            {activePlans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} onClick={() => onSelectPlan(plan)} compact />
                            ))}
                        </div>
                    </section>
                )}

                {/* Training Plans Grid */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <Text variant="h3">Training Plans</Text>
                        <button className="text-xs font-bold text-orange-600 hover:text-orange-700">View All</button>
                    </div>
                    {filteredPlans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPlans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} onClick={() => onSelectPlan(plan)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">No plans found matching filters.</div>
                    )}
                </section>

                {/* Course Library */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <Text variant="h3">Course Library</Text>
                        <button className="text-xs font-bold text-orange-600 hover:text-orange-700">Browse All</button>
                    </div>
                    <div className="space-y-3">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} onClick={() => {}} />
                        ))}
                        {filteredCourses.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">No courses found matching filters.</div>
                        )}
                    </div>
                </section>

                {/* Quick Drills Section (Horizontal Scroll) */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <Text variant="h3">Quick Drills</Text>
                    </div>
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
                        {MOCK_DRILLS.map(drill => (
                            <div key={drill.id} onClick={() => onSelectDrill(drill)} className="min-w-[160px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="h-24 bg-gray-200 relative">
                                    <img src={drill.thumbnailUrl} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                                        {drill.durationMinutes}m
                                    </div>
                                </div>
                                <div className="p-3">
                                    <Badge variant="neutral" className="mb-1 text-[9px] py-0">{drill.category}</Badge>
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{drill.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

// --- PLAN DETAIL VIEW ---

const PlanDetail: React.FC<{ plan: TrainingPlan; onBack: () => void; onSelectDrill: (d: Drill) => void }> = ({ plan, onBack, onSelectDrill }) => {
    // Determine which drills are in this plan (Mock logic based on IDs)
    const planDrills = MOCK_DRILLS.filter(d => plan.drillIds.includes(d.id));

    return (
        <div className="bg-white min-h-screen animate-in slide-in-from-right duration-300">
            {/* Immersive Header */}
            <div className="relative h-72">
                <img src={plan.thumbnailUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                
                <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start">
                    <button onClick={onBack} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-colors">
                        <Icons.ChevronLeft />
                    </button>
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-colors">
                        <span className="text-lg">⋮</span>
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-orange-500 text-white border-none">{plan.category}</Badge>
                        <span className="text-xs font-bold opacity-80 px-2 py-0.5 bg-white/10 rounded backdrop-blur-sm">{plan.durationLabel}</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase leading-none mb-2">{plan.title}</h1>
                    <p className="text-sm text-gray-300 line-clamp-2 max-w-xl">{plan.description}</p>
                </div>
            </div>
            
            <div className="p-6 max-w-3xl mx-auto">
                {/* Progress Card */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8 flex items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-orange-500" strokeDasharray={`${plan.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        </svg>
                        <span className="absolute text-sm font-bold text-gray-900">{plan.progress}%</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900">Your Progress</h4>
                        <p className="text-xs text-gray-500">2 of {plan.totalDrills} drills completed</p>
                    </div>
                    <Button size="sm" onClick={() => {}}>Resume</Button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Curriculum</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase">{plan.totalDrills} Modules</span>
                </div>
                
                <div className="space-y-3">
                    {planDrills.map((drill, index) => (
                        <div key={drill.id} onClick={() => onSelectDrill(drill)} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {index === 0 ? <Icons.Play /> : index + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">{drill.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-1.5 py-0.5 rounded">{drill.difficulty}</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Icons.Clock /> {drill.durationMinutes} min</span>
                                </div>
                            </div>
                            <div className="text-gray-300 group-hover:text-orange-500 transition-colors"><Icons.ChevronRight /></div>
                        </div>
                    ))}
                    {planDrills.length === 0 && <div className="text-center text-gray-400 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">No drills loaded for this plan.</div>}
                </div>
            </div>
        </div>
    );
};

// --- DRILL DETAIL VIEW ---

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
        <div className="bg-[#111827] min-h-screen text-white flex flex-col animate-in slide-in-from-right duration-300 fixed inset-0 z-50 overflow-y-auto">
            <div className="px-4 py-6 max-w-2xl mx-auto w-full">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                    <Icons.ChevronLeft /> <span className="text-sm font-bold">Back to Plan</span>
                </button>
                
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <Badge variant="warning" className="mb-2 bg-orange-500 text-white border-none">{drill.category}</Badge>
                        <h1 className="text-3xl font-black uppercase leading-tight mb-2">{drill.title}</h1>
                    </div>
                    {/* Difficulty Indicator */}
                    <div className="flex flex-col items-end">
                        <div className="flex gap-0.5 mb-1">
                            {[1,2,3].map(i => <div key={i} className={`w-1.5 h-4 rounded-full ${i <= (drill.difficulty === 'ADVANCED' ? 3 : drill.difficulty === 'INTERMEDIATE' ? 2 : 1) ? 'bg-orange-500' : 'bg-gray-700'}`} />)}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{drill.difficulty}</span>
                    </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-8 border-l-2 border-orange-500 pl-4">{drill.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Duration</div>
                        <div className="font-bold text-lg">{drill.durationMinutes}m</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Goal</div>
                        <div className="font-bold text-lg">{drill.goalCount || 20} {drill.goalUnit || 'Reps'}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-center">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Best</div>
                        <div className="font-bold text-lg text-green-400">{drill.lastScore || '-'}</div>
                    </div>
                </div>

                {generatedVideo ? (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 border border-gray-700 shadow-2xl relative group">
                        <video src={generatedVideo} controls className="w-full h-full" />
                    </div>
                ) : (
                    <div className="mb-8 p-8 bg-gray-800/50 rounded-2xl flex flex-col items-center text-center border-2 border-dashed border-gray-700">
                        <div className="text-4xl mb-3 opacity-50">📹</div>
                        <span className="text-sm font-bold mb-1 text-white">AI Demonstration Available</span>
                        <p className="text-xs text-gray-400 mb-4">Generate a visual guide for this drill using Veo.</p>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-white hover:bg-white/5" onClick={handleGenerateVideo} disabled={isVideoGenerating}>
                            {isVideoGenerating ? 'Generating Video...' : 'Generate Demo'}
                        </Button>
                    </div>
                )}

                <div className="mb-24">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px bg-gray-700 flex-1"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Steps</span>
                        <div className="h-px bg-gray-700 flex-1"></div>
                    </div>
                    <div className="space-y-4">
                        {drill.steps.map((step) => (
                            <div key={step.order} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-600 text-gray-400 flex items-center justify-center font-bold text-xs flex-shrink-0">{step.order}</div>
                                <p className="text-sm text-gray-300 leading-relaxed pt-0.5">{step.text}</p>
                            </div>
                        ))}
                        {drill.steps.length === 0 && <p className="text-sm text-gray-500 italic text-center">Follow the video demonstration for visual instructions.</p>}
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-gray-800 bg-[#111827] sticky bottom-0 safe-area-bottom z-10">
                <div className="max-w-2xl mx-auto">
                    <Button fullWidth variant="primary" size="lg" className="bg-orange-600 text-white hover:bg-orange-500 border-none font-black shadow-lg shadow-orange-900/50" onClick={onStartPractice}>
                        START SESSION
                    </Button>
                </div>
            </div>
        </div>
    );
};
