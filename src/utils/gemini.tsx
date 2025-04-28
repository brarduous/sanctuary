import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY, });

export async function getSermonByTopic(topic: string) {
  const prompt = `You are a helpful theological assistant specialized in crafting Christian sermons. Your task is to generate a sermon based on the input provided.

The sermon must be structured as a JSON object containing the following keys:
- "scripture": The primary scripture passage for the sermon (can be null if the input is not scripture-based or if no specific passage is central).
- "title": A compelling title for the sermon.
- "illustration": A relevant story or illustration to engage the audience (include only if requested).
- "sermon_outline": A bulleted list outlining the main points of the sermon.
- "key_takeaways": A list of 2-3 key messages or application points for the congregation.
- "sermon_body": The main text of the sermon, expounding on the scripture/topic and outline points. Aim for about 3000-4200 words for the appropriate sermon lenght of 20-30 minutes of oration.

Please ensure the output is ONLY the JSON object and nothing else.

Input type: Topic
Topic: ${topic}
Include Illustration: true

Generate the sermon based on this topic. You may select a relevant scripture passage to include in the "scripture" field of the JSON, or leave it null if no single passage is central.
`
  const response = await ai.models.generateContent({

    model: "gemini-2.0-flash",
    contents: prompt
  });

  return response.text;
}   

export async function getSermonByScripture(scripture: string) {
  const prompt = `You are a helpful theological assistant specialized in crafting Christian sermons. Your task is to generate a sermon based on the input provided.

The sermon must be structured as a JSON object containing the following keys:
- "scripture": The primary scripture passage for the sermon (can be null if the input is not scripture-based or if no specific passage is central).
- "title": A compelling title for the sermon.
- "illustration": A relevant story or illustration to engage the audience (include only if requested).
- "sermon_outline": A bulleted list outlining the main points of the sermon.
- "key_takeaways": A list of 2-3 key messages or application points for the congregation.
- "sermon_body": The main text of the sermon, expounding on the scripture/topic and outline points. Aim for about 3000-4200 words for the appropriate sermon lenght of 20-30 minutes of oration.

Please ensure the output is ONLY the JSON object and nothing else.

Input type: Scripture
Scripture: ${scripture}
Include Illustration: true

Generate the sermon based on this scripture. You may select other relevant scripture passages to include in the "scripture" field of the JSON, or simply use the provided scripture as the main focus.
`
  const response = await ai.models.generateContent({

    model: "gemini-2.0-flash",
    contents: prompt
  });

  return response.text;
}   