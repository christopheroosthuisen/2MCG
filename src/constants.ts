
import { Drill, Lesson, SwingAnalysis, Course, PracticeGoal, TrackManSession, UserProfile, LearningPath, BagShotSlot, OnCourseRound, Workout, HandicapRecord, CoachProfile, SwingVideo, VideoFolder, ProSwing, GolfFriend, ActivityItem, Tournament, StrokesGained, AppPreferences, PrivacySettings, LinkedAccount, SubscriptionInfo, GolfProfile, DetailedRound, PatternData, TrendAlert, PuttingStats, PuttingGame, HoleScore, Shot, Notification, NotificationPreference, HoleData, PlayingConditions, ClubData, CaddieTip, SubscriptionPlan, CreditPackage, CreditTransaction, SGBenchmark } from "./types";

export const COLORS = {
    primary: '#FF8200', // UT Orange
    secondary: '#115740', // Fairway Green
    white: '#FFFFFF',
    gray: '#4B4B4B',
    background: '#F5F5F7',
    surface: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    border: '#E5E7EB',
    dark: '#111827',
    videoControls: '#1F2937', 
    premium: '#FFD700',
    // Stat specific colors
    driving: '#8B5CF6',
    approach: '#3B82F6',
    shortGame: '#22C55E',
    putting: '#F59E0B',
    birdie: '#22C55E',
    par: '#3B82F6',
    bogey: '#F59E0B',
    double: '#EF4444',
    water: '#3B82F6',
    bunker: '#D4A574',
};

export const SPACING = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
};

export const MOCK_USER_PROFILE: UserProfile = {
    id: 'u1',
    name: 'Tiger Woods',
    email: 'goat@pgatour.com',
    memberStatus: 'TOUR',
    credits: 1250,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    homeCourse: 'Medalist Golf Club',
    onboardingCompleted: true,
    stats: {
        roundsPlayed: 14,
        avgScore: 68.2,
        fairwaysHit: 72,
        greensInRegulation: 78,
        puttsPerRound: 28.5,
        streak: 7
    },
    swingDNA: {
        driverSpeed: 122,
        ironCarry7: 178,
        tempo: 'FAST',
        typicalShape: 'FADE',
        handicap: +6.4,
        dexterity: 'Right',
        height: '6\' 1"'
    },
    bag: [
        { id: 'c1', name: 'Qi10 LS', category: 'WOOD', type: 'DRIVER', loft: '9.0°', shaft: 'Ventus Black 6X' },
        { id: 'c2', name: 'Qi10 Tour', category: 'WOOD', type: '3-WOOD', loft: '15.0°', shaft: 'Ventus Black 8X' },
        { id: 'c3', name: 'P770', category: 'IRON', type: 'IRON-3', shaft: 'Project X 6.5' },
        { id: 'c4', name: 'P7TW', category: 'IRON', type: 'IRON-4', shaft: 'Dynamic Gold X100' },
        { id: 'c5', name: 'P7TW', category: 'IRON', type: 'IRON-5', shaft: 'Dynamic Gold X100' },
        { id: 'c6', name: 'P7TW', category: 'IRON', type: 'IRON-6', shaft: 'Dynamic Gold X100' },
        { id: 'c7', name: 'P7TW', category: 'IRON', type: 'IRON-7', shaft: 'Dynamic Gold X100' },
        { id: 'c8', name: 'P7TW', category: 'IRON', type: 'IRON-8', shaft: 'Dynamic Gold X100' },
        { id: 'c9', name: 'P7TW', category: 'IRON', type: 'IRON-9', shaft: 'Dynamic Gold X100' },
        { id: 'c10', name: 'MG4', category: 'WEDGE', type: 'PW', loft: '48°', shaft: 'Dynamic Gold S400' },
        { id: 'c11', name: 'MG4', category: 'WEDGE', type: 'SW', loft: '56°', shaft: 'Dynamic Gold S400' },
        { id: 'c12', name: 'MG4', category: 'WEDGE', type: 'LW', loft: '60°', shaft: 'Dynamic Gold S400' },
        { id: 'c13', name: 'Newport 2 GSS', category: 'PUTTER', type: 'PUTTER', loft: '3.5°', shaft: 'Ping Blackout' }
    ]
};

