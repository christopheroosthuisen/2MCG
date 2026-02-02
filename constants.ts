
import { Drill, Lesson, SwingAnalysis, Course, PracticeGoal, PracticeSession, UserProfile, LearningPath, BagShotSlot, OnCourseRound, Workout, HandicapRecord, CoachProfile, SwingVideo, VideoFolder, ProSwing, GolfFriend, ActivityItem, Tournament, StrokesGained, AppPreferences, PrivacySettings, LinkedAccount, SubscriptionInfo, GolfProfile, DetailedRound, PatternData, TrendAlert, PuttingStats, PuttingGame, HoleScore, Shot, Notification, NotificationPreference, HoleData, PlayingConditions, ClubData, CaddieTip, SubscriptionPlan, CreditPackage, CreditTransaction, SGBenchmark, CommunityPost, TrainingPlan, DetailedSGStats } from "./types";

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
    
    // Chart Colors
    chartRed: '#F87171',
    chartGreen: '#34D399',
    chartLine: '#9CA3AF',
    chartText: '#6B7280'
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
    name: 'John Student',
    email: 'student@mcg.com',
    memberStatus: 'TOUR',
    credits: 1250,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    homeCourse: 'MCG Home Course',
    onboardingCompleted: true,
    stats: {
        roundsPlayed: 14,
        avgScore: 82.5,
        fairwaysHit: 55,
        greensInRegulation: 45,
        puttsPerRound: 31.5,
        streak: 7
    },
    swingDNA: {
        driverSpeed: 105,
        ironCarry7: 155,
        tempo: 'MODERATE',
        typicalShape: 'FADE',
        handicap: 9.7,
        dexterity: 'Right',
        height: '6\' 0"'
    },
    bag: [
        { id: 'c1', name: 'MCG Pro Driver', category: 'WOOD', type: 'DRIVER', loft: '9.0°', shaft: 'Stiff' },
        { id: 'c2', name: 'MCG Fairway', category: 'WOOD', type: '3-WOOD', loft: '15.0°', shaft: 'Stiff' },
        { id: 'c3', name: 'MCG Irons', category: 'IRON', type: 'IRON-3', shaft: 'Steel Stiff' },
        { id: 'c4', name: 'MCG Irons', category: 'IRON', type: 'IRON-4', shaft: 'Steel Stiff' },
        { id: 'c5', name: 'MCG Irons', category: 'IRON', type: 'IRON-5', shaft: 'Steel Stiff' },
        { id: 'c6', name: 'MCG Irons', category: 'IRON', type: 'IRON-6', shaft: 'Steel Stiff' },
        { id: 'c7', name: 'MCG Irons', category: 'IRON', type: 'IRON-7', shaft: 'Steel Stiff' },
        { id: 'c8', name: 'MCG Irons', category: 'IRON', type: 'IRON-8', shaft: 'Steel Stiff' },
        { id: 'c9', name: 'MCG Irons', category: 'IRON', type: 'IRON-9', shaft: 'Steel Stiff' },
        { id: 'c10', name: 'MCG Wedge', category: 'WEDGE', type: 'PW', loft: '48°', shaft: 'Wedge Flex' },
        { id: 'c11', name: 'MCG Wedge', category: 'WEDGE', type: 'SW', loft: '56°', shaft: 'Wedge Flex' },
        { id: 'c12', name: 'MCG Wedge', category: 'WEDGE', type: 'LW', loft: '60°', shaft: 'Wedge Flex' },
        { id: 'c13', name: 'MCG Blade', category: 'PUTTER', type: 'PUTTER', loft: '3.5°', shaft: 'Steel' }
    ]
};

