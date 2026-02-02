
export type Tab = 'HOME' | 'PRACTICE' | 'ANALYZE' | 'LEARN' | 'SOCIAL' | 'PROFILE';

export type AnalysisStatus = 'SELECT_SOURCE' | 'RECORDING' | 'PREVIEW' | 'ANALYZING' | 'COMPLETE';
export type ToolType = 'LINE' | 'CIRCLE' | 'FREEHAND' | 'ANGLE' | 'ARROW' | 'TEXT';
export type PlaybackSpeed = 0.25 | 0.5 | 1.0;

export interface Point { x: number; y: number; }

export interface DrawnAnnotation {
    id: string;
    type: ToolType;
    points: Point[];
    color: string;
    strokeWidth: number;
    text?: string;
}

export interface Annotation extends DrawnAnnotation {
    frameNumber: number;
}

export interface Keyframe {
    id: string;
    type: string; // P1, P2, etc.
    label?: string;
    timestamp: number;
}

export interface FeedbackMessage {
    id: string;
    timestamp: number;
    text: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    category: string;
    correction?: string;
}

export interface SwingMetrics {
    clubSpeed?: number;
    ballSpeed?: number;
    smashFactor?: number;
    carryDistance?: number;
    spinRate?: number;
    launchAngle?: number;
    path?: number;
    faceAngle?: number;
    efficiency?: number;
    attackAngle?: number;
    wristFlexion?: number;
    ulnarRadial?: number;
    hipRotation?: number;
}

export interface SwingAnalysis {
    id: string;
    date: Date;
    videoUrl: string;
    thumbnailUrl: string;
    clubUsed: string;
    tags: string[];
    metrics: SwingMetrics;
    feedback: FeedbackMessage[];
    keyframes: Keyframe[];
    score: number;
    annotations?: DrawnAnnotation[];
}

export interface Drill {
    id: string;
    title: string;
    description: string;
    category: string; // PUTTING, CHIPPING, BUNKER, SHORT_GAME, FULL_SWING
    subcategory?: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    durationMinutes: number;
    thumbnailUrl: string;
    videoUrl?: string;
    steps: { order: number; text: string }[];
    goalCount?: number;
    goalUnit?: string;
    lastScore?: number;
    materials?: string[];
    facility?: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    durationMinutes: number;
    completed: boolean;
    locked: boolean;
    keyTakeaways: string[];
    resources: any[];
}

export interface CourseModule {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    description: string;
    thumbnailUrl: string;
    instructor: string;
    modules: CourseModule[];
    totalDuration: number;
    progress: number;
    handicapImpact: number;
    tagline: string;
}

export interface PracticeGoal {
    id: string;
    title: string;
    metric?: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline?: Date;
    progress: number;
}

export interface PracticeShot {
    id: string;
    timestamp: Date;
    club: string;
    result: 'PURE' | 'THIN' | 'FAT' | 'TOE' | 'HEEL' | 'LEFT' | 'RIGHT' | 'SHORT' | 'LONG';
    metrics?: SwingMetrics;
}

export interface PracticeSession {
    id: string;
    date: Date;
    location: string;
    shotsHit: number;
    club: string;
    avgMetrics: any;
    bestMetrics: any;
    consistencyScore: number;
    notes?: string;
    shots?: PracticeShot[];
    drillId?: string;
}

export interface BagShotSlot {
    id: string;
    title: string;
    distanceRange: string;
    lie: 'FAIRWAY' | 'ROUGH' | 'TEE' | 'SAND' | 'RECOVERY';
    shape: 'STRAIGHT' | 'DRAW' | 'FADE' | 'LOW' | 'HIGH';
    trajectory: 'LOW' | 'STANDARD' | 'HIGH';
    isMastered: boolean;
    masteryDate?: Date;
}

export type ShotLie = BagShotSlot['lie'];
export type ShotShape = BagShotSlot['shape'];

export interface Club {
    id: string;
    name: string;
    category: 'WOOD' | 'IRON' | 'WEDGE' | 'PUTTER';
    type: string;
    loft?: string;
    shaft?: string;
}

export type ClubCategory = Club['category'];

export interface UserStats {
    roundsPlayed: number;
    avgScore: number;
    fairwaysHit: number;
    greensInRegulation: number;
    puttsPerRound: number;
    streak: number;
}

export interface SwingDNA {
    driverSpeed: number;
    ironCarry7: number;
    tempo: 'FAST' | 'MODERATE' | 'SMOOTH';
    typicalShape: string;
    handicap: number;
    dexterity: 'Right' | 'Left';
    height: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    memberStatus: 'FREE' | 'PRO' | 'TOUR';
    credits: number;
    avatarUrl: string;
    homeCourse: string;
    onboardingCompleted: boolean;
    stats: UserStats;
    swingDNA: SwingDNA;
    bag: Club[];
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    courseIds: string[];
    totalCourses: number;
}

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

