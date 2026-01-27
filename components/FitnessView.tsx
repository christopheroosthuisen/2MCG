
import React from 'react';
import { Text, Card, Badge, Button, ProgressBar } from './UIComponents';
import { COLORS } from '../constants';
import { db } from '../services/dataService';

const Icons = {
    Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
};

export const FitnessView: React.FC = () => {
    const workouts = db.getWorkouts();

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            {/* Header */}
            <div className="px-1 pt-6 pb-4">
                <Text variant="caption" className="uppercase font-bold tracking-widest text-orange-500 mb-1">Performance</Text>
                <Text variant="h1" className="mb-2">Golf Fitness</Text>
                <Text variant="body" color="gray">Train your body to swing faster and play pain-free.</Text>
            </div>

            {/* Featured Program */}
            <section className="mb-8 px-1">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <Badge variant="warning" className="mb-2 bg-orange-500 text-white border-none">Trending</Badge>
                        <Text variant="h2" color="white" className="mb-1">30-Day Power Project</Text>
                        <Text color="gray-300" className="text-sm mb-4">Add 10mph to your swing speed with this rotational power program.</Text>
                        <Button variant="primary" size="sm">Start Program</Button>
                    </div>
                </div>
            </section>

            {/* Workout Library */}
            <section className="px-1">
                <div className="flex justify-between items-end mb-4">
                    <Text variant="h3">Workouts</Text>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {workouts.map(workout => (
                        <div key={workout.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:border-orange-200 transition-colors" onClick={() => db.completeWorkout(workout.id)}>
                            <div className="w-24 h-24 rounded-xl bg-gray-200 flex-shrink-0 relative overflow-hidden">
                                <img src={workout.thumbnailUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
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
    );
};
