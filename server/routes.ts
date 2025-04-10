import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getCards();
      return res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      return res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  // Get a single card
  app.get("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid card ID" });
      }

      const card = await storage.getCard(id);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      return res.json(card);
    } catch (error) {
      console.error("Error fetching card:", error);
      return res.status(500).json({ message: "Failed to fetch card" });
    }
  });

  // Create a new card
  app.post("/api/cards", async (req, res) => {
    try {
      const cardData = insertCardSchema.parse(req.body);
      const newCard = await storage.createCard(cardData);
      return res.status(201).json(newCard);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating card:", error);
      return res.status(500).json({ message: "Failed to create card" });
    }
  });

  // Delete a card
  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid card ID" });
      }

      const success = await storage.deleteCard(id);
      if (!success) {
        return res.status(404).json({ message: "Card not found" });
      }

      return res.json({ message: "Card deleted successfully" });
    } catch (error) {
      console.error("Error deleting card:", error);
      return res.status(500).json({ message: "Failed to delete card" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