// --- MONETIZATION CONSTANTS ---

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'plan_free',
        name: 'Free',
        price: 0,
        interval: 'monthly',
        features: ['Basic Swing Analysis', '3 Practice Drills', 'Score Tracking', 'Ad Supported'],
        tier: 'FREE',
        color: '#9CA3AF'
    },
    {
        id: 'plan_pro',
        name: 'Pro',
        price: 9.99,
        interval: 'monthly',
        features: ['Unlimited Swing Analysis', 'Full Drill Library', 'AI Coach Insights', 'No Ads', '100 Monthly Credits'],
        isPopular: true,
        tier: 'PRO',
        color: COLORS.primary
    },
    {
        id: 'plan_tour',
        name: 'Tour',
        price: 19.99,
        interval: 'monthly',
        features: ['Everything in Pro', 'Priority Live Lessons', 'Advanced Stats & SG', 'Exclusive Content', '300 Monthly Credits'],
        tier: 'TOUR',
        color: '#111827'
    }
];

export const CREDIT_PACKAGES: CreditPackage[] = [
    { id: 'cp_small', credits: 100, price: 4.99 },
    { id: 'cp_medium', credits: 500, price: 19.99, discount: 'Save 20%', popular: true },
    { id: 'cp_large', credits: 1200, price: 39.99, discount: 'Save 33%' }
];

export const MOCK_TRANSACTIONS: CreditTransaction[] = [
    { id: 'tx1', date: new Date(Date.now() - 86400000 * 1), type: 'USAGE', amount: -50, description: 'Live Swing Review' },
    { id: 'tx2', date: new Date(Date.now() - 86400000 * 5), type: 'PURCHASE', amount: 500, description: 'Medium Credit Pack' },
    { id: 'tx3', date: new Date(Date.now() - 86400000 * 30), type: 'BONUS', amount: 100, description: 'Monthly Pro Plan Bonus' },
];

export const MOCK_BAG_SLOTS: BagShotSlot[] = [
    {
        id: 'bs1',
        title: 'Stock 7 Iron',
        distanceRange: '172-175 yards',
        lie: 'FAIRWAY',
        shape: 'STRAIGHT',
        trajectory: 'STANDARD',
        isMastered: true,
        masteryDate: new Date('2023-11-15')
    },
    {
        id: 'bs2',
        title: 'Low Punch',
        distanceRange: '140-150 yards',
        lie: 'ROUGH',
        shape: 'DRAW',
        trajectory: 'LOW',
        isMastered: false
    },
    {
        id: 'bs3',
        title: 'High Flop',
        distanceRange: '20-30 yards',
        lie: 'ROUGH',
        shape: 'STRAIGHT',
        trajectory: 'HIGH',
        isMastered: true,
        masteryDate: new Date('2024-01-20')
    }
];

export const MOCK_LEARNING_PATHS: LearningPath[] = [
    {
        id: 'path1',
        title: 'Breaking 90',
        description: 'Complete guide to scoring better without changing your swing mechanics. Focus on course management and eliminating double bogeys.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12db464?auto=format&fit=crop&q=80&w=600',
        courseIds: ['c1', 'c2'],
        totalCourses: 3
    },
    {
        id: 'path2',
        title: 'Elite Ball Striking',
        description: 'Learn to compress the ball like a tour pro. Advanced mechanics for players looking to reach scratch.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1629210087796-749e7b243452?auto=format&fit=crop&q=80&w=600',
        courseIds: ['c3'],
        totalCourses: 2
    }
];

export const MOCK_COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Driver Unleashed',
        subtitle: 'Add 20 Yards',
        category: 'DRIVER',
        description: 'Unlock your potential distance through ground force mechanics and optimized launch conditions.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=600',
        instructor: 'Dr. Sasho MacKenzie',
        modules: [
            {
                id: 'm1',
                title: 'Ground Force',
                lessons: [
                    {
                        id: 'l1',
                        title: 'Using the Ground',
                        description: 'Introduction to vertical force.',
                        videoUrl: '',
                        durationMinutes: 12,
                        completed: true,
                        locked: false,
                        keyTakeaways: ['Push down to go up', 'Timing is key'],
                        resources: []
                    }
                ]
            }
        ],
        totalDuration: 45,
        progress: 33,
        handicapImpact: 2.1,
        tagline: 'BOMB IT'
    },
    {
        id: 'c2',
        title: 'Short Game Wizardry',
        subtitle: 'Up & Down',
        category: 'SHORT_GAME',
        description: 'Master the wedges from 100 yards and in. Learn trajectory control and spin management.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1592919505780-30395071e867?auto=format&fit=crop&q=80&w=600',
        instructor: 'Phil Mickelson',
        modules: [],
        totalDuration: 60,
        progress: 0,
        handicapImpact: 3.5,
        tagline: 'SAVE PAR'
    },
    {
        id: 'c3',
        title: 'Strokes Gained 101',
        subtitle: 'Math of Scoring',
        category: 'QUANT_ANALYSIS',
        description: 'Understand where you are actually losing strokes using modern statistical analysis.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
        instructor: 'Mark Broadie',
        modules: [],
        totalDuration: 90,
        progress: 10,
        handicapImpact: 1.5,
        tagline: 'DATA DRIVEN'
    }
];

