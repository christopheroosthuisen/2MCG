import { MOCK_USER_PROFILE, MOCK_RECENT_SWINGS, MOCK_SESSIONS, MOCK_GOALS, MOCK_COURSES, MOCK_DRILLS, MOCK_BAG_SLOTS } from '../constants';
import { UserProfile, SwingAnalysis, TrackManSession, PracticeGoal, BagShotSlot, Course, Drill, ActionLog, Club } from '../types';

class DataService {
    private user: UserProfile;
    private swings: SwingAnalysis[];
    private sessions: TrackManSession[];
    private goals: PracticeGoal[];
    private bagSlots: BagShotSlot[];
    private courses: Course[];
    private drills: Drill[];
    private actionLog: ActionLog[];

    private readonly STORAGE_KEY = 'mcg_app_data_v1';

    constructor() {
        // Try to load from local storage
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                this.user = parsed.user;
                // Restore Dates (JSON serializes dates to strings)
                this.swings = parsed.swings.map((s: any) => ({ ...s, date: new Date(s.date) }));
                this.sessions = parsed.sessions.map((s: any) => ({ ...s, date: new Date(s.date) }));
                this.goals = parsed.goals.map((g: any) => ({ ...g, deadline: g.deadline ? new Date(g.deadline) : undefined }));
                this.bagSlots = parsed.bagSlots.map((b: any) => ({ ...b, masteryDate: b.masteryDate ? new Date(b.masteryDate) : undefined }));
                this.actionLog = parsed.actionLog.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) }));
                this.courses = parsed.courses || [...MOCK_COURSES]; // Fallback if adding new mock data structure
                this.drills = parsed.drills || [...MOCK_DRILLS];
            } catch (e) {
                console.error("Failed to parse saved data, resetting to defaults", e);
                this.resetToDefaults();
            }
        } else {
            this.resetToDefaults();
        }
    }

    private resetToDefaults() {
        this.user = { ...MOCK_USER_PROFILE };
        this.swings = [...MOCK_RECENT_SWINGS];
        this.sessions = [...MOCK_SESSIONS];
        this.goals = [...MOCK_GOALS];
        this.bagSlots = [...MOCK_BAG_SLOTS];
        this.courses = [...MOCK_COURSES];
        this.drills = [...MOCK_DRILLS];
        this.actionLog = [];
        this.save();
    }

    private save() {
        const data = {
            user: this.user,
            swings: this.swings,
            sessions: this.sessions,
            goals: this.goals,
            bagSlots: this.bagSlots,
            courses: this.courses,
            drills: this.drills,
            actionLog: this.actionLog
        };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save to localStorage", e);
        }
    }

    // --- GETTERS ---
    getUser() { return this.user; }
    getSwings() { return this.swings.sort((a, b) => b.date.getTime() - a.date.getTime()); }
    getSessions() { return this.sessions.sort((a, b) => b.date.getTime() - a.date.getTime()); }
    getGoals() { return this.goals; }
    getBagSlots() { return this.bagSlots; }
    getCourses() { return this.courses; }
    getDrills() { return this.drills; }
    getRecentActions() { return this.actionLog.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20); }

    // --- ACTIONS ---

    addSwing(swing: SwingAnalysis) {
        this.swings.unshift(swing);
        this.logAction('ADD_SWING', { id: swing.id, club: swing.clubUsed });
        this.save();
    }

    addSession(session: TrackManSession) {
        this.sessions.unshift(session);
        this.logAction('ADD_SESSION', { id: session.id, shots: session.shotsHit });
        this.save();
    }

    updateBagSlot(slotId: string, updates: Partial<BagShotSlot>) {
        const index = this.bagSlots.findIndex(s => s.id === slotId);
        if (index !== -1) {
            const wasMastered = this.bagSlots[index].isMastered;
            this.bagSlots[index] = { ...this.bagSlots[index], ...updates };
            
            // Log if mastered status changed to true
            if (updates.isMastered && !wasMastered) {
                 this.bagSlots[index].masteryDate = new Date();
                 this.logAction('MASTER_SHOT', { title: this.bagSlots[index].title });
            }
            this.save();
        }
    }

    addBagSlot(slot: BagShotSlot) {
        this.bagSlots.push(slot);
        this.save();
    }

    updateGoal(goalId: string, updates: Partial<PracticeGoal>) {
        const index = this.goals.findIndex(g => g.id === goalId);
        if (index !== -1) {
            this.goals[index] = { ...this.goals[index], ...updates };
            if (updates.progress !== undefined) {
                this.logAction('UPDATE_GOAL', { title: this.goals[index].title, progress: updates.progress });
            }
            this.save();
        }
    }

    // New: Update User Profile
    updateUser(updates: Partial<UserProfile>) {
        this.user = { ...this.user, ...updates };
        this.save();
    }

    // New: Update Bag (Equipment)
    updateBag(bag: Club[]) {
        this.user.bag = bag;
        this.save();
    }

    // New: Complete Lesson
    completeLesson(courseId: string, lessonId: string) {
        const courseIndex = this.courses.findIndex(c => c.id === courseId);
        if (courseIndex === -1) return;

        let lessonFound = false;
        let lessonTitle = '';

        // Find and update lesson
        this.courses[courseIndex].modules.forEach(mod => {
            const lesson = mod.lessons.find(l => l.id === lessonId);
            if (lesson && !lesson.completed) {
                lesson.completed = true;
                lessonTitle = lesson.title;
                lessonFound = true;
            }
        });

        if (lessonFound) {
            // Recalculate Course Progress
            const allLessons = this.courses[courseIndex].modules.flatMap(m => m.lessons);
            const completedCount = allLessons.filter(l => l.completed).length;
            this.courses[courseIndex].progress = Math.round((completedCount / allLessons.length) * 100);
            
            this.logAction('COMPLETE_LESSON', { title: lessonTitle, course: this.courses[courseIndex].title });
            this.save();
        }
    }

    private logAction(type: ActionLog['type'], details: any) {
        const action: ActionLog = {
            id: crypto.randomUUID(),
            type,
            timestamp: new Date(),
            details
        };
        this.actionLog.unshift(action);
        // Keep log size manageable
        if (this.actionLog.length > 50) this.actionLog.pop();
    }
}

export const db = new DataService();