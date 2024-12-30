import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const vertex_ai = new VertexAI({ project: process.env.GOOGLE_KEY, location: 'us-central1' });

export const getTextGemini = async (prompt, model, temperature = 0.7) => {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generation_config: {
            max_output_tokens: 4096,
            temperature: temperature
        }
    });

    const chat = generativeModel.startChat({});
    const result = await chat.sendMessage([{ text: prompt }]);
    return result?.response?.candidates?.[0].content?.parts?.[0]?.text;
};

export const analyzeTopicTrends = async (topics) => {
    const prompt = `Analyze trends for these topics: ${JSON.stringify(topics)}. 
                   Provide insights on popularity, sentiment, and key discussion points.`;
    return getTextGemini(prompt, 'gemini-exp-1206');
};

export const generateTopicSuggestions = async (userInterests) => {
    const prompt = `Based on these interests: ${JSON.stringify(userInterests)}, 
                   suggest relevant discussion topics that would engage users.`;
    return getTextGemini(prompt, 'gemini-exp-1206');
};

export const processNaturalLanguageVote = async (voteText) => {
    const prompt = `Parse this natural language vote: "${voteText}". 
                   Extract the core vote intention, sentiment, and any conditions.`;
    return getTextGemini(prompt, 'gemini-exp-1206');
};

export const getContextualRecommendations = async (userActivity, currentTopic) => {
    const prompt = `Given user activity: ${JSON.stringify(userActivity)} 
                   and current topic: ${currentTopic}, 
                   suggest personalized content recommendations.`;
    return getTextGemini(prompt, 'gemini-exp-1206');
};

export const predictTopicEngagement = async (topicData) => {
    const prompt = `Analyze this topic data: ${JSON.stringify(topicData)}. 
                   Predict likely engagement levels and user interaction patterns.`;
    return getTextGemini(prompt, 'gemini-exp-1206');
};

export const summarizeDiscussionTrends = async (discussionData) => {
    const prompt = `Summarize key trends from this discussion data: 
                   ${JSON.stringify(discussionData)}. 
                   Identify main themes, controversies, and consensus points.`;
    return getTextGemini(prompt, 'gemini-exp-1206');
};
