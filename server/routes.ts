import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { 
  insertStoryTemplateSchema, 
  insertStorySchema, 
  insertOrderSchema,
  customStoryRequestSchema 
} from "@shared/schema";
import { generateStory, generateStoryVariations } from "./services/gemini";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Story template routes
  app.get('/api/story-templates', async (req, res) => {
    try {
      const templates = await storage.getStoryTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching story templates:", error);
      res.status(500).json({ message: "Failed to fetch story templates" });
    }
  });

  app.get('/api/story-templates/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getStoryTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Story template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching story template:", error);
      res.status(500).json({ message: "Failed to fetch story template" });
    }
  });

  // Story routes
  app.get('/api/stories/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stories = await storage.getStoriesByUser(userId);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching user stories:", error);
      res.status(500).json({ message: "Failed to fetch user stories" });
    }
  });

  app.get('/api/stories/published', async (req, res) => {
    try {
      const { search, genre, ageGroup } = req.query;
      const stories = await storage.searchStories(
        search as string,
        genre as string,
        ageGroup as string
      );
      res.json(stories);
    } catch (error) {
      console.error("Error fetching published stories:", error);
      res.status(500).json({ message: "Failed to fetch published stories" });
    }
  });

  app.get('/api/stories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.getStory(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  app.post('/api/stories/from-template', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { templateId, characterNames } = req.body;
      
      const template = await storage.getStoryTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Story template not found" });
      }

      // Customize the story content with character names
      let customizedContent = template.content;
      if (characterNames && template.placeholderNames) {
        const placeholders = template.placeholderNames as string[];
        placeholders.forEach((placeholder, index) => {
          if (characterNames[index]) {
            customizedContent = customizedContent.replace(
              new RegExp(placeholder, 'g'),
              characterNames[index]
            );
          }
        });
      }

      const storyData = {
        title: template.title,
        content: customizedContent,
        storyType: 'template' as const,
        userId,
        characterNames,
        pageCount: template.pageCount,
        genre: template.genre,
        ageGroup: template.ageGroup,
        illustrations: template.previewImages,
        description: template.description,
      };

      const story = await storage.createStory(storyData);
      res.json(story);
    } catch (error) {
      console.error("Error creating story from template:", error);
      res.status(500).json({ message: "Failed to create story from template" });
    }
  });

  app.post('/api/stories/custom', isAuthenticated, upload.array('characterPhotos', 5), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Handle form data properly
      let requestData;
      if (req.body.data) {
        try {
          requestData = JSON.parse(req.body.data);
        } catch (parseError) {
          console.error("Error parsing form data:", parseError);
          return res.status(400).json({ message: "Invalid form data format" });
        }
      } else {
        // If no 'data' field, use the body directly
        requestData = req.body;
      }
      
      console.log("Received custom story request:", requestData);
      
      // Validate request data
      const validatedData = customStoryRequestSchema.parse(requestData);
      
      // Convert uploaded files to base64
      const characterPhotos: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const base64 = file.buffer.toString('base64');
          characterPhotos.push(base64);
        }
      }

      console.log("Generating story with Gemini...");
      
      // Generate story using Gemini
      const generatedStory = await generateStory({
        ...validatedData,
        characterPhotos,
      });

      console.log("Story generated successfully:", generatedStory.description);

      const storyData = {
        title: validatedData.title,
        content: generatedStory.content,
        storyType: 'custom' as const,
        userId,
        characterNames: validatedData.characterNames,
        pageCount: validatedData.pageCount,
        genre: validatedData.genre,
        ageGroup: validatedData.ageGroup,
        illustrations: generatedStory.illustrations,
        description: generatedStory.description,
        rating: '0',
        isPublished: false,
      };

      const story = await storage.createStory(storyData);
      console.log("Story saved to database with ID:", story.id);
      
      res.json(story);
    } catch (error) {
      console.error("Error creating custom story:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create custom story", error: error instanceof Error ? error.message : "Unknown error" });
      }
    }
  });

  app.put('/api/stories/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      
      // Check if story belongs to user
      const existingStory = await storage.getStory(id);
      if (!existingStory || existingStory.userId !== userId) {
        return res.status(404).json({ message: "Story not found" });
      }

      const updateData = req.body;
      const updatedStory = await storage.updateStory(id, updateData);
      res.json(updatedStory);
    } catch (error) {
      console.error("Error updating story:", error);
      res.status(500).json({ message: "Failed to update story" });
    }
  });

  app.delete('/api/stories/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      
      // Check if story belongs to user
      const existingStory = await storage.getStory(id);
      if (!existingStory || existingStory.userId !== userId) {
        return res.status(404).json({ message: "Story not found" });
      }

      await storage.deleteStory(id);
      res.json({ message: "Story deleted successfully" });
    } catch (error) {
      console.error("Error deleting story:", error);
      res.status(500).json({ message: "Failed to delete story" });
    }
  });

  // Order routes
  app.get('/api/orders/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = { ...req.body, userId };
      
      const validatedData = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedData);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Admin middleware
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      next();
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to verify admin status" });
    }
  };

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const stories = await storage.getAllStories();
      const templates = await storage.getStoryTemplates();
      
      res.json({
        userCount: users.length,
        storyCount: stories.length,
        templateCount: templates.length
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/admin/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/stories', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