export interface Workout {
    id: string;
    title: string;
    category: string;
    duration: number;
    difficulty: string;
    thumbnailUrl: string;
    exercisesCount: number;
    completed: boolean;
}

export interface HandicapRecord {
    id: string;
    date: Date;
    index: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    roundsIncluded: number;
}

export interface CoachProfile {
    id: string;
    name: string;
    title: string;
    location: string;
    avatarUrl: string;
    specialty: string;
    rate: number; // Credits
    rating?: number;
    tier?: string;
    availableSlots?: string[];
    isVerified?: boolean;
    reviewCount?: number;
}

export interface SwingAngle {
    name: string;
    value: number;
    ideal?: number;
}

export interface KeyPosition {
    id: string;
    name: string;
    frameNumber: number;
    timestamp: number;
    angles: SwingAngle[];
}

export interface SwingVideo {
    id: string;
    recordedAt: Date;
    club: string;
    angle: 'FACE_ON' | 'DOWN_THE_LINE' | 'OTHER';
    duration: number;
    thumbnailUrl: string;
    videoUrl: string;
    tags: string[];
    rating: 1 | 2 | 3 | 4 | 5;
    aiScore?: number;
    keyPositions: KeyPosition[];
    annotations: Annotation[];
}

export interface VideoFolder {
    id: string;
    name: string;
    color: string;
    videoCount: number;
    createdAt: Date;
}

export interface ProSwing {
    id: string;
    playerName: string;
    club: string;
    angle: 'FACE_ON' | 'DOWN_THE_LINE';
    videoUrl: string;
    thumbnailUrl: string;
    keyMetrics: { name: string; value: string }[];
}

export interface GolfFriend {
    id: string;
    name: string;
    avatarUrl: string;
    handicap: number;
    homeCourse: string;
    status: 'ONLINE' | 'OFFLINE' | 'PLAYING';
    lastActive: Date;
    mutualFriends: number;
    roundsTogether: number;
}

export interface ActivityItem {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    type: 'ROUND' | 'ACHIEVEMENT' | 'SWING';
    timestamp: Date;
    data: any;
    likes: number;
    comments: number;
    hasLiked: boolean;
}

export interface Tournament {
    id: string;
    name: string;
    description: string;
    format: string;
    startDate: Date;
    endDate: Date;
    participants: number;
    maxParticipants: number;
    status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
    leaderboard: { rank: number; playerId: string; playerName: string; score: number | string; roundsPlayed: number; movement: 'UP' | 'DOWN' | 'SAME' }[];
}

export interface StrokesGained {
    roundId: string;
    date: Date;
    courseName: string;
    offTheTee: number;
    approach: number;
    aroundGreen: number;
    putting: number;
    total: number;
    benchmarkHandicap: number;
    totalStrokes: number;
    coursePar: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'ja';
export type MeasurementUnit = 'yards' | 'meters';

export interface AppPreferences {
    theme: ThemeMode;
    language: Language;
    distanceUnit: MeasurementUnit;
    temperatureUnit: 'fahrenheit' | 'celsius';
    hapticFeedback: boolean;
    soundEffects: boolean;
    autoPlayVideos: boolean;
    defaultCamera: 'front' | 'back';
    videoQuality: 'high' | 'medium' | 'low';
    offlineMode: boolean;
    dataUsage: 'standard' | 'low';
}

export interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    showHandicap: boolean;
    showScores: boolean;
    showLocation: boolean;
    shareAnalytics: boolean;
    personalizationData: boolean;
    marketingEmails: boolean;
    partnerOffers: boolean;
}

export interface LinkedAccount {
    provider: 'google' | 'apple' | 'sensor_kit'; // Generic sensor kit name
    email?: string;
    connected: boolean;
    lastSynced?: string;
    name?: string;
}

export interface SubscriptionInfo {
    tier: 'free' | 'pro' | 'premium';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: string;
    renewalDate: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
}

export interface GolfProfile {
    handicap: number;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    handPreference: 'right' | 'left';
    averageScore: number;
    drivingDistance: number;
    goals: string[];
    playFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
}

export type ShotResult = 'FAIRWAY' | 'ROUGH' | 'BUNKER' | 'GREEN' | 'WATER' | 'OB' | 'FRINGE';