export const MOCK_DRILLS: Drill[] = [
    {
        id: 'd1',
        title: 'Gate Drill',
        description: 'Classic putting drill for start line control. Set up two tees just wider than your putter head.',
        difficulty: 'BEGINNER',
        category: 'PUTTING',
        steps: [{ order: 1, text: 'Place two tees just wider than putter head.' }],
        thumbnailUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 15
    },
    {
        id: 'd2',
        title: 'Clock Drill',
        description: 'Pressure putting from 3, 6, and 9 feet. Make all puts around the hole to advance.',
        difficulty: 'INTERMEDIATE',
        category: 'PUTTING',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1622602737677-4b711979b939?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 20
    },
    {
        id: 'd-chip-2',
        title: 'Hinge & Hold',
        description: 'Master the basic chipping motion for consistent contact.',
        difficulty: 'BEGINNER',
        category: 'CHIPPING',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1615117904098-b80c294ce184?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 10
    },
    {
        id: 'd-bunker-1',
        title: 'Line in the Sand',
        description: 'Learn where to strike the sand relative to the ball.',
        difficulty: 'INTERMEDIATE',
        category: 'BUNKER',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1535132011086-b8818f016104?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 25
    }
];

export const MOCK_LESSONS: Lesson[] = [];

export const MOCK_RECENT_SWINGS: SwingAnalysis[] = [
    {
        id: 's1',
        date: new Date(Date.now() - 86400000),
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=400',
        clubUsed: 'DRIVER',
        tags: ['Power', 'Range'],
        metrics: { clubSpeed: 118, carryDistance: 295 },
        feedback: [],
        keyframes: [],
        score: 92
    },
    {
        id: 's2',
        date: new Date(Date.now() - 172800000),
        videoUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12db464?auto=format&fit=crop&q=80&w=400',
        clubUsed: 'IRON-7',
        tags: ['Tempo'],
        metrics: { clubSpeed: 92, carryDistance: 175 },
        feedback: [],
        keyframes: [],
        score: 85
    }
];

export const MOCK_GOALS: PracticeGoal[] = [
    {
        id: 'g1',
        title: 'Increase Driver Speed',
        metric: 'clubSpeed',
        targetValue: 125,
        currentValue: 118,
        unit: 'mph',
        deadline: new Date('2024-06-01'),
        progress: 65
    }
];

export const MOCK_SESSIONS: TrackManSession[] = [
    {
        id: 'ts1',
        date: new Date(Date.now() - 86400000 * 2),
        location: 'Indoor Lab',
        shotsHit: 45,
        club: 'DRIVER',
        avgMetrics: { clubSpeed: 116, spinRate: 2400 },
        bestMetrics: { clubSpeed: 119 },
        consistencyScore: 88,
        notes: 'Feeling fast today.'
    }
];

export const MOCK_ROUNDS: OnCourseRound[] = [
    {
        id: 'r1',
        courseName: 'Pebble Beach',
        date: new Date(Date.now() - 86400000 * 3),
        score: 74,
        par: 72,
        holesPlayed: 18,
        fairwaysHit: 9,
        greensInRegulation: 12,
        putts: 31,
        isCompleted: true
    }
];

export const MOCK_WORKOUTS: Workout[] = [
    {
        id: 'w1',
        title: 'Rotational Power',
        category: 'SPEED',
        duration: 45,
        difficulty: 'ADVANCED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
        exercisesCount: 8,
        completed: false
    },
    {
        id: 'w2',
        title: 'Hip Mobility Flow',
        category: 'FLEXIBILITY',
        duration: 20,
        difficulty: 'BEGINNER',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574680096141-1cddd32e0340?auto=format&fit=crop&q=80&w=400',
        exercisesCount: 5,
        completed: true
    }
];

