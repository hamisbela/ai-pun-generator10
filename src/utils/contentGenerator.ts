// Using Cloudflare Workers AI for text generation
const generateWithAI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{46a9d5f046f410e8c01223d64119e8be}/ai/run/@cf/meta/llama-2-7b-chat-int8', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a creative AI assistant specialized in generating witty and clever content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.result.response;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
};

const generatePrompt = (topic: string, type: string): string => {
  const prompts = {
    puns: `Generate 5 clever puns about "${topic}".
Requirements:
- Each pun should be witty and original
- Include wordplay that relates to the topic
- Keep them family-friendly
- Make them memorable and shareable

Return only the 5 puns, one per line, without numbers or additional text.`,

    jokes: `Generate 5 original jokes about "${topic}".
Requirements:
- Each joke should be clever and witty
- Include setup and punchline
- Keep them family-friendly
- Make them engaging and memorable

Return only the 5 jokes, one per line, without numbers or additional text.`,

    wordplay: `Generate 5 creative wordplay examples about "${topic}".
Requirements:
- Use clever linguistic techniques
- Include double meanings or homophones
- Keep them family-friendly
- Make them intellectually engaging

Return only the 5 wordplay examples, one per line, without numbers or additional text.`,

    riddles: `Generate 5 clever riddles about "${topic}".
Requirements:
- Each riddle should be challenging but solvable
- Include wordplay and clever misdirection
- Keep them family-friendly
- Make them thought-provoking

Return only the 5 riddles, one per line, without numbers or additional text.`,

    epigrams: `Generate 5 witty epigrams about "${topic}".
Requirements:
- Each epigram should be concise and memorable
- Include clever observations or paradoxes
- Keep them family-friendly
- Make them thought-provoking

Return only the 5 epigrams, one per line, without numbers or additional text.`
  };

  return prompts[type as keyof typeof prompts] || prompts.puns;
};

export const generateContent = async (
  topic: string,
  type: string = 'puns'
): Promise<string[]> => {
  if (!import.meta.env.VITE_CLOUDFLARE_API_TOKEN) {
    // Fallback content if API token is not set
    return [
      "Why did the AI go to therapy? It had too many processing issues!",
      "What do you call a computer that sings? A Dell-a-cappella!",
      "Why don't programmers like nature? It has too many bugs!",
      "What did the router say to the doctor? I feel a bit disconnected!",
      "Why did the cookie go to the doctor? Because it was feeling crumbly!"
    ];
  }

  try {
    const result = await generateWithAI(generatePrompt(topic, type));
    return result.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
};