export const MOCK_DETAILED_SG_STATS: DetailedSGStats = {
    userId: 'u1',
    handicap: 9.7,
    comparisonHandicap: 0.0,
    roundsAnalyzed: 25,
    overallSG: -13.7,
    overallTrend: -0.3,
    sgBreakdown: {
        driving: -1.3,
        approach: -4.8,
        short: -3.8,
        putting: -3.8
    },
    approachByTerrain: {
        tee: -1.7,
        fairway: -1.6,
        rough: -1.4,
        sand: -0.1,
        recovery: 0
    },
    approachByDistance: [
        { bucket: '50-74 yds', sg: -0.5, proximity: 45, targetProximity: 30, girPct: 47, targetGirPct: 77 },
        { bucket: '75-99 yds', sg: -0.6, proximity: 46, targetProximity: 34, girPct: 59, targetGirPct: 73 },
        { bucket: '100-124 yds', sg: -0.8, proximity: 46, targetProximity: 38, girPct: 48, targetGirPct: 69 },
        { bucket: '125-149 yds', sg: -0.8, proximity: 53, targetProximity: 45, girPct: 38, targetGirPct: 60 },
        { bucket: '150-174 yds', sg: -1.0, proximity: 53, targetProximity: 56, girPct: 31, targetGirPct: 46 },
        { bucket: '175-199 yds', sg: -0.6, proximity: 70, targetProximity: 72, girPct: 35, targetGirPct: 35 },
        { bucket: '200+ yds', sg: -0.5, proximity: 72, targetProximity: 140, girPct: 17, targetGirPct: 17 },
    ],
    girStats: {
        gir: 38,
        short: 36,
        long: 6,
        left: 8,
        right: 11
    },
    avgDistanceToPin: {
        gir: 31,
        all: 62,
        targetGir: 26,
        targetAll: 44
    },
    opportunities: ['Approach 150-174 yds', 'Tee Shots Par 3s', 'Sand Saves'],
    strengths: ['Driving Distance', 'Lag Putting', 'Recovery']
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'achievement', title: 'New Record', message: 'You hit your longest drive ever: 305y!', timestamp: new Date().toISOString(), status: 'unread', priority: 'medium', actionLabel: 'View Stats' },
    { id: 'n2', type: 'reminder', title: 'Practice Reminder', message: 'Time for your weekly putting drill.', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'unread', priority: 'low' },
];

export const MOCK_DRILLS: Drill[] = [
    {
        id: 'd1',
        title: 'Stable Wrist Takeaway',
        description: 'Get a feel for stable wrists from Address to Takeaway.',
        difficulty: 'BEGINNER',
        category: 'FULL_SWING',
        subcategory: 'BACKSWING',
        steps: [{ order: 1, text: 'Set up normally.' }, { order: 2, text: 'Keep lead wrist flat during takeaway.'}],
        thumbnailUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 10,
        goalCount: 20,
        goalUnit: 'reps'
    },
    {
        id: 'd2',
        title: 'Top Drill',
        description: 'Get a feel for the optimal flexion at the Top of your swing.',
        difficulty: 'INTERMEDIATE',
        category: 'FULL_SWING',
        subcategory: 'BACKSWING',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1622602737677-4b711979b939?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 15,
        goalCount: 20,
        goalUnit: 'reps'
    },
    {
        id: 'd3',
        title: 'Motorcycle Drill (P6)',
        description: 'Get a feel of flexing your wrists in from your Top to P6.',
        difficulty: 'ADVANCED',
        category: 'FULL_SWING',
        subcategory: 'DOWNSWING',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 15,
        goalCount: 20,
        goalUnit: 'reps'
    },
    {
        id: 'd4',
        title: 'Par 18',
        description: 'Improve your up & down skills by playing nine different chip shots & finishing them out.',
        difficulty: 'ADVANCED',
        category: 'CHIPPING',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1592919505780-30395071e867?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 30,
        goalCount: 18,
        goalUnit: 'score',
        facility: 'Chipping Green',
        materials: ['Wedge', 'Putter', '1 Ball']
    },
    {
        id: 'd5',
        title: 'The 5/2/2 Chipping Drill',
        description: 'Improve your landing area and roll-out control. Hit 10 longer chips to get a feel for roll. Then, hit 10 shorter chips.',
        difficulty: 'INTERMEDIATE',
        category: 'CHIPPING',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1615117904098-b80c294ce184?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 10,
        goalCount: 30,
        goalUnit: 'balls',
        facility: 'Chipping Green',
        materials: ['Wedges'],
        lastScore: 21
    },
    {
        id: 'd6',
        title: 'Avoiding The Right Miss',
        description: 'Try to hit the fairway, while imagining there\'s trouble on the right.',
        difficulty: 'INTERMEDIATE',
        category: 'DRIVER',
        subcategory: 'IMPACT',
        steps: [],
        thumbnailUrl: 'https://images.unsplash.com/photo-1535132011086-b8818f016104?auto=format&fit=crop&q=80&w=400',
        durationMinutes: 5,
        goalCount: 6,
        goalUnit: 'balls',
        facility: 'Driving Range'
    }
];