export const MOCK_HANDICAP_HISTORY: HandicapRecord[] = [
    { id: 'h1', date: new Date('2024-01-01'), index: 5.4, trend: 'STABLE', roundsIncluded: 20 },
    { id: 'h2', date: new Date('2024-02-01'), index: 4.8, trend: 'DOWN', roundsIncluded: 20 },
    { id: 'h3', date: new Date('2024-03-01'), index: 4.2, trend: 'DOWN', roundsIncluded: 20 }
];

export const MOCK_COACH: CoachProfile = {
    id: 'coach1',
    name: 'Butch Harmon',
    title: 'Swing Consultant',
    location: 'Las Vegas, NV',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    specialty: 'Full Swing',
    rate: 500
};

export const MOCK_SWING_VIDEOS: SwingVideo[] = [
    {
        id: 'sv1',
        recordedAt: new Date(Date.now() - 86400000),
        club: 'DRIVER',
        angle: 'FACE_ON',
        duration: 3.2,
        thumbnailUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=400',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        tags: ['Speed Training'],
        rating: 4,
        keyPositions: [
            { id: 'kp1', name: 'Top', frameNumber: 45, timestamp: 1.5, angles: [{ name: 'Shoulder Turn', value: 95, ideal: 90 }] }
        ],
        annotations: [],
        aiScore: 88
    },
    {
        id: 'sv2',
        recordedAt: new Date(Date.now() - 172800000),
        club: 'IRON-7',
        angle: 'DOWN_THE_LINE',
        duration: 3.5,
        thumbnailUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12db464?auto=format&fit=crop&q=80&w=400',
        videoUrl: '',
        tags: ['Tempo'],
        rating: 5,
        keyPositions: [],
        annotations: [],
        aiScore: 92
    }
];

export const MOCK_FOLDERS: VideoFolder[] = [
    { id: 'f1', name: 'Driver Swings', color: '#FF8200', videoCount: 12, createdAt: new Date() },
    { id: 'f2', name: 'Wedge Play', color: '#10B981', videoCount: 8, createdAt: new Date() }
];

export const MOCK_PRO_SWINGS: ProSwing[] = [
    {
        id: 'pro1',
        playerName: 'Rory McIlroy',
        club: 'DRIVER',
        angle: 'FACE_ON',
        videoUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1599587425330-749e7b243452?auto=format&fit=crop&q=80&w=200',
        keyMetrics: [{ name: 'Shoulder Turn', value: '110°' }]
    },
    {
        id: 'pro2',
        playerName: 'Tiger Woods',
        club: 'IRON-7',
        angle: 'DOWN_THE_LINE',
        videoUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200',
        keyMetrics: [{ name: 'Plane', value: 'Neutral' }]
    }
];

export const MOCK_FRIENDS: GolfFriend[] = [
    {
        id: 'f1',
        name: 'Jordan Spieth',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
        handicap: 0.2,
        homeCourse: 'Brook Hollow',
        status: 'PLAYING',
        lastActive: new Date(),
        mutualFriends: 12,
        roundsTogether: 8
    },
    {
        id: 'f2',
        name: 'Rory McIlroy',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        handicap: 0.5,
        homeCourse: 'Royal County Down',
        status: 'ONLINE',
        lastActive: new Date(Date.now() - 3600000),
        mutualFriends: 8,
        roundsTogether: 3
    }
];

export const MOCK_ACTIVITY: ActivityItem[] = [
    {
        id: 'a1',
        userId: 'f1',
        userName: 'Jordan Spieth',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
        type: 'ROUND',
        timestamp: new Date(Date.now() - 3600000),
        data: { score: 68, course: 'Colonial CC', par: 70 },
        likes: 24,
        comments: 5,
        hasLiked: false
    },
    {
        id: 'a2',
        userId: 'f2',
        userName: 'Rory McIlroy',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        type: 'ACHIEVEMENT',
        timestamp: new Date(Date.now() - 86400000),
        data: { achievement: '30-Day Streak', description: 'Practiced for 30 days straight!' },
        likes: 42,
        comments: 12,
        hasLiked: true
    }
];

