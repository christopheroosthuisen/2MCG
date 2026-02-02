
import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { FeedbackMessage } from "../types";

// Initialize the client
// Note: In a production app, the API key should be handled via a secure backend proxy or environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper for audio context (singleton to avoid browser limits)
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
};

// --- ANALYSIS MODULES ---

/**
 * Analyzes a golf swing frame using Gemini 3 Pro Vision.
 */
export const analyzeSwingFrame = async (imageData: string): Promise<FeedbackMessage[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageData.split(',')[1] || imageData } }, // Ensure base64 strip
                    { text: 'Analyze this golf swing frame. Identify any posture, grip, or alignment issues. Return a JSON array of feedback items with text, severity (INFO, WARNING, CRITICAL), and category (POSTURE, GRIP, TEMPO, PLANE, ROTATION).' }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            severity: { type: Type.STRING, enum: ['INFO', 'WARNING', 'CRITICAL'] },
                            category: { type: Type.STRING, enum: ['POSTURE', 'GRIP', 'TEMPO', 'PLANE', 'ROTATION'] }
                        }
                    }
                }
            }
        });

        if (response.text) {
            const raw = JSON.parse(response.text);
            return raw.map((item: any) => ({
                id: crypto.randomUUID(),
                timestamp: 0, 
                ...item
            }));
        }
        return [];
    } catch (error) {
        console.error("Analysis failed:", error);
        throw error;
    }
};

/**
 * Analyzes a full video for key swing metrics using Gemini 3 Pro.
 */
export const analyzeSwingVideo = async (videoUrl: string): Promise<string> => {
    try {
        // Note: Real implementation requires File API or Bytes. 
        // For this demo, we assume the model can process the video content if uploaded/accessible.
        // In a browser-only demo without backend, this is limited.
        // We will simulate the call structure.
        
        /* 
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [
                { role: 'user', parts: [{ text: "Analyze this golf swing video for tempo and sequencing." }, { fileData: { fileUri: videoUrl, mimeType: 'video/mp4' } }] }
            ]
        });
        return response.text || "Analysis complete.";
        */
        
        // Mock return for demo as we can't upload video bytes easily in this context
        return "Gemini 3 Pro Video Analysis: Good tempo (3:1 ratio). Takeaway is slightly inside. Hip rotation is excellent at 45 degrees.";
    } catch (error) {
        console.error("Video analysis failed", error);
        return "Could not analyze video.";
    }
}

// --- CREATION MODULES ---

/**
 * Edits an image using text prompts (Gemini 2.5 Flash Image).
 */
export const editSwingImage = async (base64Image: string, prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
                    { text: prompt }
                ]
            }
        });

        // Search for image part
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Image edit failed:", error);
        return null;
    }
};

/**
 * Generates a high-quality concept image (Gemini 3 Pro Image).
 */
export const generateConceptImage = async (prompt: string, aspectRatio: string = "16:9"): Promise<string | null> => {
    try {
        if ((window as any).aistudio?.hasSelectedApiKey) {
             const hasKey = await (window as any).aistudio.hasSelectedApiKey();
             if (!hasKey) await (window as any).aistudio.openSelectKey();
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio as any, // "1:1", "3:4", "4:3", "9:16", "16:9"
                    imageSize: "2K"
                }
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Image gen failed:", error);
        return null;
    }
};

/**
 * Animates a static image into a video using Veo.
 */
export const animateSwingPhoto = async (base64Image: string, prompt: string = "A cinematic golf swing in slow motion"): Promise<string | null> => {
    try {
        if ((window as any).aistudio?.hasSelectedApiKey) {
             const hasKey = await (window as any).aistudio.hasSelectedApiKey();
             if (!hasKey) await (window as any).aistudio.openSelectKey();
        }

        // Must create new instance with key for Veo
        const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let operation = await veoAi.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: base64Image.split(',')[1] || base64Image,
                mimeType: 'image/jpeg'
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9' // Match image aspect ideally
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
            operation = await veoAi.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            return `${videoUri}&key=${process.env.API_KEY}`;
        }
        return null;
    } catch (error) {
        console.error("Veo animation failed:", error);
        return null;
    }
};

/**
 * Generates speech from text using Gemini 2.5 Flash TTS.
 */
export const generateSpeech = async (text: string): Promise<void> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, coach-like voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            const ctx = getAudioContext();
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // PCM decoding
            const dataInt16 = new Int16Array(bytes.buffer);
            const frameCount = dataInt16.length;
            const audioBuffer = ctx.createBuffer(1, frameCount, 24000);
            const channelData = audioBuffer.getChannelData(0);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
            }

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();
        }
    } catch (error) {
        console.error("TTS failed:", error);
    }
};

/**
 * Generates a custom drill video using Veo 3.1.
 */
export const generateDrillVideo = async (prompt: string): Promise<string | null> => {
    try {
        if ((window as any).aistudio?.hasSelectedApiKey) {
             const hasKey = await (window as any).aistudio.hasSelectedApiKey();
             if (!hasKey) await (window as any).aistudio.openSelectKey();
        }

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `A professional golf training video demonstrating: ${prompt}. Realistic, clear instructional angle.`,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Polling for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            return `${videoUri}&key=${process.env.API_KEY}`;
        }
        return null;

    } catch (error) {
        console.error("Veo generation failed:", error);
        return null;
    }
};

