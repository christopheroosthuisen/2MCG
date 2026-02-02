
/**
 * Swing Analysis Service
 *
 * Comprehensive AI-powered golf swing analysis using Google Gemini's
 * visual understanding and robotics capabilities.
 *
 * Pipeline:
 * 1. Video Upload & Auto-Trim (detect swing start/end)
 * 2. P1-P10 Position Detection (tag exact frames)
 * 3. Frame Extraction & Skeleton Overlay
 * 4. Angle Measurement & Comparison to Ideals
 * 5. AI Coaching Feedback per Position
 * 6. Overall Report with Recommendations & Drills
 */

import { GoogleGenAI, Type, Modality } from "@google/genai";
import {
    SwingPositionId,
    SwingPositionDefinition,
    DetectedPosition,
    SkeletonJointData,
    SkeletonJoint,
    SkeletonConnection,
    MeasuredAngle,
    PositionCoachingFeedback,
    VideoTrimResult,
    FullSwingAnalysis,
    CoachingRecommendation,
    RecommendedDrill,
} from "../types";

// ============================================================
// GEMINI CLIENT
// ============================================================

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const VISION_MODEL = 'gemini-3-pro-preview';
const FAST_MODEL = 'gemini-3-flash-preview';

// ============================================================
// P1-P10 SWING POSITION DEFINITIONS
// ============================================================

export const SWING_POSITIONS: SwingPositionDefinition[] = [
    {
        id: 'P1',
        name: 'Setup',
        fullName: 'P1 - Setup / Address',
        description: 'Stance should be closed, right knee should be flexed more than left knee, lower/mid spine should be neutral and the cervical spine and head should be angled down.',
        checkpoints: [
            'Stance width appropriate for club',
            'Right knee flexed more than left',
            'Spine neutral with slight forward tilt',
            'Head angled down, eyes on ball'
        ],
        idealAngles: [
            { name: 'Spine Tilt', min: 25, max: 40, ideal: 33 },
            { name: 'Knee Flex', min: 15, max: 30, ideal: 22 },
            { name: 'Hip Hinge', min: 30, max: 45, ideal: 38 }
        ]
    },
    {
        id: 'P2',
        name: 'Shaft Parallel (Back)',
        fullName: 'P2 - Club Shaft Parallel to Ground in Backswing',
        description: 'The clubshaft and left arm should be parallel to the target line.',
        checkpoints: [
            'Club shaft parallel to ground',
            'Club head just outside left shoe tip',
            'Right wrist hinging',
            'Left arm straight'
        ],
        idealAngles: [
            { name: 'Wrist Hinge', min: 20, max: 40, ideal: 30 },
            { name: 'Shoulder Turn', min: 25, max: 45, ideal: 35 }
        ]
    },
    {
        id: 'P4',
        name: 'Top of Backswing',
        fullName: 'P4 - Top of the Backswing',
        description: 'Full shoulder turn, hands high, right leg bracing weight.',
        checkpoints: [
            'Hands deeper than right shoulder',
            'Right glute is the deepest point',
            'Right knee straightened but not locked',
            'Full shoulder turn (90°+)'
        ],
        idealAngles: [
            { name: 'Shoulder Turn', min: 85, max: 110, ideal: 95 },
            { name: 'Hip Turn', min: 35, max: 55, ideal: 45 },
            { name: 'X-Factor', min: 35, max: 55, ideal: 45 }
        ]
    },
    {
        id: 'P7',
        name: 'Impact',
        fullName: 'P7 - Impact',
        description: 'The moment of truth. Hips open, shoulders slightly open, hands leading.',
        checkpoints: [
            'Left knee straight (posted up)',
            'Hips open 40-45° to target',
            'Head behind the ball',
            'Shaft lean forward'
        ],
        idealAngles: [
            { name: 'Hip Open', min: 35, max: 50, ideal: 42 },
            { name: 'Shaft Lean', min: 8, max: 20, ideal: 14 },
            { name: 'Spine Tilt', min: 15, max: 35, ideal: 25 }
        ]
    },
    {
        id: 'P10',
        name: 'Finish',
        fullName: 'P10 - Finish',
        description: 'Balanced on lead leg, belt buckle to target.',
        checkpoints: [
            'Belt buckle facing target',
            'Weight on outside edge of left foot',
            'Right foot on tippy toe only',
            'Balanced finish'
        ],
        idealAngles: [
            { name: 'Hip Rotation', min: 80, max: 100, ideal: 90 },
            { name: 'Balance', min: 85, max: 100, ideal: 95 }
        ]
    }
];

// ============================================================
// SKELETON CONNECTIONS
// ============================================================

