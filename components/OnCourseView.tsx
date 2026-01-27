
import React, { useState } from 'react';
import { Text, Card, Button, Badge } from './UIComponents';
import { COLORS } from '../constants';
import { db } from '../services/dataService';
import { OnCourseRound } from '../types';

const Icons = {
    MapPin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    Flag: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>,
    Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Wind: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>,
    Target: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
};

export const OnCourseView: React.FC = () => {
    const [mode, setMode] = useState<'PLAY' | 'HISTORY'>('PLAY');
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return <ActiveRoundView onEndRound={() => setIsPlaying(false)} />;
    }

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            <div className="px-1 pt-6 sticky top-0 bg-[#F5F5F7] z-10 pb-4">
                <Text variant="caption" className="uppercase font-bold tracking-widest text-orange-500 mb-1">On Course</Text>
                <div className="flex justify-between items-end mb-4">
                    <Text variant="h1" className="mb-0">Play Golf</Text>
                </div>
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                    <button 
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'PLAY' ? 'bg-green-600 text-white shadow' : 'text-gray-500'}`}
                        onClick={() => setMode('PLAY')}
                    >
                        Play Round
                    </button>
                    <button 
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'HISTORY' ? 'bg-green-600 text-white shadow' : 'text-gray-500'}`}
                        onClick={() => setMode('HISTORY')}
                    >
                        Round History
                    </button>
                </div>
            </div>

            {mode === 'PLAY' && (
                <div className="space-y-6 px-1">
                    <Card variant="filled" className="bg-gradient-to-br from-green-800 to-green-900 text-white overflow-hidden relative min-h-[200px] flex flex-col justify-center items-center text-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
                        <div className="relative z-10 p-6">
                            <Text variant="h2" color="white" className="mb-2">Start New Round</Text>
                            <Text color="gray-300" className="mb-6 max-w-xs mx-auto text-sm">Use GPS, track shots, and get AI caddie advice in real-time.</Text>
                            <Button variant="primary" size="lg" onClick={() => setIsPlaying(true)}>Tee Off</Button>
                        </div>
                    </Card>

                    <Text variant="h3">Nearby Courses</Text>
                    <div className="space-y-3">
                        {['Pebble Beach Golf Links', 'Spyglass Hill', 'Spanish Bay'].map((course, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-green-500 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <Icons.Flag />
                                    </div>
                                    <div>
                                        <Text variant="h4" className="text-sm font-bold">{course}</Text>
                                        <Text variant="caption" className="text-xs">{(i * 1.5 + 2.1).toFixed(1)} miles away</Text>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs h-8">Select</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'HISTORY' && <RoundHistory />}
        </div>
    );
};

const ActiveRoundView: React.FC<{ onEndRound: () => void }> = ({ onEndRound }) => {
    const [currentHole, setCurrentHole] = useState(1);
    const [distToPin, setDistToPin] = useState(384);
    const [score, setScore] = useState(0);

    return (
        <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col">
            {/* Top Bar */}
            <div className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md safe-area-top">
                <button onClick={onEndRound} className="text-gray-300 hover:text-white text-sm font-bold">End Round</button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400">Pebble Beach</span>
                    <span className="text-lg font-bold">Hole {currentHole} <span className="text-gray-500 font-normal">|</span> Par 4</span>
                </div>
                <div className="bg-green-600 px-3 py-1 rounded-full text-xs font-bold">{score > 0 ? '+' : ''}{score === 0 ? 'E' : score}</div>
            </div>

            {/* GPS View (Simulated) */}
            <div className="flex-1 relative bg-gray-800 overflow-hidden">
                {/* Simulated Map Visuals */}
                <div className="absolute inset-0 bg-[#1e293b]">
                     <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-96 bg-green-800 rounded-full opacity-50 transform -rotate-12 blur-xl"></div>
                     <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-500/30 rounded-full blur-lg"></div>
                     {/* Fairway */}
                     <div className="absolute top-0 bottom-0 left-1/4 right-1/4 bg-green-900/30 border-l border-r border-green-800/50"></div>
                </div>

                {/* Pin Marker */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg mb-1">{distToPin}y</div>
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-xl animate-bounce"></div>
                </div>

                {/* Player Marker */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-xl pulse-ring"></div>
                </div>

                {/* Caddie Suggestion Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 max-w-[160px]">
                    <div className="text-[10px] text-orange-400 font-bold uppercase mb-1">Caddie Tip</div>
                    <div className="text-xs font-medium leading-snug">Plays like {distToPin + 12}y uphill. Wind hurting.</div>
                    <div className="mt-2 flex items-center gap-2">
                        <Badge variant="neutral" className="bg-white text-black font-bold">Driver</Badge>
                        <span className="text-[10px] text-gray-400">92% Conf</span>
                    </div>
                </div>

                {/* Floating Action Button */}
                <button className="absolute bottom-6 right-6 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-transform">
                    <Icons.Plus />
                </button>
            </div>

            {/* Bottom Controls */}
            <div className="bg-gray-900 p-4 pb-8 border-t border-gray-800 safe-area-bottom">
                <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="text-center">
                        <div className="text-gray-400 text-[10px] uppercase font-bold">Front</div>
                        <div className="text-xl font-bold">{distToPin - 15}</div>
                     </div>
                     <div className="text-center">
                        <div className="text-green-500 text-[10px] uppercase font-bold">Center</div>
                        <div className="text-3xl font-black text-white">{distToPin}</div>
                     </div>
                     <div className="text-center">
                        <div className="text-gray-400 text-[10px] uppercase font-bold">Back</div>
                        <div className="text-xl font-bold">{distToPin + 12}</div>
                     </div>
                </div>
                
                <div className="flex gap-2">
                    <Button fullWidth variant="secondary" className="bg-gray-800 text-white border-gray-700" onClick={() => {
                        setScore(s => s + 1);
                        if(currentHole < 18) {
                            setCurrentHole(h => h + 1);
                            setDistToPin(Math.floor(Math.random() * 200) + 150);
                        } else {
                            db.addRound({
                                id: crypto.randomUUID(),
                                courseName: 'Pebble Beach',
                                date: new Date(),
                                score: 72 + score,
                                par: 72,
                                holesPlayed: 18,
                                fairwaysHit: 10,
                                greensInRegulation: 12,
                                putts: 30,
                                isCompleted: true
                            });
                            onEndRound();
                        }
                    }}>Hole Out</Button>
                    <Button fullWidth variant="primary" onClick={() => {}}>Track Shot</Button>
                </div>
            </div>
        </div>
    );
};

const RoundHistory: React.FC = () => {
    const rounds = db.getRounds();

    return (
        <div className="space-y-4 px-1">
            {rounds.map(round => (
                <Card key={round.id} className="p-4 border-l-4 border-l-green-600">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <Text variant="h3" className="text-base">{round.courseName}</Text>
                            <Text variant="caption">{round.date.toLocaleDateString()}</Text>
                        </div>
                        <div className="text-right">
                            <Text variant="h2" className={`leading-none ${round.score <= round.par ? 'text-green-600' : 'text-gray-900'}`}>{round.score}</Text>
                            <Text variant="caption" className="text-[10px] uppercase font-bold">{round.score - round.par > 0 ? `+${round.score - round.par}` : 'E'}</Text>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-xl">
                        <div className="text-center">
                            <div className="text-[10px] text-gray-400 font-bold">FIR</div>
                            <div className="font-bold text-gray-800">{round.fairwaysHit}/14</div>
                        </div>
                        <div className="text-center border-l border-gray-200">
                            <div className="text-[10px] text-gray-400 font-bold">GIR</div>
                            <div className="font-bold text-gray-800">{round.greensInRegulation}/18</div>
                        </div>
                        <div className="text-center border-l border-gray-200">
                            <div className="text-[10px] text-gray-400 font-bold">Putts</div>
                            <div className="font-bold text-gray-800">{round.putts}</div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
