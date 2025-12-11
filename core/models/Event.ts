export type EventStatus = 'active' | 'completed' | 'cancelled';
export type EventCategory = 'food' | 'clothes' | 'books' | 'toys' | 'medical' | 'other';

export interface Participant {
  // backend sometimes returns userId as a string or as populated object
  userId: string | { _id: string; name?: string };
  _id: string;
  id?: string;
  joinedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  targetGoal: number;
  currentProgress: number;
  category: EventCategory;
  status: EventStatus;
  createdBy: string | { _id: string; name: string; email: string };
  participants: Participant[];
  id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  targetGoal: number;
  category: EventCategory;
}