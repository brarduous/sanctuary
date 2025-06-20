import OpenAI from 'openai';
const client = new OpenAI({
    apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'], 
    dangerouslyAllowBrowser: true,
  });

const sermon_prompt= `
You are a helpful theological assistant specialized in crafting Christian sermons. Your task is to generate a sermon based on the input provided.

The sermon must be structured as a JSON object containing the following keys:
- "scripture": The primary scripture passage for the sermon (can be null if the input is not scripture-based or if no specific passage is central).
- "title": A compelling title for the sermon.
- "illustration": A relevant story or illustration to engage the audience (include only if requested).
- "sermon_outline": A bulleted list outlining the main points of the sermon.
- "key_takeaways": A list of 3-5 key application points for the congregation.
- "sermon_body": The main text of the sermon, expounding on the scripture/topic and outline points. The sermon body must me no fewer than 2500 words and no more than 4200 words for the appropriate sermon length of 20-30 minutes of oration. Please format with headings, etc, using markdown.

Please ensure the output is ONLY the JSON object and nothing else, and doublecheck that the sermon_body output is at least 2500 words..
`;

export async function getSermonByTopic(topic: string) {
  const response = await client.responses.create({
    model: 'gpt-4.1',
    tools: [{
        type: "file_search",
        vector_store_ids: ["vs_6810f6e8cda88191995059a0a355af26"],
        max_num_results: 20
      }],
    instructions: sermon_prompt,
    input: 'Topic: ' + topic + '\nInclude Illustration: true\nGenerate the sermon based on this topic. You may select a relevant scripture passage to include in the "scripture" field of the JSON, or leave it null if no single passage is central.'
    
  });

    const sermon = response.output_text;
    return sermon;
}
  
const bible_study_prompt= `
You are a helpful theological assistant specialized in crafting Christian bible studies. Your task is to generate a bible study based on the input provided.

The bible study must be structured as a JSON object containing the following keys:
- "title": The title of the study, taken from the input provided. Could be a book of the Bible, a topic, or a theme.
- "subtitle": A subtitle for the study, providing additional context or focus.
- "illustration": A relevant story or illustration to engage the audience (include only if requested).
- "studies": An array (length of which is derived from the length provided in input) of json study objects that follow the following keys: "title": A compelling title for the study, "scripture": The primary scripture passage for the study (can be null if the input is not scripture-based or if no specific passage is central), "study_outline": A list of 5-7 key application points for the congregation, "study_body": The main text of the study, expounding on the scripture/topic and study_outline points. The study body must me no fewer than 500 words and no more than 1000 words. Please format with headings, etc, using markdown, "reflection_questions": A array of 1-5 questions for personal reflection or group discussion.

Please ensure the output is ONLY the JSON object and nothing else.
`;  

export async function getBibleStudy(topic: string, length: number) {
  const response = await client.responses.create({
    model: 'gpt-4.1',
    tools: [{
        type: "file_search",
        vector_store_ids: ["vs_6810f6e8cda88191995059a0a355af26"],
        max_num_results: 20
      }],
    instructions: bible_study_prompt,
    input: 'Topic: ' + topic + '\nLength:'+ length + '\nInclude Illustration: true\nGenerate the bible study based on this topic. You may select a relevant scripture passage to include in the "scripture" field of the JSON, or leave it null if no single passage is central.'
    
  });

    const study = response.output_text;
    return study;
}