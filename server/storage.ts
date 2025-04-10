import { users, type User, type InsertUser, cards, type Card, type InsertCard } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Card operations
  createCard(card: InsertCard): Promise<Card>;
  getCards(): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  deleteCard(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cards: Map<number, Card>;
  private userCurrentId: number;
  private cardCurrentId: number;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.userCurrentId = 1;
    this.cardCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Card operations
  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = this.cardCurrentId++;
    const card: Card = { ...insertCard, id };
    this.cards.set(id, card);
    return card;
  }

  async getCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async deleteCard(id: number): Promise<boolean> {
    return this.cards.delete(id);
  }
}

export const storage = new MemStorage();
