
// Golf Domain Types

export type ClubCategory = 'PUTTER' | 'WEDGE' | 'IRON' | 'WOOD';
export type ClubType = 'PUTTER' | 'LW' | 'SW' | 'GW' | 'PW' | 'IRON-9' | 'IRON-8' | 'IRON-7' | 'IRON-6' | 'IRON-5' | 'IRON-4' | 'IRON-3' | 'HYBRID' | '5-WOOD' | '3-WOOD' | 'DRIVER';

export interface Club {
    id: string;
    name: string;
    category: ClubCategory;
    type: ClubType;
    brand?: string;
    model?: string;
    loft?: string;
    shaft?: string;
    purchaseDate?: Date;
    notes?: string;
}

export type ShotShape = 'DRAW' | 'FADE' | 'STRAIGHT' | 'HOOK' | 'SLICE' | 'PUSH' | 'PULL';
export type ShortGameShot = 'BUMP_RUN' | 'FLOP' | 'PITCH' | 'CHECKER' | 'BUNKER_EXPLOSION' | 'BUNKER_CHUNK' | 'PUTT_LAG' | 'PUTT_SHORT';

export interface SwingMetrics {
    clubSpeed?: number;
    ballSpeed?: number;
    smashFactor?: number;
    carryDistance?: number;
    totalDistance?: number;
    spinRate?: number;
    launchAngle?: number;
    path?: number;
    faceToPath?: number;
    faceAngle?: number; 
    attackAngle?: number;
    launchDirection?: number;
    skidDistance?: number;
    rollDistance?: number;
}

// Data Import Types
export type ImportSource = 'ARCCOS' | 'TANGENT' | 'TRACKMAN' | 'GCQUAD' | 'MANUAL' | 'SHOT_DOCTOR';

export interface StrokesGainedStats {
    offTee: number;
    approach: number;
    aroundGreen: number;
    putting: number;
    total: number;
    handicap: number;
}

export interface RecommendationEngine {
    focusArea: 'DRIVING' | 'IRON_PLAY' | 'SHORT_GAME' | 'PUTTING';
    recommendedDrills: string[]; 
    recommendedCourseId?: string;
    reasoning: string;
}

// Bag of Shots Types
export type ShotLie = 'TEE' | 'FAIRWAY' | 'ROUGH' | 'BUNKER_FAIRWAY' | 'BUNKER_GREEN' | 'DIVOT';
export type ShotTrajectory = 'LOW' | 'STANDARD' | 'HIGH';

export interface BagShotSlot {
    id: string;
    title: string;
    distanceRange: string;
    lie: ShotLie;
    shape: ShotShape;
    trajectory: ShotTrajectory;
    isMastered: boolean;
    videoUrl?: string;
    masteryDate?: Date;
}

// User Profile Types

export interface SwingDNA {
    driverSpeed: number;
    ironCarry7: number;
    tempo: 'FAST' | 'MODERATE' | 'SMOOTH';
    typicalShape: ShotShape;
    handicap: number;
    dexterity: 'RIGHT' | 'LEFT';
    height: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    memberStatus: 'FREE' | 'PRO' | 'TOUR';
    avatarUrl: string;
    homeCourse: string;
    stats: {
        roundsPlayed: number;
        avgScore: number;
        fairwaysHit: number; 
        greensInRegulation: number; 
        puttsPerRound: number;
    };
    bag: Club[];
    swingDNA: SwingDNA;
    coachId?: string;
}

// Analysis Types

export type AnalysisStatus = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'ANALYZING' | 'COMPLETE' | 'ERROR';

export type KeyframeType = 'ADDRESS' | 'TAKEAWAY' | 'TOP' | 'DOWNSWING' | 'IMPACT' | 'FOLLOW_THROUGH' | 'FINISH';

export interface Keyframe {
    id: string;
    type: KeyframeType;
    timestamp: number; 
    thumbnail?: string;
}

export type ToolType = 'POINTER' | 'LINE' | 'ANGLE' | 'CIRCLE' | 'RECT' | 'FREEHAND' | 'GRID' | 'SKELETON';
export type PlaybackSpeed = 0.1 | 0.25 | 0.5 | 1.0;

export interface SkeletonConfig {
    showArms: boolean;
    showLegs: boolean;
    showTorso: boolean;
    showHead: boolean;
}

export interface DrawnAnnotation {
    id: string;
    type: ToolType;
    points: { x: number; y: number }[]; 
    color: string;
    strokeWidth: number;
}

