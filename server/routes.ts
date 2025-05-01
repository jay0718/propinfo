import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropFirmSchema, insertResourceSchema, insertReviewSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to handle validation errors
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ message: validationError.message });
        }
        return res.status(400).json({ message: "Invalid request body" });
      }
    };
  };

  // =================== PropFirm Routes =================== //
  
  // Get all prop firms
  app.get("/api/firms", async (req, res) => {
    try {
      const firms = await storage.getAllPropFirms();
      res.json(firms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching prop firms" });
    }
  });

  // Get featured prop firms
  app.get("/api/firms/featured", async (req, res) => {
    try {
      const firms = await storage.getFeaturedPropFirms();
      res.json(firms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured prop firms" });
    }
  });

  // Get a single prop firm by ID
  app.get("/api/firms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid firm ID" });
      }

      const firm = await storage.getPropFirm(id);
      if (!firm) {
        return res.status(404).json({ message: "Prop firm not found" });
      }

      res.json(firm);
    } catch (error) {
      res.status(500).json({ message: "Error fetching prop firm" });
    }
  });

  // Create a new prop firm (admin only)
  app.post("/api/firms", validateRequest(insertPropFirmSchema), async (req, res) => {
    try {
      const newFirm = await storage.createPropFirm(req.body);
      res.status(201).json(newFirm);
    } catch (error) {
      res.status(500).json({ message: "Error creating prop firm" });
    }
  });

  // Update a prop firm (admin only)
  app.put("/api/firms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid firm ID" });
      }

      const updatedFirm = await storage.updatePropFirm(id, req.body);
      if (!updatedFirm) {
        return res.status(404).json({ message: "Prop firm not found" });
      }

      res.json(updatedFirm);
    } catch (error) {
      res.status(500).json({ message: "Error updating prop firm" });
    }
  });

  // Delete a prop firm (admin only)
  app.delete("/api/firms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid firm ID" });
      }

      const success = await storage.deletePropFirm(id);
      if (!success) {
        return res.status(404).json({ message: "Prop firm not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting prop firm" });
    }
  });

  // =================== Review Routes =================== //
  
  // Get all reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  // Get reviews for a specific firm
  app.get("/api/firms/:id/reviews", async (req, res) => {
    try {
      const firmId = parseInt(req.params.id);
      if (isNaN(firmId)) {
        return res.status(400).json({ message: "Invalid firm ID" });
      }

      const reviews = await storage.getReviewsByFirmId(firmId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  // Add a review for a firm
  app.post("/api/reviews", validateRequest(insertReviewSchema), async (req, res) => {
    try {
      const newReview = await storage.createReview(req.body);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: "Error creating review" });
    }
  });

  // =================== Resource Routes =================== //
  
  // Get all resources
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Error fetching resources" });
    }
  });

  // Get resources by category
  app.get("/api/resources/category/:category", async (req, res) => {
    try {
      const resources = await storage.getResourcesByCategory(req.params.category);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Error fetching resources" });
    }
  });

  // Get a single resource by ID
  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }

      const resource = await storage.getResource(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Error fetching resource" });
    }
  });

  // Create a new resource (admin only)
  app.post("/api/resources", validateRequest(insertResourceSchema), async (req, res) => {
    try {
      const newResource = await storage.createResource(req.body);
      res.status(201).json(newResource);
    } catch (error) {
      res.status(500).json({ message: "Error creating resource" });
    }
  });

  // Update a resource (admin only)
  app.put("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }

      const updatedResource = await storage.updateResource(id, req.body);
      if (!updatedResource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json(updatedResource);
    } catch (error) {
      res.status(500).json({ message: "Error updating resource" });
    }
  });

  // Delete a resource (admin only)
  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }

      const success = await storage.deleteResource(id);
      if (!success) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting resource" });
    }
  });

  // =================== Auth Routes =================== //
  
  // User registration
  app.post("/api/auth/register", validateRequest(insertUserSchema), async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser({ username, password });
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error registering user" });
    }
  });

  // Admin login
  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const isValidAdmin = await storage.verifyAdminCredentials(username, password);
      if (!isValidAdmin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
