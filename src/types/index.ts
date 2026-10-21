export interface ProductMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedBuyer?: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: string; // dynamic categories now
  price: number; // in INR
  originalPrice?: number; // for showing discount
  stock: number; // fixed stock count
  isOutOfStock?: boolean;
  shortDescription: string;
  description: string;
  specifications: ProductSpecification[];
  media: ProductMedia[];
  reviews: Review[];
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StudentDetails {
  fullName: string;
  phoneNumber: string;
  branch: string; // e.g. ECE, CSE, EE, MECH, CIVIL, IT, AIDS
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  section: string; // e.g. A, B, C, D
  rollNumber?: string; // University Roll Number
  collegeEmail?: string; // optional
  deliveryLocationNote?: string; // e.g., "ECE Department ground floor near Lab 2"
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. "ECE-ORD-1048"
  student: StudentDetails;
  studentRollNumber?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  adminNotes?: string;
}

// Dynamic category that owner can add/remove
export type ProductCategory = string;

export interface Category {
  id: string;
  name: string;
  icon?: string; // lucide icon name
  createdAt: string;
}

// Student User Profile
export interface StudentUser {
  id: string;
  rollNumber: string; // e.g. "24192031045"
  fullName: string;
  branch: string; // e.g. "Electronics and Communication Engineering (ECE)"
  branchCode: string; // e.g. "031"
  admissionYear: number; // e.g. 2024
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  section: string; // e.g. "A"
  phoneNumber: string;
  collegeEmail?: string;
  passwordHash: string; // SHA-256 hashed
  securityQuestion: string; // e.g. "What was the name of your first school?"
  securityAnswerHash: string; // SHA-256 hashed
  cart?: CartItem[];
  wrongContactFlag?: boolean; // Owner flags this if student has wrong/unreachable contact
  createdAt: string;
}

// Branch Traffic Analysis
export interface BranchTrafficStat {
  branchCode: string;
  branchName: string;
  studentCount: number;
  orderCount: number;
  percentage: number;
}

// Help query from students
export interface HelpQuery {
  id: string;
  studentName: string;
  studentPhone: string;
  studentRollNumber?: string;
  studentEmail?: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  adminReply?: string;
}

// Bug report from students
export interface BugReport {
  id: string;
  reporterName: string;
  reporterEmail?: string;
  description: string;
  page?: string;
  createdAt: string;
  status: 'OPEN' | 'FIXED';
}

// Admin credentials (stored securely)
export interface AdminCredentials {
  username: string;
  passwordHash: string; // SHA-256 hashed
  lastChanged: string;
}