export const MOCK_TOURNAMENTS: Tournament[] = [
    {
        id: 't1',
        name: 'MCG Weekly Challenge',
        description: 'Post your best 18-hole score this week',
        format: 'Stroke Play (Net)',
        startDate: new Date(),
        endDate: new Date(Date.now() + 604800000),
        participants: 128,
        maxParticipants: 256,
        status: 'ACTIVE',
        leaderboard: [
            { rank: 1, playerId: 'p1', playerName: 'Mike Johnson', score: -4, roundsPlayed: 2, movement: 'UP' },
            { rank: 2, playerId: 'p2', playerName: 'Sarah Davis', score: -3, roundsPlayed: 1, movement: 'SAME' }
        ]
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'achievement', title: 'New Record', message: 'You hit your longest drive ever: 305y!', timestamp: new Date().toISOString(), status: 'unread', priority: 'medium', actionLabel: 'View Stats' },
    { id: 'n2', type: 'reminder', title: 'Practice Reminder', message: 'Time for your weekly putting drill.', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'unread', priority: 'low' },
];

export const MOCK_HOLE: HoleData = {
    number: 18,
    par: 4,
    yardage: 440,
    handicapIndex: 2,
    teeLocation: { lat: 0, lng: 0 },
    greenCenter: { lat: 0, lng: 0 },
    pinLocation: { lat: 0, lng: 0 },
    hazards: [
        { id: 'h1', type: 'WATER', name: 'Lake', carryDistance: 280, clearDistance: 300, side: 'LEFT', shape: [] },
        { id: 'h2', type: 'BUNKER', name: 'Fairway Bunker', carryDistance: 260, clearDistance: 275, side: 'RIGHT', shape: [] }
    ],
    layupTargets: []
};

export const MOCK_CLUBS: ClubData[] = [
    { name: 'Driver', avgDistance: 280, minDistance: 260, maxDistance: 300, dispersion: 20 },
    { name: '3 Wood', avgDistance: 250, minDistance: 235, maxDistance: 265, dispersion: 15 },
    { name: '7 Iron', avgDistance: 175, minDistance: 165, maxDistance: 185, dispersion: 10 },
    { name: 'PW', avgDistance: 135, minDistance: 125, maxDistance: 145, dispersion: 8 },
];

export const MOCK_CONDITIONS: PlayingConditions = {
    weather: 'SUNNY',
    temperature: 72,
    windSpeed: 12,
    windDirection: 'N',
    altitude: 0,
    humidity: 45
};

export const MOCK_CADDIE_TIPS: CaddieTip[] = [
    { id: 't1', type: 'STRATEGY', title: 'Conservative Line', message: 'Aim right of the bunker. The water on the left is in play with your driver dispersion.', priority: 'HIGH', icon: '🎯' },
    { id: 't2', type: 'WIND', title: 'Helping Wind', message: 'Wind is hurting slightly. Club up one to be safe.', priority: 'MEDIUM', icon: '💨' }
];

export const MOCK_SG_HISTORY: StrokesGained[] = [
    { roundId: 'r1', date: new Date(), courseName: 'Pebble Beach', offTheTee: 1.2, approach: -0.5, aroundGreen: 0.8, putting: -0.2, total: 1.3, benchmarkHandicap: 5, totalStrokes: 74, coursePar: 72 },
    { roundId: 'r2', date: new Date(Date.now() - 86400000), courseName: 'Spyglass Hill', offTheTee: 0.5, approach: -1.2, aroundGreen: -0.1, putting: 0.5, total: -0.3, benchmarkHandicap: 5, totalStrokes: 76, coursePar: 72 },
    { roundId: 'r3', date: new Date(Date.now() - 172800000), courseName: 'Spanish Bay', offTheTee: -0.8, approach: 0.2, aroundGreen: 0.5, putting: 1.1, total: 1.0, benchmarkHandicap: 5, totalStrokes: 73, coursePar: 72 },
];

export const MOCK_GOLF_PROFILE: GolfProfile = {
    handicap: 5.4,
    skillLevel: 'advanced',
    handPreference: 'right',
    averageScore: 78,
    drivingDistance: 280,
    goals: ['Lower Handicap', 'Consistency'],
    playFrequency: 'weekly'
};

export const MOCK_PREFERENCES: AppPreferences = {
    theme: 'light',
    language: 'en',
    distanceUnit: 'yards',
    temperatureUnit: 'fahrenheit',
    hapticFeedback: true,
    soundEffects: true,
    autoPlayVideos: true,
    defaultCamera: 'back',
    videoQuality: 'high',
    offlineMode: false,
    dataUsage: 'standard'
};

