import OpenAI from "openai";
import { CustomStoryRequest } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface GeneratedStory {
  content: string;
  illustrations: string[];
  description: string;
}

export async function generateStory(request: CustomStoryRequest): Promise<GeneratedStory> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const storyResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional children's story writer. Create engaging, age-appropriate stories that are educational, fun, and inspiring. Always ensure content is safe and suitable for children. 
          
          Respond with JSON in this exact format:
          {
            "content": "The full story text with clear paragraphs and dialogue",
            "description": "A brief 2-3 sentence description of the story",
            "illustration_prompts": ["Detailed description for illustration 1", "Detailed description for illustration 2", ...]
          }
          
          Make sure to include the character names provided by the user throughout the story.`
        },
        {
          role: "user",
          content: `Create a ${request.pageCount}-page story for children aged ${request.ageGroup} in the ${request.genre} genre. 
          
          Theme: ${request.theme}
          Character names: ${request.characterNames.join(", ")}
          
          The story should be engaging, educational, and age-appropriate. Include dialogue and descriptive scenes that would work well with illustrations.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const storyData = JSON.parse(storyResponse.choices[0].message.content || "{}");
    
    // Generate illustrations using DALL-E
    const illustrations: string[] = [];
    if (storyData.illustration_prompts && Array.isArray(storyData.illustration_prompts)) {
      for (const prompt of storyData.illustration_prompts.slice(0, 5)) { // Limit to 5 illustrations
        try {
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Children's book illustration: ${prompt}. Style: colorful, friendly, cartoonish, suitable for children aged ${request.ageGroup}`,
            n: 1,
            size: "1024x1024",
            quality: "standard",
          });
          
          if (imageResponse.data[0].url) {
            illustrations.push(imageResponse.data[0].url);
          }
        } catch (imageError) {
          console.error("Error generating illustration:", imageError);
          // Continue without this illustration
        }
      }
    }

    return {
      content: storyData.content || "Once upon a time...",
      illustrations,
      description: storyData.description || "A magical adventure story.",
    };

  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story. Please try again.");
  }
}

export async function generateStoryVariations(request: CustomStoryRequest): Promise<GeneratedStory[]> {
  try {
    const variations: GeneratedStory[] = [];
    
    // Generate 3 different story variations
    for (let i = 0; i < 3; i++) {
      const variation = await generateStory({
        ...request,
        theme: `${request.theme} (Variation ${i + 1})`
      });
      variations.push(variation);
    }
    
    return variations;
  } catch (error) {
    console.error("Error generating story variations:", error);
    throw new Error("Failed to generate story variations. Please try again.");
  }
}