export interface FeedbackMessage {
    id: string;
    timestamp: number; 
    text: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    category: 'POSTURE' | 'GRIP' | 'TEMPO' | 'PLANE' | 'ROTATION';
    correction?: string; 
    audioUrl?: string; 
}

export interface PoseLandmark {
    x: number;
    y: number;
    visibility: number;
    name: string;
}

export interface PoseFrame {
    timestamp: number;
    landmarks: PoseLandmark[];
}

export interface SwingAnalysis {
    id: string;
    date: Date;
    videoUrl: string;
    thumbnailUrl: string;
    clubUsed: ClubType;
    tags: string[]; 
    metrics: SwingMetrics;
    feedback: FeedbackMessage[];
    keyframes: Keyframe[];
    poseData?: PoseFrame[];
    annotations?: DrawnAnnotation[];
    score: number;
    folderId?: string;
}

// Learning Types

export interface DrillStep {
    order: number;
    text: string;
    duration?: number; 
}

export interface Drill {
    id: string;
    title: string;
    description: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    category: 'PUTTING' | 'CHIPPING' | 'BUNKER' | 'SHORT_GAME' | 'FULL_SWING' | 'MENTAL';
    steps: DrillStep[];
    thumbnailUrl: string;
    durationMinutes: number;
}

export type CourseCategoryType = 'PUTTING' | 'CHIPPING' | 'PITCHING' | 'SAND' | 'IRON_PLAY' | 'LONG_GAME' | 'DRIVER' | 'QUANT_ANALYSIS';

export interface LessonResource {
    id: string;
    type: 'PDF' | 'LINK' | 'DRILL';
    title: string;
    url: string;
}

export interface CourseLesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    durationMinutes: number;
    completed: boolean;
    locked: boolean;
    keyTakeaways: string[];
    resources: LessonResource[];
    targetMetrics?: {
        label: string;
        value: string;
    }[];
}

export interface CourseModule {
    id: string;
    title: string;
    lessons: CourseLesson[];
}

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    category: CourseCategoryType;
    description: string;
    thumbnailUrl: string;
    instructor: string;
    modules: CourseModule[];
    totalDuration: number;
    progress: number; 
    handicapImpact: number; 
    tagline: string;
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    courseIds: string[];
    totalCourses: number;
}

export interface Lesson extends CourseLesson {
    instructor: string;
    chapters: any[]; 
    thumbnailUrl: string;
    totalDuration: number;
    progress: number;
}

// Practice & Goals

export interface PracticeGoal {
    id: string;
    title: string; 
    metric: keyof SwingMetrics;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline?: Date;
    progress: number;
}

export interface TrackManSession {
    id: string;
    date: Date;
    location: string;
    shotsHit: number;
    club: ClubType;
    avgMetrics: SwingMetrics;
    bestMetrics: SwingMetrics;
    consistencyScore: number;
    notes: string;
}

// --- NEW PHASE 2 TYPES ---

// On-Course
export interface OnCourseRound {
    id: string;
    courseName: string;
    date: Date;
    score: number;
    par: number;
    holesPlayed: number;
    fairwaysHit: number;
    greensInRegulation: number;
    putts: number;
    isCompleted: boolean;
}

// Fitness
export interface Workout {
    id: string;
    title: string;
    category: 'STRENGTH' | 'FLEXIBILITY' | 'SPEED' | 'RECOVERY';
    duration: number; // minutes
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    thumbnailUrl: string;
    exercisesCount: number;
    completed?: boolean;
}

// Handicap
export interface HandicapRecord {
    id: string;
    date: Date;
    index: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    roundsIncluded: number;
}

// Coach
export interface CoachProfile {
    id: string;
    name: string;
    title: string;
    location: string;
    avatarUrl: string;
    specialty: string;
    rate: number;
}

// System Logs
export interface ActionLog {
    id: string;
    type: 'ADD_SWING' | 'ADD_SESSION' | 'UPDATE_GOAL' | 'COMPLETE_LESSON' | 'MASTER_SHOT' | 'AI_CHAT' | 'ROUND_COMPLETE' | 'WORKOUT_COMPLETE';
    timestamp: Date;
    details: any;
}

// App State Types
export type Tab = 'HOME' | 'PRACTICE' | 'ANALYZE' | 'LEARN' | 'PLAY' | 'PROFILE';
