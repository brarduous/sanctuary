// lib/api.ts (or .js)
import axios from 'axios';

// Ensure this matches the URL where your Node.js backend is hosted/running
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';

// Function to initiate Daily Devotional generation
export async function generateDevotionalBackend(userId: string, focusAreas: string[], improvementAreas: string[]) {
    try {
        const response = await axios.post(`${BACKEND_API_URL}/generate-devotional`, {
            userId,
            focusAreas,
            improvementAreas,
        });
        return response.data; // Should return { message: ..., devotionalId: ..., status: 'pending' }
    } catch (error) {
        console.error('Error initiating devotional generation:', error);
        throw error;
    }
}

// Function to initiate Sermon generation by Topic
export async function generateSermonByTopicBackend(userId: string, topic: string, userProfile: any) {
    try {
        const response = await axios.post(`${BACKEND_API_URL}/generate-sermon-by-topic`, {
            userId,
            topic,
            userProfile, // Pass the entire userProfile object or just sermon_preferences
        });
        return response.data; // Should return { message: ..., sermonId: ..., status: 'pending' }
    } catch (error) {
        console.error('Error initiating sermon generation by topic:', error);
        throw error;
    }
}

// Function to initiate Sermon generation by Scripture
export async function generateSermonByScriptureBackend(userId: string, scripture: string, userProfile: any) {
    try {
        const response = await axios.post(`${BACKEND_API_URL}/generate-sermon-by-scripture`, {
            userId,
            scripture,
            userProfile,
        });
        return response.data; // Should return { message: ..., sermonId: ..., status: 'pending' }
    } catch (error) {
        console.error('Error initiating sermon generation by scripture:', error);
        throw error;
    }
}

// Function to initiate Bible Study generation
export async function generateBibleStudyBackend(userId: string, topic: string, length: number, method: string) {
    try {
        const response = await axios.post(`${BACKEND_API_URL}/generate-bible-study`, {
            userId,
            topic,
            length,
            method,
        });
        return response.data; // Should return { message: ..., studyId: ..., status: 'pending' }
    } catch (error) {
        console.error('Error initiating Bible study generation:', error);
        throw error;
    }
}

// If you need to fetch lists from backend (optional, but good for consistency)
// export async function getSermonsBackend(userId: string) {
//     try {
//         const response = await axios.get(`${BACKEND_API_URL}/sermons/${userId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching sermons from backend:', error);
//         throw error;
//     }
// }
// ... and so on for other fetching functions if you decide to move them to backend