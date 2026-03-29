import { Timestamp } from 'firebase/firestore';

export interface Service {
  id?: string;
  title: string;
  description: string;
  category: string;
  isHighlighted?: boolean;
}

export interface Article {
  id?: string;
  title: string;
  description: string;
  date: Timestamp;
  category: 'MCA' | 'GST' | 'Income Tax';
  subCategory?: string;
  imageUrl?: string;
  pdfUrl?: string;
}

export interface LatestUpdate {
  id?: string;
  title: string;
  timestamp: Timestamp;
}

export interface Enquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: Timestamp;
  status: 'new' | 'read' | 'resolved';
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