export const MOCK_PRIVACY_SETTINGS: PrivacySettings = {
    profileVisibility: 'friends',
    showHandicap: true,
    showScores: true,
    showLocation: false,
    shareAnalytics: true,
    personalizationData: true,
    marketingEmails: false,
    partnerOffers: false
};

export const MOCK_LINKED_ACCOUNTS: LinkedAccount[] = [
    { provider: 'google', email: 'user@gmail.com', connected: true },
    { provider: 'ghin', connected: false },
    { provider: 'trackman', connected: true, lastSynced: '2 days ago' }
];

export const MOCK_SUBSCRIPTION: SubscriptionInfo = {
    tier: 'premium',
    status: 'active',
    startDate: '2023-01-01',
    renewalDate: '2024-01-01',
    price: 9.99,
    billingCycle: 'monthly',
    features: ['Unlimited Analysis', 'Pro Content', 'Advanced Stats']
};

export const MOCK_DETAILED_ROUND: DetailedRound = {
    id: 'dr1',
    courseName: 'Pebble Beach',
    date: new Date(),
    score: 75,
    par: 72,
    holesPlayed: 18,
    fairwaysHit: 10,
    greensInRegulation: 11,
    putts: 30,
    isCompleted: true,
    frontNine: 38,
    backNine: 37,
    courseRating: 74.3,
    slopeRating: 145,
    tees: 'Blue',
    holes: Array.from({length: 18}, (_, i) => ({
        holeNumber: i + 1,
        par: 4,
        score: 4 + (i % 3 === 0 ? 1 : 0),
        shots: [],
        putts: 2,
        greenInRegulation: true
    })),
    stats: {
        fairwaysHit: 10, fairwaysTotal: 14, greensInRegulation: 11, greensTotal: 18, totalPutts: 30,
        penalties: 1, upAndDowns: 3, upAndDownAttempts: 5, sandSaves: 1, sandSaveAttempts: 2,
        birdiesOrBetter: 2, pars: 10, bogeys: 5, doubleBogeyOrWorse: 1, longestDrive: 295, avgDriveDistance: 275
    },
    totalScore: 75
};

export const MOCK_COMPARISON_DETAILED_ROUND = MOCK_DETAILED_ROUND;

export const MOCK_PATTERN_DATA: PatternData[] = [
    { club: 'Driver', missCount: { left: 2, right: 8, short: 1, long: 0 }, hitRate: 45, avgDistance: 275, totalShots: 20 },
    { club: '7 Iron', missCount: { left: 4, right: 1, short: 2, long: 0 }, hitRate: 60, avgDistance: 172, totalShots: 15 },
    { club: '3 Wood', missCount: { left: 1, right: 3, short: 4, long: 0 }, hitRate: 50, avgDistance: 245, totalShots: 10 },
    { club: 'Wedges', missCount: { left: 1, right: 1, short: 1, long: 2 }, hitRate: 70, avgDistance: 110, totalShots: 25 }
];

export const MOCK_TREND_ALERTS: TrendAlert[] = [
    { id: 'ta1', type: 'WARNING', category: 'Putting', message: '3-Putt % Trending Up', rounds: 5, stat: '3-Putts', trend: 'UP' }
];

export const MOCK_PUTTING_STATS: PuttingStats = {
    puttsPerRound: 31.5,
    oneFootMake: 99,
    threeFootMake: 92,
    sixFootMake: 75,
    tenFootMake: 45,
    fifteenFootMake: 25,
    twentyFootMake: 12,
    firstPuttProximity: 24,
    threeputts: 1.2,
    totalPutts: 450,
    roundsTracked: 14
};

export const PUTTING_GAMES: PuttingGame[] = [
    { id: 'pg1', name: 'Around the World', description: 'Make putts from 3, 6, 9 feet around the hole.', rules: [], icon: '🌍', difficulty: 'EASY' },
    { id: 'pg2', name: 'Pressure Ladder', description: 'Start at 3ft, move back 1ft for every make. Miss and restart.', rules: [], icon: '🪜', difficulty: 'HARD' }
];

export const TOUR_AVERAGES: Partial<PuttingStats> = {
    threeFootMake: 99,
    sixFootMake: 85,
    tenFootMake: 55,
    fifteenFootMake: 35,
    twentyFootMake: 20
};