export interface Shot {
    id: string;
    shotNumber: number;
    club: string;
    distance: number;
    startLocation?: { lat: number; lng: number };
    endLocation?: { lat: number; lng: number };
    result: ShotResult;
    shape?: string;
}

export interface HoleScore {
    holeNumber: number;
    par: number;
    score: number;
    shots: Shot[];
    putts: number;
    fairwayHit?: boolean;
    greenInRegulation?: boolean;
    sandSave?: boolean;
    upAndDown?: boolean;
    penaltyStrokes?: number;
}

export interface DetailedRound {
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
    frontNine: number;
    backNine: number;
    courseRating: number;
    slopeRating: number;
    tees: string;
    holes: HoleScore[];
    stats: any;
    totalScore: number;
}

export interface PatternData {
    club: string;
    missCount: { left: number; right: number; short: number; long: number };
    hitRate: number;
    avgDistance: number;
    totalShots: number;
}

export interface TrendAlert {
    id: string;
    type: 'WARNING' | 'POSITIVE' | 'NEUTRAL';
    category: string;
    message: string;
    rounds: number;
    stat: string;
    trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface PuttingStats {
    puttsPerRound: number;
    oneFootMake: number;
    threeFootMake: number;
    sixFootMake: number;
    tenFootMake: number;
    fifteenFootMake: number;
    twentyFootMake: number;
    firstPuttProximity: number;
    threeputts: number;
    totalPutts: number;
    roundsTracked: number;
}

export interface PuttingGame {
    id: string;
    name: string;
    description: string;
    rules: string[];
    icon: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export type NotificationType = 'achievement' | 'reminder' | 'social' | 'tournament' | 'lesson' | 'weather' | 'practice' | 'system' | 'coaching' | 'milestone';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    status: 'read' | 'unread';
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
    actionLabel?: string;
}

export interface NotificationPreference {
    type: NotificationType;
    enabled: boolean;
}

export interface Hazard {
    id: string;
    type: 'WATER' | 'BUNKER' | 'OB';
    name: string;
    carryDistance: number;
    clearDistance: number;
    side: 'LEFT' | 'RIGHT' | 'CENTER';
    shape: any[];
}

export interface LayupTarget {
    id: string;
    name: string;
    distanceToTarget: number;
    remainingDistance: number;
}

export interface HoleData {
    number: number;
    par: number;
    yardage: number;
    handicapIndex: number;
    teeLocation: { lat: number; lng: number };
    greenCenter: { lat: number; lng: number };
    pinLocation: { lat: number; lng: number };
    hazards: Hazard[];
    layupTargets: LayupTarget[];
}

export type WeatherCondition = 'SUNNY' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'RAINY' | 'STORMY' | 'WINDY' | 'FOGGY';

export interface PlayingConditions {
    weather: WeatherCondition;
    temperature: number;
    windSpeed: number;
    windDirection: string;
    altitude: number;
    humidity: number;
}

export interface ClubData {
    name: string;
    avgDistance: number;
    minDistance: number;
    maxDistance: number;
    dispersion: number; // width in yards
}

export interface CaddieTip {
    id: string;
    type: 'STRATEGY' | 'WIND' | 'LIE' | 'ELEVATION' | 'CLUB';
    title: string;
    message: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    icon: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    interval: 'monthly' | 'yearly';
    features: string[];
    tier: 'FREE' | 'PRO' | 'TOUR';
    color: string;
    isPopular?: boolean;
}

export interface CreditPackage {
    id: string;
    credits: number;
    price: number;
    discount?: string;
    popular?: boolean;
}

export interface CreditTransaction {
    id: string;
    date: Date;
    type: 'PURCHASE' | 'USAGE' | 'BONUS';
    amount: number;
    description: string;
}

export interface SGBenchmark {
    handicap: number;
    offTheTee: number;
    approach: number;
    aroundGreen: number;
    putting: number;
}

export interface CommunityPost {
    id: string;
    author: {
        id: string;
        name: string;
        avatarUrl: string;
        type: 'USER' | 'COACH';
        badge?: string;
    };
    type: 'ROUND' | 'ACHIEVEMENT' | 'SWING' | 'COACH_TIP' | 'QUESTION' | 'SWING_REVIEW';
    content: string;
    mediaUrl?: string;
    timestamp: Date;
    likes: number;
    comments: number;
    isLiked: boolean;
    metadata?: any;
}

export interface TrainingPlan {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    totalDrills: number;
    durationLabel: string;
    progress: number;
    drillIds: string[];
}

export interface SGBucket {
    label: string;
    value: number;
    compareValue?: number;
    unit?: string;
    totalShots?: number;
}

export interface TerrainStats {
    tee: number;
    fairway: number;
    rough: number;
    sand: number;
    recovery: number;
}

export interface MissTendency {
    short: number;
    long: number;
    left: number;
    right: number;
    gir: number;
}

export interface DetailedSGStats {
    userId: string;
    handicap: number;
    comparisonHandicap: number;
    roundsAnalyzed: number;
    
