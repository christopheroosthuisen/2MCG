
import React, { useState } from 'react';
import { COLORS, MOCK_DETAILED_SG_STATS, MOCK_USER_PROFILE } from '../constants';
import { DetailedSGStats } from '../types';
import { Text, Card, Badge, Button } from './UIComponents';

// --- CUSTOM ICONS ---
const Icons = {
    Filter: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Help: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
};

// --- CHART COMPONENTS ---

const SGSparkline: React.FC = () => (
    <div className="h-16 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 20 Q10 22 20 18 T40 25 T60 15 T80 22 T100 18" fill="none" stroke="#E5E7EB" strokeWidth="2" />
            <path d="M0 20 Q10 22 20 18 T40 25 T60 15 T80 22 T100 18" fill="none" stroke="#EC4899" strokeWidth="2" strokeDasharray="100" strokeDashoffset="0" className="animate-[dash_2s_linear]" />
            <circle cx="100" cy="18" r="3" fill="#EC4899" />
        </svg>
    </div>
);

const TerrainChart: React.FC<{ stats: DetailedSGStats }> = ({ stats }) => {
    const data = [
        { label: 'Tee (Par 3\'s)', val: stats.approachByTerrain.tee, shots: '4.9 Shots' },
        { label: 'Fairway', val: stats.approachByTerrain.fairway, shots: '8.1 Shots' },
        { label: 'Rough', val: stats.approachByTerrain.rough, shots: '6.2 Shots' },
        { label: 'Sand', val: stats.approachByTerrain.sand, shots: '0.4 Shots' },
    ];
    
    return (
        <div className="mt-8 mb-4">
            <div className="flex justify-between items-end h-32 relative mb-4 px-4">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
                <span className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 text-[10px] text-gray-400">0</span>
                
                {data.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-center relative h-full">
                        <div className={`w-1.5 rounded-full ${d.val >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                             style={{ 
                                 height: `${Math.abs(d.val) * 40}%`, 
                                 transform: d.val >= 0 ? 'translateY(-50%)' : 'translateY(50%)',
                                 marginTop: d.val >= 0 ? 'auto' : 0,
                                 marginBottom: d.val < 0 ? 'auto' : 0
                             }}
                        ></div>
                        {/* Dot indicator */}
                        <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center">
                {data.map((d, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className={`text-2xl font-bold ${d.val >= 0 ? 'text-green-600' : 'text-red-500'}`}>{d.val}</div>
                        <div className="text-[10px] font-bold text-red-400 uppercase">SG</div>
                        <div className="text-[10px] text-gray-400 mt-1">{d.shots}</div>
                        <div className="h-px w-full bg-gray-200 my-2"></div>
                        <div className="text-[10px] text-gray-500 h-8 leading-tight">{d.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProximityChart: React.FC<{ stats: DetailedSGStats }> = ({ stats }) => {
    return (
        <div className="relative mt-4">
            {/* Y Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-500 font-bold text-right w-16 pr-2 py-2">
                {stats.approachByDistance.map(d => <div key={d.bucket}>{d.bucket}</div>)}
            </div>

            {/* Chart Area */}
            <div className="ml-16 border-l border-dashed border-gray-300 relative h-[280px]">
                {/* X Axis Grid */}
                <div className="absolute top-0 bottom-0 left-[20%] border-r border-dashed border-gray-100"></div>
                <div className="absolute top-0 bottom-0 left-[50%] border-r border-dashed border-gray-100"></div>
                <div className="absolute top-0 bottom-0 left-[80%] border-r border-dashed border-gray-100"></div>

                {stats.approachByDistance.map((d, i) => (
                    <div key={i} className="absolute left-0 w-full flex items-center" style={{ top: `${(i / stats.approachByDistance.length) * 100}%`, height: `${100/stats.approachByDistance.length}%` }}>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center w-full px-2">
                            <span className="text-[10px] text-gray-400 mr-2 w-6">{d.targetProximity}'</span>
                            {/* Proximity Line */}
                            <div className="relative flex-1 h-px bg-gray-400 mr-2">
                                <div className="absolute right-0 -top-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-gray-400 transform rotate-90"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-900 w-6">{d.proximity}'</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-[10px] text-gray-500 font-bold uppercase">
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-300"></span> Target (Prox)</div>
                <div className="flex items-center gap-1"><span className="w-4 h-px bg-gray-900"></span> Avg Proximity</div>
            </div>
        </div>
    );
};

const GIRRadarChart: React.FC<{ stats: DetailedSGStats }> = ({ stats }) => {
    // Simplified visual representation using CSS/SVG
    return (
        <div className="relative w-64 h-64 mx-auto my-6">
            {/* Center Circle (GIR) */}
            <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white z-10 flex flex-col items-center justify-center">
                <div className="text-3xl font-black text-red-500">{stats.girStats.gir}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">GIR ({stats.girStats.gir}%)</div>
                <div className="text-[8px] text-gray-400">0.0 H.I. (56%)</div>
                
                {/* SVG Arc for visual flair */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle cx="64" cy="64" r="58" fill="none" stroke="#FECACA" strokeWidth="4" strokeDasharray="100 300" />
                </svg>
            </div>

            {/* Quadrants */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center">
                <div className="text-2xl font-bold text-gray-700">{stats.girStats.long}</div>
                <div className="text-[10px] text-gray-500">Long (6%)</div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <div className="text-2xl font-bold text-red-500">{stats.girStats.short}</div>
                <div className="text-[10px] text-gray-500">Short (36%)</div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold text-gray-700">{stats.girStats.left}</div>
                <div className="text-[10px] text-gray-500">Left (8%)</div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold text-gray-700">{stats.girStats.right}</div>
                <div className="text-[10px] text-gray-500">Right (11%)</div>
            </div>

            {/* Axis Lines */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%">
                    <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="black" strokeWidth="1" />
                    <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="black" strokeWidth="1" />
                    <line x1="30%" y1="30%" x2="70%" y2="70%" stroke="black" strokeWidth="1" />
                    <line x1="70%" y1="30%" x2="30%" y2="70%" stroke="black" strokeWidth="1" />
                </svg>
            </div>
        </div>
    );
};

// --- VIEW COMPONENTS ---

export const StrokesGainedDashboard: React.FC = () => {
    const [stats] = useState<DetailedSGStats>(MOCK_DETAILED_SG_STATS);
    const [subTab, setSubTab] = useState<'OVERALL' | 'DRIVING' | 'APPROACH' | 'SHORT' | 'PUTTING'>('OVERALL');
    const [approachView, setApproachView] = useState<'TERRAIN' | 'DISTANCE' | 'GIR'>('TERRAIN');

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            
            {/* Sticky Header with Background Image */}
            <div className="relative h-48 bg-gray-900 text-white overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                
                <div className="relative z-10 p-4 pt-8">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className="text-3xl text-green-400">👑</div>
                            <div>
                                <h1 className="text-xl font-bold">Christopher O.</h1>
                                <p className="text-xs text-gray-300">USGA {stats.handicap} H.I. / 6.5K shots / {stats.roundsAnalyzed} rds</p>
                            </div>
                        </div>
                        <button className="p-2 bg-white/10 rounded-full backdrop-blur-md"><Icons.Settings /></button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#1F2937] p-2 flex justify-between items-center text-xs text-gray-300 border-t border-gray-700">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                        Compared to 0.0 H.I. using 25 Round Avg. <Icons.ChevronDown />
                    </div>
                    <Icons.Filter />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white px-2 shadow-sm sticky top-0 z-20 overflow-x-auto hide-scrollbar">
                <div className="flex min-w-max">
                    {['OVERALL', 'DRIVING', 'APPROACH', 'SHORT GAME', 'PUTTING'].map((t) => {
                        const key = t.split(' ')[0] as any;
                        const active = subTab === (key === 'SHORT' ? 'SHORT' : key);
                        return (
                            <button
                                key={t}
                                onClick={() => setSubTab(key === 'SHORT' ? 'SHORT' : key)}
                                className={`py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${active ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {t}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="p-4 space-y-4">
                
                {/* OVERALL VIEW */}
                {subTab === 'OVERALL' && (
                    <Card className="p-6 text-center">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Your Strokes Gained (SG) Breakdown</div>
                        <div className="flex items-baseline justify-center gap-2 mb-1">
                            <span className="text-6xl font-black text-gray-800 tracking-tighter">{stats.overallSG}</span>
                            <span className="text-sm font-bold text-red-500">▼ {Math.abs(stats.overallTrend)}</span>
                        </div>
                        <div className="text-xs text-gray-400 font-bold uppercase mb-6">SG / Round</div>

                        <p className="text-xs text-gray-600 mb-8 px-4 leading-relaxed">
                            You give up 13.7 strokes per round compared to a 0.0. Your <span className="text-red-500 font-bold">overall game has declined 0.3 strokes</span> over your last 25 rounds.
                        </p>

                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {[
                                { label: 'Driving', val: stats.sgBreakdown.driving, color: 'bg-gray-400' },
                                { label: 'Approach', val: stats.sgBreakdown.approach, color: 'bg-red-400' },
                                { label: 'Short', val: stats.sgBreakdown.short, color: 'bg-gray-400' },
                                { label: 'Putting', val: stats.sgBreakdown.putting, color: 'bg-gray-400' },
                            ].map((s) => (
                                <div key={s.label} className="flex flex-col items-center">
                                    <div className={`w-full h-8 ${s.color} rounded-sm mb-2`}></div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase">{s.label}</div>
                                    <div className={`text-xl font-bold ${s.val < -2 ? 'text-red-500' : 'text-gray-800'}`}>{s.val}</div>
                                    <div className="text-[9px] text-gray-400">SG &gt;</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* APPROACH VIEW */}
                {subTab === 'APPROACH' && (
                    <>
                        <div className="flex justify-center gap-4 mb-4">
                            <button onClick={() => setApproachView('TERRAIN')} className={`text-xs font-bold uppercase pb-1 border-b-2 ${approachView === 'TERRAIN' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}>Terrain</button>
                            <button onClick={() => setApproachView('DISTANCE')} className={`text-xs font-bold uppercase pb-1 border-b-2 ${approachView === 'DISTANCE' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}>Distance</button>
                            <button onClick={() => setApproachView('GIR')} className={`text-xs font-bold uppercase pb-1 border-b-2 ${approachView === 'GIR' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}>GIR %</button>
                        </div>

                        {approachView === 'TERRAIN' && (
                            <Card className="p-6 text-center">
                                <Text variant="h3" className="mb-2">Approach by Terrain</Text>
                                <p className="text-xs text-gray-500 px-4 mb-6">
                                    Here's how your <span className="text-blue-600 font-bold">{stats.sgBreakdown.approach} Strokes Gained Approach</span> breaks down across various hole terrains.
                                </p>
                                <TerrainChart stats={stats} />
                                <div className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                                    You're <span className="text-red-500 font-bold">losing {Math.abs(stats.approachByTerrain.tee)} strokes</span> on your tee shots.
                                    <Icons.Help />
                                </div>
                            </Card>
                        )}

                        {approachView === 'DISTANCE' && (
                            <Card className="p-6 text-center">
                                <Text variant="h3" className="mb-2">Approach By Pin Distance</Text>
                                <p className="text-xs text-gray-500 px-4 mb-6">
                                    Here's how your <span className="text-blue-600 font-bold">{stats.sgBreakdown.approach} Strokes Gained Approach</span> breaks down across various pin distances.
                                </p>
                                
                                <div className="flex justify-center gap-6 mb-4 border-b border-gray-200 pb-2">
                                    <button className="text-xs font-bold text-gray-400 hover:text-gray-600">SGA</button>
                                    <button className="text-xs font-bold text-gray-400 hover:text-gray-600">GIR %</button>
                                    <button className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 -mb-2.5 pb-2">Proximity</button>
                                </div>

                                <ProximityChart stats={stats} />
                            </Card>
                        )}

                        {approachView === 'GIR' && (
                            <Card className="p-6 text-center">
                                <Text variant="h3" className="mb-6">Greens in Regulation</Text>
                                <GIRRadarChart stats={stats} />
                                
                                <div className="mt-8 text-left">
                                    <Text variant="h4" className="text-xs uppercase font-bold text-gray-500 mb-4 text-center">Average Distance to Pin</Text>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>GIR Approaches</span>
                                                <span className="text-red-500 font-bold">{stats.avgDistanceToPin.gir} ft</span>
                                            </div>
                                            <div className="relative h-1.5 bg-gray-100 rounded-full">
                                                <div className="absolute top-0 h-full bg-red-400 rounded-full" style={{ width: '60%' }}></div>
                                                <div className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-400" style={{ left: '50%' }}></div>
                                                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">{stats.avgDistanceToPin.targetGir} ft</div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>All Approaches</span>
                                                <span className="text-red-500 font-bold">{stats.avgDistanceToPin.all} ft</span>
                                            </div>
                                            <div className="relative h-1.5 bg-gray-100 rounded-full">
                                                <div className="absolute top-0 h-full bg-red-400 rounded-full" style={{ width: '90%' }}></div>
                                                <div className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-400" style={{ left: '70%' }}></div>
                                                <div className="absolute top-6 left-[70%] -translate-x-1/2 text-[10px] text-gray-400">{stats.avgDistanceToPin.targetAll} ft</div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-8 text-center px-4">
                                        You're <span className="text-red-500 font-bold">18 ft further from the pin</span> on average for All Approaches than your 0.0 H.I. target.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {/* PLACEHOLDERS FOR OTHER TABS */}
                {(subTab === 'DRIVING' || subTab === 'SHORT' || subTab === 'PUTTING') && (
                    <Card className="p-6 text-center">
                        <Text variant="h3">{subTab} Analysis</Text>
                        <p className="text-xs text-gray-500 mt-2">Detailed breakdown coming soon.</p>
                    </Card>
                )}

                {/* INSIGHTS SECTION */}
                <div className="mt-8">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Text variant="h2" className="text-xl">Top 3 Insights</Text>
                        <Icons.Help />
                    </div>
                    
                    <div className="flex border-b border-gray-200 mb-4">
                        <button className="flex-1 pb-3 text-sm font-bold text-gray-900 border-b-2 border-gray-900">Opportunities</button>
                        <button className="flex-1 pb-3 text-sm font-bold text-gray-400 border-b-2 border-transparent hover:text-gray-600">Strengths</button>
                    </div>

                    <div className="space-y-3">
                        {stats.opportunities.map((opp, i) => (
                            <Card key={i} variant="outlined" className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                                <span className="font-bold text-sm text-gray-800">{opp}</span>
                                <span className="text-gray-400">›</span>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
