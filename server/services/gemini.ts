import { GoogleGenAI } from "@google/genai";
import type { CustomStoryRequest } from "@shared/schema";

// the newest Gemini model is "gemini-2.5-flash" - do not change this unless explicitly requested by the user
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

console.log("Gemini API Key available:", !!process.env.GEMINI_API_KEY);

interface GeneratedStory {
  content: string;
  illustrations: string[];
  description: string;
}

export async function generateStory(request: CustomStoryRequest): Promise<GeneratedStory> {
  try {
    console.log("Starting story generation with request:", {
      title: request.title,
      genre: request.genre,
      ageGroup: request.ageGroup,
      characterNames: request.characterNames
    });
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Create a personalized children's story with the following specifications:
    
    Title: ${request.title}
    Genre: ${request.genre}
    Age Group: ${request.ageGroup}
    Page Count: ${request.pageCount}
    Character Names: ${request.characterNames.join(", ")}
    Theme: ${request.theme}
    
    Requirements:
    - Write an engaging, age-appropriate story
    - Use the provided character names throughout
    - Make it exactly ${request.pageCount} pages long
    - Include the theme naturally in the story
    - Create a brief description for the story
    - Suggest 3 illustration prompts that would work well with the story
    
    Return the response in JSON format with this structure:
    {
      "content": "The complete story text with clear page breaks marked as [PAGE BREAK]",
      "description": "A brief, engaging description of the story",
      "illustrations": ["Illustration prompt 1", "Illustration prompt 2", "Illustration prompt 3"]
    }`;

    console.log("Sending request to Gemini API...");
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            content: { type: "string" },
            description: { type: "string" },
            illustrations: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["content", "description", "illustrations"]
        }
      }
    });
    
    console.log("Received response from Gemini API");

    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const storyData = JSON.parse(text);
    
    console.log("Story generation completed successfully");
    
    return {
      content: storyData.content,
      description: storyData.description,
      illustrations: storyData.illustrations
    };
  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    throw new Error(`Failed to generate story: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateStoryVariations(request: CustomStoryRequest): Promise<GeneratedStory[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Create 3 different variations of a children's story with these specifications:
    
    Title: ${request.title}
    Genre: ${request.genre}
    Age Group: ${request.ageGroup}
    Page Count: ${request.pageCount}
    Character Names: ${request.characterNames.join(", ")}
    Theme: ${request.theme}
    
    Requirements for each variation:
    - Write engaging, age-appropriate stories with different plots
    - Use the provided character names throughout
    - Make each exactly ${request.pageCount} pages long
    - Include the theme naturally but with different approaches
    - Create unique descriptions and illustration prompts for each
    
    Return the response in JSON format with this structure:
    {
      "variations": [
        {
          "content": "Story 1 text with [PAGE BREAK] markers",
          "description": "Description for story 1",
          "illustrations": ["Prompt 1", "Prompt 2", "Prompt 3"]
        },
        {
          "content": "Story 2 text with [PAGE BREAK] markers", 
          "description": "Description for story 2",
          "illustrations": ["Prompt 1", "Prompt 2", "Prompt 3"]
        },
        {
          "content": "Story 3 text with [PAGE BREAK] markers",
          "description": "Description for story 3", 
          "illustrations": ["Prompt 1", "Prompt 2", "Prompt 3"]
        }
      ]
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            variations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  description: { type: "string" },
                  illustrations: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["content", "description", "illustrations"]
              }
            }
          },
          required: ["variations"]
        }
      }
    });

    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(text);
    
    return data.variations.map((variation: any) => ({
      content: variation.content,
      description: variation.description,
      illustrations: variation.illustrations
    }));
  } catch (error) {
    console.error("Error generating story variations with Gemini:", error);
    throw new Error(`Failed to generate story variations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}