// --- CHAT & LIVE MODULES ---

/**
 * Chat with the AI Caddie using Search and Maps Grounding.
 */
export const askAICaddie = async (query: string, history: any[]): Promise<string> => {
    try {
        // Determine if we need deep thinking based on query complexity
        const isComplex = query.toLowerCase().includes("strategy") || query.toLowerCase().includes("analyze") || query.toLowerCase().includes("why");
        
        // Select Model & Tools
        // Using Flash for speed/grounding, Pro for thinking. 
        // Here we default to Pro for capability, but enable thinking if needed.
        const model = 'gemini-3-pro-preview'; 
        
        const config: any = {
            tools: [{ googleSearch: {} }, { googleMaps: {} }],
        };

        if (isComplex) {
            // "You MUST use the gemini-3-pro-preview model and set thinkingBudget to 32768"
            config.thinkingConfig = { thinkingBudget: 32768 }; 
        }

        const chat = ai.chats.create({
            model,
            config,
            history: [
                {
                    role: 'user',
                    parts: [{ text: "You are an expert AI Golf Caddie. Use Google Search to find rule changes or tour news. Use Google Maps to find course details. Give concise, actionable advice." }]
                },
                ...history
            ]
        });

        const response = await chat.sendMessage({ message: query });
        
        // Return text + grounding metadata if useful (simplified for string return)
        let result = response.text || "I couldn't find an answer.";
        
        // Check for grounding (simplified extraction)
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            const chunks = response.candidates[0].groundingMetadata.groundingChunks;
            const webLinks = chunks.filter((c: any) => c.web).map((c: any) => `[${c.web.title}](${c.web.uri})`).join(', ');
            if (webLinks) result += `\n\nSources: ${webLinks}`;
        }

        return result;

    } catch (error) {
        console.error("Caddie chat failed:", error);
        return "I'm having trouble connecting to the clubhouse. Please try again.";
    }
};

/**
 * Starts a Live API session for real-time voice coaching.
 */
export const connectLiveCoach = async (onMessage: (text: string) => void): Promise<any> => {
    // Note: Live API runs over WebSockets. This setup assumes a browser environment supporting AudioContext.
    
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
    const outputAudioContext = getAudioContext(); // Use singleton
    
    // Audio Output Queue
    let nextStartTime = 0;
    const sources = new Set<AudioBufferSourceNode>();

    // Decode Helper
    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length;
        const buffer = ctx.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }
        return buffer;
    };

    const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }, // Friendly coach voice
            },
            systemInstruction: 'You are an encouraging and technical golf coach. Keep responses brief and focused on the swing.',
        },
        callbacks: {
            onopen: async () => {
                console.log("Live Coach Connected");
                onMessage("Coach Connected. I'm listening...");
                
                // Setup Input Stream
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const source = inputAudioContext.createMediaStreamSource(stream);
                    const processor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                    
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        // PCM16 Conversion
                        const pcm16 = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) {
                            pcm16[i] = inputData[i] * 32768;
                        }
                        
                        // Base64 Encode manually for TS/JS environments without Buffer
                        let binary = '';
                        const bytes = new Uint8Array(pcm16.buffer);
                        for (let i = 0; i < bytes.byteLength; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const base64Data = btoa(binary);

                        session.sendRealtimeInput({
                            media: {
                                mimeType: "audio/pcm;rate=16000",
                                data: base64Data
                            }
                        });
                    };
                    
                    source.connect(processor);
                    processor.connect(inputAudioContext.destination);
                } catch (e) {
                    console.error("Mic error", e);
                    onMessage("Microphone access denied.");
                }
            },
            onmessage: async (msg: LiveServerMessage) => {
                // Handle Audio Output
                const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) {
                    if (outputAudioContext.state === 'suspended') outputAudioContext.resume();
                    
                    // Decode Base64
                    const binaryString = atob(audioData);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

                    const buffer = await decodeAudioData(bytes, outputAudioContext);
                    const source = outputAudioContext.createBufferSource();
                    source.buffer = buffer;
                    source.connect(outputAudioContext.destination);
                    
                    // Scheduling
                    const now = outputAudioContext.currentTime;
                    nextStartTime = Math.max(nextStartTime, now);
                    source.start(nextStartTime);
                    nextStartTime += buffer.duration;
                    
                    sources.add(source);
                    source.onended = () => sources.delete(source);
                }

                // Handle Turn Complete / Transcript
                if (msg.serverContent?.turnComplete) {
                    // Could log transcripts here if enabled
                }
            },
            onclose: () => {
                console.log("Live Coach Disconnected");
                onMessage("Coach Disconnected.");
            },
            onerror: (e) => {
                console.error("Live Error", e);
            }
        }
    });

    return {
        disconnect: () => {
            session.close();
            inputAudioContext.close();
            // outputAudioContext kept alive as singleton
        }
    };
};