    // Overall Summary
    overallSG: number;
    overallTrend: number; // e.g. -0.2 vs prev
    sgBreakdown: {
        driving: number;
        approach: number;
        short: number;
        putting: number;
    };

    // Approach Specifics
    approachByTerrain: TerrainStats;
    approachByDistance: {
        bucket: string;
        sg: number;
        proximity: number;
        targetProximity: number;
        girPct: number;
        targetGirPct: number;
    }[];
    girStats: MissTendency;
    avgDistanceToPin: {
        gir: number;
        all: number;
        targetGir: number;
        targetAll: number;
    };

    // Insights
    opportunities: string[];
    strengths: string[];
}

export type CourseCategoryType = 'DRIVER' | 'SHORT_GAME' | 'QUANT_ANALYSIS' | 'PUTTING' | 'MENTAL';
export type CourseLesson = Lesson;

export type ImportSource = 'LAUNCH_MONITOR' | 'WEARABLE' | 'MANUAL';

export interface StrokesGainedStats {
    offTee: number;
    approach: number;
    aroundGreen: number;
    putting: number;
    total: number;
    handicap: number;
}

export interface ActionLog {
    id: string;
    type: 'ADD_SWING' | 'ADD_SESSION' | 'MASTER_SHOT' | 'UPDATE_GOAL' | 'COMPLETE_LESSON' | 'ROUND_COMPLETE' | 'WORKOUT_COMPLETE' | 'PURCHASE_CREDITS' | 'SPEND_CREDITS' | 'UPDATE_SUBSCRIPTION' | 'BOOK_COACH';
    timestamp: Date;
    details: any;
}

export type SubscriptionTier = 'free' | 'premium' | 'tour';

export interface ClubSuggestion {
    club: ClubData;
    confidence: number;
}

export interface OnboardingData {
    firstName: string;
    lastName: string;
    email: string;
    skillLevel: SkillLevel;
    handPreference: HandPreference;
    playFrequency: PlayFrequency;
    yearsPlaying: number;
    goals: string[];
    focusAreas: string[];
    distanceUnit: 'yards' | 'meters';
    notifications: boolean;
    shareProgress: boolean;
    handicap: number;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';
export type PlayFrequency = 'daily' | 'weekly' | 'monthly' | 'rarely';
export type HandPreference = 'right' | 'left';

export type SwingPositionId = 'P1' | 'P2' | 'P4' | 'P7' | 'P10';

export interface SwingPositionDefinition {
    id: SwingPositionId;
    name: string;
    fullName: string;
    description: string;
    checkpoints: string[];
    idealAngles: { name: string; min: number; max: number; ideal: number }[];
}

export interface DetectedPosition {
    id: SwingPositionId;
    frameIndex: number;
    timestamp: number;
    confidence: number;
}

export interface SkeletonJoint {
    type: string;
    x: number;
    y: number;
    confidence: number;
    visible: boolean;
}

export interface SkeletonJointData {
    joint: string;
    x: number;
    y: number;
    confidence: number;
    visible: boolean;
}

export interface SkeletonConnection {
    from: string;
    to: string;
    color: string;
}

export interface MeasuredAngle {
    name: string;
    value: number;
    idealMin: number;
    idealMax: number;
    idealValue: number;
    status: 'GOOD' | 'OK' | 'BAD';
}

export interface PositionCoachingFeedback {
    id: string;
    category: string;
    severity: string;
    title: string;
    description: string;
    correction: string;
    proReference: string;
}

export interface VideoTrimResult {
    originalDuration: number;
    trimmedStartTime: number;
    trimmedEndTime: number;
    trimmedDuration: number;
    swingDetected: boolean;
    confidence: number;
}

export interface FullSwingAnalysis {
    overallScore: number;
    overallGrade: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: CoachingRecommendation[];
    drills: RecommendedDrill[];
}

export interface CoachingRecommendation {
    id: string;
    priority: string;
    category: string;
    title: string;
    description: string;
    positionRefs: string[];
    drillIds: string[];
    estimatedImpact: string;
}

export interface RecommendedDrill {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    duration: string;
    steps: string[];
    targetPositions: string[];
    expectedImprovement: string;
}

export interface SkeletonConfig {
    // Empty if not needed but exported
}

export type GreenReading = any;
