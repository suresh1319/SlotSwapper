export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
  userId: string | User;
  createdAt: string;
}

export interface SwapRequest {
  _id: string;
  requesterUserId: User;
  targetUserId: User;
  requesterSlotId: Event;
  targetSlotId: Event;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  respondedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}