export const SKELETON_CONNECTIONS: SkeletonConnection[] = [
    { from: 'HEAD', to: 'NECK', color: '#FFD700' },
    { from: 'NECK', to: 'SPINE_MID', color: '#FFD700' },
    { from: 'SPINE_MID', to: 'SPINE_BASE', color: '#FFD700' },
    { from: 'NECK', to: 'LEFT_SHOULDER', color: '#00BFFF' },
    { from: 'NECK', to: 'RIGHT_SHOULDER', color: '#FF6347' },
    { from: 'LEFT_SHOULDER', to: 'LEFT_ELBOW', color: '#00BFFF' },
    { from: 'LEFT_ELBOW', to: 'LEFT_WRIST', color: '#00BFFF' },
    { from: 'RIGHT_SHOULDER', to: 'RIGHT_ELBOW', color: '#FF6347' },
    { from: 'RIGHT_ELBOW', to: 'RIGHT_WRIST', color: '#FF6347' },
    { from: 'SPINE_BASE', to: 'LEFT_HIP', color: '#00BFFF' },
    { from: 'SPINE_BASE', to: 'RIGHT_HIP', color: '#FF6347' },
    { from: 'LEFT_HIP', to: 'LEFT_KNEE', color: '#00BFFF' },
    { from: 'LEFT_KNEE', to: 'LEFT_ANKLE', color: '#00BFFF' },
    { from: 'RIGHT_HIP', to: 'RIGHT_KNEE', color: '#FF6347' },
    { from: 'RIGHT_KNEE', to: 'RIGHT_ANKLE', color: '#FF6347' },
    { from: 'LEFT_HAND', to: 'CLUB_GRIP', color: '#32CD32' },
    { from: 'CLUB_GRIP', to: 'CLUB_HEAD', color: '#32CD32' },
];

// ============================================================
// AI ANALYSIS FUNCTIONS
// ============================================================

export async function detectSwingBoundaries(videoData: string, mimeType: string): Promise<VideoTrimResult> {
    try {
        const response = await ai.models.generateContent({
            model: VISION_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType, data: videoData } },
                    { text: `Analyze video. Find frame timestamp for Start of Swing and End of Swing. Return JSON.` }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        originalDuration: { type: Type.NUMBER },
                        trimmedStartTime: { type: Type.NUMBER },
                        trimmedEndTime: { type: Type.NUMBER },
                        trimmedDuration: { type: Type.NUMBER },
                        swingDetected: { type: Type.BOOLEAN },
                        confidence: { type: Type.NUMBER }
                    }
                }
            }
        });
        return response.text ? JSON.parse(response.text) : { originalDuration: 5, trimmedStartTime: 0, trimmedEndTime: 5, trimmedDuration: 5, swingDetected: false, confidence: 0 };
    } catch (e) {
        console.error("Boundaries failed", e);
        return { originalDuration: 5, trimmedStartTime: 0, trimmedEndTime: 5, trimmedDuration: 5, swingDetected: false, confidence: 0 };
    }
}

export async function analyzeFramePose(frameImageData: string, positionId: SwingPositionId): Promise<{ skeleton: SkeletonJointData[]; angles: MeasuredAngle[]; }> {
    try {
        const response = await ai.models.generateContent({
            model: VISION_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: frameImageData } },
                    { text: `Identify skeleton joints and angles for golf swing position ${positionId}. Return JSON.` }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skeleton: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    joint: { type: Type.STRING },
                                    x: { type: Type.NUMBER },
                                    y: { type: Type.NUMBER },
                                    confidence: { type: Type.NUMBER },
                                    visible: { type: Type.BOOLEAN }
                                }
                            }
                        },
                        angles: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    value: { type: Type.NUMBER },
                                    idealMin: { type: Type.NUMBER },
                                    idealMax: { type: Type.NUMBER },
                                    idealValue: { type: Type.NUMBER },
                                    status: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return response.text ? JSON.parse(response.text) : { skeleton: [], angles: [] };
    } catch (e) {
        return { skeleton: [], angles: [] };
    }
}

export async function generatePositionCoaching(frameImageData: string, positionId: SwingPositionId, measuredAngles: MeasuredAngle[]): Promise<PositionCoachingFeedback[]> {
    try {
        const response = await ai.models.generateContent({
            model: VISION_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: frameImageData } },
                    { text: `Analyze this ${positionId} frame. Measured angles: ${JSON.stringify(measuredAngles)}. Provide coaching feedback.` }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            category: { type: Type.STRING },
                            severity: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            correction: { type: Type.STRING },
                            proReference: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const items = response.text ? JSON.parse(response.text) : [];
        return items.map((i: any) => ({ ...i, id: crypto.randomUUID() }));
    } catch (e) {
        return [];
    }
}

export async function generateSwingReport(positions: DetectedPosition[], clubUsed: string, cameraAngle: string): Promise<any> {
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: [{ parts: [{ text: `Generate golf swing report for ${clubUsed} shot. Positions analyzed: ${positions.length}.` }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.NUMBER },
                        overallGrade: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    priority: { type: Type.STRING },
                                    category: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    positionRefs: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    drillIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    estimatedImpact: { type: Type.STRING }
                                }
                            }
                        },
                        drills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    category: { type: Type.STRING },
                                    difficulty: { type: Type.STRING },
                                    duration: { type: Type.STRING },
                                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    targetPositions: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    expectedImprovement: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return response.text ? JSON.parse(response.text) : {};
    } catch (e) {
        return { overallScore: 0, overallGrade: 'N/A', strengths: [], weaknesses: [], recommendations: [], drills: [] };
    }
}
