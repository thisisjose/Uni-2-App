export type EventStatus = 'active' | 'completed' | 'cancelled';
export type EventCategory = 'food' | 'clothes' | 'books' | 'toys' | 'medical' | 'other';

export interface Participant {
  userId: {
    _id: string;
    name: string;
  };
  _id: string;
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