export const MOCK_PLANS: TrainingPlan[] = [
    {
        id: 'plan1',
        title: "Ball Striking 101",
        description: "A focused plan to improve ball striking consistency.",
        category: 'Technical',
        totalDrills: 2,
        durationLabel: '20 Minutes',
        progress: 50,
        thumbnailUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600',
        drillIds: ['d1', 'd3']
    },
    {
        id: 'plan2',
        title: "Hit More Fairways",
        description: "Eliminate the two-way miss off the tee.",
        category: 'Strategy',
        totalDrills: 5,
        durationLabel: '45 Minutes',
        progress: 0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=600',
        drillIds: ['d6']
    },
    {
        id: 'plan3',
        title: "Finding Fairways",
        description: "Advanced driving strategy.",
        category: 'Strategy',
        totalDrills: 3,
        durationLabel: '30 Minutes',
        progress: 0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12db464?auto=format&fit=crop&q=80&w=600',
        drillIds: []
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
        instructor: 'MCG Senior Instructor',
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
        instructor: 'MCG Staff',
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
        instructor: 'MCG Analytics',
        modules: [],
        totalDuration: 90,
        progress: 10,
        handicapImpact: 1.5,
        tagline: 'DATA DRIVEN'
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

export const MOCK_SESSIONS: PracticeSession[] = [
    {
        id: 'ts1',
        date: new Date(Date.now() - 86400000 * 2),
        location: 'Indoor Lab',
        shotsHit: 45,
        club: 'DRIVER',
        avgMetrics: { clubSpeed: 116, spinRate: 2400 },
        bestMetrics: { clubSpeed: 119 },
        consistencyScore: 88,
        notes: 'Feeling fast today.',
        drillId: 'd6',
        shots: [
            { id: 'sh1', timestamp: new Date(), club: 'Driver', result: 'PURE', metrics: { wristFlexion: -5, ulnarRadial: 3, hipRotation: 42 } },
            { id: 'sh2', timestamp: new Date(), club: 'Driver', result: 'PURE', metrics: { wristFlexion: -8, ulnarRadial: 12, hipRotation: 39 } },
            { id: 'sh3', timestamp: new Date(), club: 'Driver', result: 'THIN', metrics: { wristFlexion: -9, ulnarRadial: 20, hipRotation: 42 } },
            { id: 'sh4', timestamp: new Date(), club: 'Driver', result: 'FAT', metrics: { wristFlexion: 0, ulnarRadial: 7, hipRotation: 45 } },
            { id: 'sh5', timestamp: new Date(), club: 'Driver', result: 'PURE', metrics: { wristFlexion: -1, ulnarRadial: 14, hipRotation: 40 } },
        ]
    }
];

export const MOCK_ROUNDS: OnCourseRound[] = [
    {
        id: 'r1',
        courseName: 'Seaside Links',
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
    { id: 'h1', date: new Date('2024-01-01'), index: 12.4, trend: 'STABLE', roundsIncluded: 20 },
    { id: 'h2', date: new Date('2024-02-01'), index: 11.8, trend: 'DOWN', roundsIncluded: 20 },
    { id: 'h3', date: new Date('2024-03-01'), index: 9.7, trend: 'DOWN', roundsIncluded: 20 }
];

export const MOCK_COACH: CoachProfile = {
    id: 'coach1',
    name: 'Joseph Mayo',
    title: 'TrackMan Maestro',
    location: 'Las Vegas, NV',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    specialty: 'Swing Theory',
    rate: 500,
    isVerified: true,
    rating: 5.0,
    reviewCount: 412,
    tier: 'MASTER',
    availableSlots: ['Mon 10:00 AM', 'Wed 2:00 PM', 'Fri 11:00 AM']
};

export const MOCK_COACHES_LIST: CoachProfile[] = [
    MOCK_COACH
];

export const MOCK_COMMUNITY_FEED: CommunityPost[] = [
    {
        id: 'post1',
        author: {
            id: 'coach1',
            name: 'Joseph Mayo',
            avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
            type: 'COACH',
            badge: 'MASTER'
        },
        type: 'COACH_TIP',
        content: "Stop sliding your hips! To generate real power, you need to turn into your right heel, not slide over it. Watch this quick drill.",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        likes: 1240,
        comments: 85,
        isLiked: true,
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' // Placeholder video
    },
    {
        id: 'post2',
        author: {
            id: 'u2',
            name: 'Sarah Davis',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            type: 'USER'
        },
        type: 'SWING_REVIEW',
        content: "Finally breaking 80! Need some feedback on my transition. Feels a bit steep.",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        likes: 45,
        comments: 12,
        isLiked: false,
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        metadata: { score: 79, handicap: 12 }
    },
    {
        id: 'post3',
        author: {
            id: 'u3',
            name: 'Golf Enthusiast',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
            type: 'USER'
        },
        type: 'ACHIEVEMENT',
        content: "New Driver PR: 285 Yards carry! Speed training is paying off big time.",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        likes: 54,
        comments: 10,
        isLiked: true,
        metadata: { score: 285, club: 'Driver' }
    }
];

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
        playerName: 'Tour Pro A',
        club: 'DRIVER',
        angle: 'FACE_ON',
        videoUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1599587425330-749e7b243452?auto=format&fit=crop&q=80&w=200',
        keyMetrics: [{ name: 'Shoulder Turn', value: '110°' }]
    },
    {
        id: 'pro2',
        playerName: 'Tour Pro B',
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
        name: 'Jane Doe',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
        handicap: 5.2,
        homeCourse: 'City Links',
        status: 'PLAYING',
        lastActive: new Date(),
        mutualFriends: 12,
        roundsTogether: 8
    },
    {
        id: 'f2',
        name: 'Bob Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        handicap: 12.5,
        homeCourse: 'Valley Green',
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
        userName: 'Jane Doe',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
        type: 'ROUND',
        timestamp: new Date(Date.now() - 3600000),
        data: { score: 78, course: 'City Links', par: 72 },
        likes: 12,
        comments: 2,
        hasLiked: false
    },
    {
        id: 'a2',
        userId: 'f2',
        userName: 'Bob Smith',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        type: 'ACHIEVEMENT',
        timestamp: new Date(Date.now() - 86400000),
        data: { achievement: '30-Day Streak', description: 'Practiced for 30 days straight!' },
        likes: 8,
        comments: 3,
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
    { name: 'Driver', avgDistance: 260, minDistance: 240, maxDistance: 280, dispersion: 25 },
    { name: '3 Wood', avgDistance: 235, minDistance: 220, maxDistance: 250, dispersion: 20 },
    { name: '7 Iron', avgDistance: 165, minDistance: 155, maxDistance: 175, dispersion: 12 },
    { name: 'PW', avgDistance: 125, minDistance: 115, maxDistance: 135, dispersion: 10 },
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
    { roundId: 'r1', date: new Date(), courseName: 'Seaside Links', offTheTee: 1.2, approach: -0.5, aroundGreen: 0.8, putting: -0.2, total: 1.3, benchmarkHandicap: 5, totalStrokes: 74, coursePar: 72 },
    { roundId: 'r2', date: new Date(Date.now() - 86400000), courseName: 'Forest Dunes', offTheTee: 0.5, approach: -1.2, aroundGreen: -0.1, putting: 0.5, total: -0.3, benchmarkHandicap: 5, totalStrokes: 76, coursePar: 72 },
    { roundId: 'r3', date: new Date(Date.now() - 172800000), courseName: 'Desert Canyon', offTheTee: -0.8, approach: 0.2, aroundGreen: 0.5, putting: 1.1, total: 1.0, benchmarkHandicap: 5, totalStrokes: 73, coursePar: 72 },
];

export const MOCK_GOLF_PROFILE: GolfProfile = {
    handicap: 9.7,
    skillLevel: 'intermediate',
    handPreference: 'right',
    averageScore: 82,
    drivingDistance: 260,
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
    { provider: 'apple', connected: false },
    { provider: 'sensor_kit', connected: true, lastSynced: '2 days ago', name: 'Launch Monitor' }
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
    courseName: 'Seaside Links',
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

export const MOCK_TRANSACTIONS: CreditTransaction[] = [
    { id: 'tx1', date: new Date(Date.now() - 86400000 * 1), type: 'USAGE', amount: -50, description: 'Live Swing Review' },
    { id: 'tx2', date: new Date(Date.now() - 86400000 * 5), type: 'PURCHASE', amount: 500, description: 'Medium Credit Pack' },
    { id: 'tx3', date: new Date(Date.now() - 86400000 * 30), type: 'BONUS', amount: 100, description: 'Monthly Pro Plan Bonus' },
];

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
