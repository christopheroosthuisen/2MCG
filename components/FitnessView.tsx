
import React, { useState, useEffect } from 'react';
import { ScreenHeader, Card, Button, ProgressBar, Badge, Text } from './UIComponents';
import { COLORS } from '../constants';
import { db } from '../services/dataService';

const Icons = {
    ArrowLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
};

// --- TYPES ---
interface WarmupExercise {
    id: string;
    name: string;
    description: string;
    duration: number; 
    icon: string;
}

interface WarmupRoutine {
    id: string;
    name: string;
    duration: number;
    exercises: WarmupExercise[];
    color: string;
}

const EXERCISES: WarmupExercise[] = [
    { id: '1', name: 'Hip Circles', description: 'Rotate hips in wide circles', duration: 30, icon: '🔄' },
    { id: '2', name: 'Arm Swings', description: 'Cross chest dynamic stretch', duration: 30, icon: '💪' },
    { id: '3', name: 'Torso Twists', description: 'Club behind back rotations', duration: 45, icon: '🌪️' },
    { id: '4', name: 'Leg Swings', description: 'Forward and back dynamic', duration: 30, icon: '🦵' },
    { id: '5', name: 'Wrist Mob', description: 'Wrist rolls and flexes', duration: 20, icon: '🤲' },
    { id: '6', name: 'Squats', description: 'Bodyweight squats for activation', duration: 45, icon: '🏋️' },
];

const ROUTINES: WarmupRoutine[] = [
    { id: 'r1', name: 'Quick Tee Off', duration: 5, exercises: [EXERCISES[0], EXERCISES[1], EXERCISES[2]], color: 'bg-orange-500' },
    { id: 'r2', name: 'Full Body Prep', duration: 10, exercises: EXERCISES, color: 'bg-blue-600' },
    { id: 'r3', name: 'Mobility Focus', duration: 8, exercises: [EXERCISES[0], EXERCISES[2], EXERCISES[5]], color: 'bg-green-600' },
];

// --- COMPONENTS ---

const RoutinePlayer: React.FC<{ routine: WarmupRoutine; onComplete: () => void; onCancel: () => void }> = ({ routine, onComplete, onCancel }) => {
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(routine.exercises[0].duration);
    const [isPaused, setIsPaused] = useState(false);

    const currentEx = routine.exercises[index];

    useEffect(() => {
        if (isPaused) return;
        
        if (timeLeft <= 0) {
            if (index < routine.exercises.length - 1) {
                setIndex(i => i + 1);
                setTimeLeft(routine.exercises[index + 1].duration);
            } else {
                onComplete();
            }
            return;
        }

        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isPaused, index]);

    const progress = ((currentEx.duration - timeLeft) / currentEx.duration) * 100;

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="p-4 flex justify-between items-center">
                <button onClick={onCancel} className="text-gray-500 font-bold">Exit</button>
                <div className="font-bold text-gray-900">{routine.name}</div>
                <div className="w-8"></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-8xl mb-8 animate-bounce">{currentEx.icon}</div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">{currentEx.name}</h2>
                <p className="text-gray-500 mb-12 text-lg">{currentEx.description}</p>

                {/* Circular Timer */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="128" cy="128" r="120" stroke="#F3F4F6" strokeWidth="12" fill="none" />
                        <circle 
                            cx="128" cy="128" r="120" 
                            stroke={COLORS.primary} strokeWidth="12" fill="none"
                            strokeLinecap="round"
                            strokeDasharray={754}
                            strokeDashoffset={754 - (754 * progress) / 100}
                            className="transition-all duration-1000 linear"
                        />
                    </svg>
                    <div className="absolute text-6xl font-black text-gray-900">{timeLeft}</div>
                </div>

                <div className="flex gap-4 w-full max-w-xs">
                    <Button fullWidth variant={isPaused ? 'primary' : 'outline'} onClick={() => setIsPaused(!isPaused)}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button fullWidth variant="ghost" onClick={() => setTimeLeft(0)}>Skip</Button>
                </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>Exercise {index + 1} of {routine.exercises.length}</span>
                    <span>Next: {routine.exercises[index + 1]?.name || 'Finish'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${((index) / routine.exercises.length) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export const FitnessView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    const workouts = db.getWorkouts();

    return (
        <div className="pb-32 animate-in fade-in duration-500 bg-[#F5F5F7]">
            <ScreenHeader 
                title="Golf Fitness"
                subtitle="Performance"
                leftAction={onBack && (
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                        <Icons.ArrowLeft />
                    </button>
                )}
            />
            
            <div className="px-4">
                <Text variant="body" className="mb-4 text-gray-600">Train your body to swing faster and play pain-free.</Text>

                {/* Featured Program */}
                <section className="mb-8">
                    <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group cursor-pointer transform transition-transform hover:scale-[1.02]">
                        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                            <Badge variant="warning" className="mb-2 bg-orange-500 text-white border-none">Trending</Badge>
                            <Text variant="h2" color="white" className="mb-1">30-Day Power Project</Text>
                            <Text color="white" className="text-sm mb-4 text-gray-300">Add 10mph to your swing speed with this rotational power program.</Text>
                            <Button variant="primary" size="sm">Start Program</Button>
                        </div>
                    </div>
                </section>

                {/* Workout Library */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <Text variant="h3">Workouts</Text>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {workouts.map(workout => (
                            <div key={workout.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:border-orange-200 transition-colors group" onClick={() => db.completeWorkout(workout.id)}>
                                <div className="w-24 h-24 rounded-xl bg-gray-200 flex-shrink-0 relative overflow-hidden">
                                    <img src={workout.thumbnailUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <Icons.Play />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant="neutral" className="text-[10px]">{workout.category}</Badge>
                                        {workout.completed && <Badge variant="success" className="bg-green-100 text-green-700"><Icons.Check /> Done</Badge>}
                                    </div>
                                    <Text variant="h4" className="text-sm font-bold mb-1">{workout.title}</Text>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Icons.Clock /> {workout.duration} min</span>
                                        <span>•</span>
                                        <span className="font-bold text-gray-400 uppercase">{workout.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
