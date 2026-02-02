
import React, { useState } from 'react';
import { COLORS, MOCK_FRIENDS, MOCK_TOURNAMENTS } from '../constants';
import { GolfFriend, CommunityPost, CoachProfile, Tournament } from '../types';
import { ScreenHeader, Button, Card, Badge, Tabs } from './UIComponents';
import { db } from '../services/dataService';

const Icons = {
    Heart: ({ filled }: { filled: boolean }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? COLORS.error : "none"} stroke={filled ? COLORS.error : "currentColor"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
    MessageCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
    Share: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Verified: () => <svg width="16" height="16" viewBox="0 0 24 24" fill={COLORS.info} stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>,
    Trophy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8m-4-9v9m-4.866-9A6.977 6.977 0 0 1 4 12c0-3.866 3.582-7 8-7s8 3.134 8 7a6.977 6.977 0 0 1-2.134 5"></path><path d="M16 3h5v5"></path><path d="M4 3h5v5"></path></svg>,
    Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
};

// --- SUB-COMPONENTS ---

const FeedPost: React.FC<{ post: CommunityPost }> = ({ post }) => {
    const isCoach = post.author.type === 'COACH';
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={post.author.avatarUrl} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                        {isCoach && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><Icons.Verified /></div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-gray-900">{post.author.name}</span>
                            {post.author.badge && <Badge variant={isCoach ? 'warning' : 'neutral'} className="text-[9px] px-1.5 py-0">{post.author.badge}</Badge>}
                        </div>
                        <span className="text-xs text-gray-500">{post.type.replace('_', ' ')} • 2h ago</span>
                    </div>
                </div>
            </div>

            {/* Content Media */}
            {post.mediaUrl && (
                <div className="relative aspect-video bg-gray-900 group cursor-pointer">
                    <img src={post.author.avatarUrl} className="w-full h-full object-cover opacity-80 blur-sm" /> {/* Mock thumb */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                            <Icons.Play />
                        </div>
                    </div>
                    {post.type === 'ACHIEVEMENT' && (
                        <div className="absolute top-4 right-4">
                            <Badge variant="warning" className="text-xs shadow-lg">New PR 🏆</Badge>
                        </div>
                    )}
                </div>
            )}

            {/* Content Text */}
            <div className="p-4">
                <p className="text-sm text-gray-800 leading-relaxed mb-3">
                    {post.type === 'COACH_TIP' && <span className="font-bold text-orange-600 mr-2">PRO TIP:</span>}
                    {post.content}
                </p>
                
                {/* Metadata Card */}
                {post.metadata && (
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-4 mb-3">
                        {post.metadata.score && (
                            <div><div className="text-[10px] text-gray-500 font-bold uppercase">Score</div><div className="font-black text-gray-900">{post.metadata.score}</div></div>
                        )}
                        {post.metadata.handicap && (
                            <div><div className="text-[10px] text-gray-500 font-bold uppercase">HCP</div><div className="font-black text-gray-900">{post.metadata.handicap}</div></div>
                        )}
                        {post.metadata.club && (
                            <div><div className="text-[10px] text-gray-500 font-bold uppercase">Club</div><div className="font-bold text-gray-900">{post.metadata.club}</div></div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors" onClick={() => db.likePost(post.id)}>
                            <Icons.Heart filled={post.isLiked} />
                            <span className="text-xs font-bold">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                            <Icons.MessageCircle />
                            <span className="text-xs font-bold">{post.comments}</span>
                        </button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><Icons.Share /></button>
                </div>
            </div>
        </div>
    );
};

const CoachBookingCard: React.FC<{ coach: CoachProfile; onBook: () => void }> = ({ coach, onBook }) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
            <div className="relative flex-shrink-0">
                <img src={coach.avatarUrl} className="w-20 h-20 rounded-xl object-cover bg-gray-200" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    ⭐ {coach.rating}
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900">{coach.name}</h4>
                        <span className="text-orange-600 font-bold text-xs">{coach.rate} 🪙</span>
                    </div>
                    <p className="text-xs text-gray-500">{coach.title}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="neutral" className="text-[9px] py-0">{coach.specialty}</Badge>
                        <Badge variant="info" className="text-[9px] py-0">{coach.tier}</Badge>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="h-8 text-[10px] px-2 flex-1">Profile</Button>
                    <Button size="sm" variant="primary" className="h-8 text-[10px] px-2 flex-1" onClick={onBook}>Book</Button>
                </div>
            </div>
        </div>
    );
};

const LeaderboardRow: React.FC<{ rank: number; name: string; score: string | number; trend?: 'UP' | 'DOWN' | 'SAME'; avatar?: string; isUser?: boolean }> = ({ rank, name, score, trend, avatar, isUser }) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${isUser ? 'bg-orange-50 border border-orange-100' : 'bg-white border-b border-gray-50 last:border-0'}`}>
        <div className={`w-6 text-center font-bold text-sm ${rank <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>{rank}</div>
        <img src={avatar || "https://via.placeholder.com/40"} className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="flex-1 font-bold text-sm text-gray-800">{name} {isUser && '(You)'}</div>
        <div className="text-right">
            <div className="font-black text-gray-900">{score}</div>
            {trend && <div className={`text-[9px] font-bold ${trend === 'UP' ? 'text-green-500' : trend === 'DOWN' ? 'text-red-500' : 'text-gray-400'}`}>{trend === 'SAME' ? '-' : trend === 'UP' ? '▲' : '▼'}</div>}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const SocialHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'FEED' | 'COACHES' | 'COMPETE' | 'INBOX'>('FEED');
    const [selectedCoach, setSelectedCoach] = useState<CoachProfile | null>(null);
    
    // Data Hooks
    const feed = db.getCommunityFeed();
    const coaches = db.getCoaches();
    const user = db.getUser();

    const handleBook = (coach: CoachProfile) => {
        // Simple mock booking flow
        const slot = coach.availableSlots?.[0] || 'Next Available';
        if (confirm(`Book session with ${coach.name} for ${coach.rate} credits?`)) {
            const success = db.bookCoach(coach.id, slot);
            if (success) alert('Booking Confirmed!');
            else alert('Insufficient Credits');
        }
    };

    return (
        <div className="bg-[#F5F5F7] min-h-screen pb-24 animate-in fade-in duration-300">
            {/* Consolidated Sticky Header */}
            <div className="sticky top-0 z-20 bg-[#F5F5F7]/95 backdrop-blur-md">
                <ScreenHeader 
                    title={activeTab === 'FEED' ? 'Clubhouse' : activeTab === 'COACHES' ? 'Find a Pro' : activeTab === 'COMPETE' ? 'Leaderboards' : 'Messages'} 
                    subtitle="Community" 
                    sticky={false} // Handled by parent
                    rightAction={
                        activeTab === 'COACHES' ? (
                            <div className="bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold border border-gray-100 flex items-center gap-1">
                                <span>🪙</span> {user.credits}
                            </div>
                        ) : null
                    }
                />
                <div className="px-4 pb-2">
                    <Tabs 
                        tabs={['FEED', 'COACHES', 'COMPETE', 'INBOX']} 
                        activeTab={activeTab} 
                        onTabChange={(t) => setActiveTab(t as any)} 
                    />
                </div>
            </div>

            <div className="px-4 pt-2">
                {activeTab === 'FEED' && (
                    <div className="space-y-4 pb-8 max-w-xl mx-auto">
                        {feed.map(post => <FeedPost key={post.id} post={post} />)}
                    </div>
                )}
                
                {activeTab === 'COACHES' && (
                    <div className="space-y-4 max-w-xl mx-auto">
                        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 border-none mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Get Analysis</h3>
                                    <p className="text-xs text-gray-300">Send your swing to a pro for feedback.</p>
                                </div>
                                <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">Upload</Button>
                            </div>
                        </Card>
                        
                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar mb-2">
                            {['All', 'Full Swing', 'Putting', 'Short Game', 'Mental'].map(cat => (
                                <button key={cat} className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-600 border border-gray-200 whitespace-nowrap">{cat}</button>
                            ))}
                        </div>

                        <div className="space-y-3 pb-8">
                            {coaches.map(coach => (
                                <CoachBookingCard key={coach.id} coach={coach} onBook={() => handleBook(coach)} />
                            ))}
                        </div>
                    </div>
                )}
                
                {activeTab === 'COMPETE' && (
                    <div className="space-y-6 max-w-xl mx-auto">
                        <Card className="p-0 overflow-hidden">
                            <div className="bg-orange-500 p-4 text-white">
                                <h3 className="font-bold">Global Ranking</h3>
                                <p className="text-xs opacity-90">Based on Handicap & Activity</p>
                            </div>
                            <div className="p-4">
                                <LeaderboardRow rank={1} name="Mike Johnson" score="+2.1" trend="UP" />
                                <LeaderboardRow rank={2} name="Sarah Davis" score="+1.8" trend="SAME" />
                                <LeaderboardRow rank={3} name="Tom Wilson" score="0.5" trend="DOWN" />
                                <LeaderboardRow rank={42} name={user.name} score={user.swingDNA.handicap} trend="UP" isUser avatar={user.avatarUrl} />
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 flex flex-col items-center text-center">
                                <div className="text-3xl mb-2">🚀</div>
                                <h4 className="font-bold text-sm">Longest Drive</h4>
                                <div className="text-2xl font-black text-gray-900 mt-1">342y</div>
                                <p className="text-[10px] text-gray-500">Held by Jason D.</p>
                            </Card>
                            <Card className="p-4 flex flex-col items-center text-center">
                                <div className="text-3xl mb-2">🐦</div>
                                <h4 className="font-bold text-sm">Birdie Streak</h4>
                                <div className="text-2xl font-black text-gray-900 mt-1">5</div>
                                <p className="text-[10px] text-gray-500">Held by You!</p>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'INBOX' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center max-w-xl mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">💬</div>
                        <h3 className="font-bold text-gray-900 mb-2">No Messages Yet</h3>
                        <p className="text-sm text-gray-500 max-w-xs">Book a coach to start a conversation or connect with friends.</p>
                        <Button className="mt-6" onClick={() => setActiveTab('COACHES')}>Find a Coach</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
