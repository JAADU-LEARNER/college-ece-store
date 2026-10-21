import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  Order,
  OrderItem,
  StudentDetails,
  OrderStatus,
  Review,
  Category,
  HelpQuery,
  BugReport,
  AdminCredentials,
  StudentUser,
  BranchTrafficStat,
  CartItem
} from '@/types';
import { INITIAL_PRODUCTS } from '@/data/initialProducts';

interface StoreData {
  products: Product[];
  orders: Order[];
  categories: Category[];
  helpQueries: HelpQuery[];
  bugReports: BugReport[];
  adminCredentials: AdminCredentials;
  students: StudentUser[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Hash password using SHA-256
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-microcontrollers', name: 'Microcontrollers', icon: 'Cpu', createdAt: new Date().toISOString() },
  { id: 'cat-sensors', name: 'Sensors & Modules', icon: 'Activity', createdAt: new Date().toISOString() },
  { id: 'cat-displays', name: 'Displays', icon: 'Monitor', createdAt: new Date().toISOString() },
  { id: 'cat-motors', name: 'Motors & Actuators', icon: 'Gauge', createdAt: new Date().toISOString() },
  { id: 'cat-pcbs', name: 'PCBs & Prototyping', icon: 'Layers', createdAt: new Date().toISOString() },
  { id: 'cat-tools', name: 'Tools & Accessories', icon: 'Wrench', createdAt: new Date().toISOString() },
];

const DEFAULT_ADMIN: AdminCredentials = {
  username: 'owner',
  passwordHash: hashPassword('admin123'),
  lastChanged: new Date().toISOString(),
};

// Ensure directories exist
function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// Initialize storage
function initializeStorage(): StoreData {
  ensureDirs();

  if (!fs.existsSync(DATA_FILE)) {
    const initialData: StoreData = {
      products: INITIAL_PRODUCTS,
      orders: [],
      categories: DEFAULT_CATEGORIES,
      helpQueries: [],
      bugReports: [],
      adminCredentials: DEFAULT_ADMIN,
      students: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      products: parsed.products || INITIAL_PRODUCTS,
      orders: parsed.orders || [],
      categories: parsed.categories || DEFAULT_CATEGORIES,
      helpQueries: parsed.helpQueries || [],
      bugReports: parsed.bugReports || [],
      adminCredentials: parsed.adminCredentials || DEFAULT_ADMIN,
      students: parsed.students || [],
    };
  } catch (e) {
    console.error('Error reading storage, recreating defaults:', e);
    const initialData: StoreData = {
      products: INITIAL_PRODUCTS,
      orders: [],
      categories: DEFAULT_CATEGORIES,
      helpQueries: [],
      bugReports: [],
      adminCredentials: DEFAULT_ADMIN,
      students: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveStorage(data: StoreData) {
  ensureDirs();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ======================== ADMIN AUTH ========================

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  const data = initializeStorage();
  const creds = data.adminCredentials;
  return creds.username === username && creds.passwordHash === hashPassword(password);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  // Token format: base64(username:passwordHash)
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, passwordHash] = decoded.split(':');
    const data = initializeStorage();
    return data.adminCredentials.username === username && data.adminCredentials.passwordHash === passwordHash;
  } catch {
    return false;
  }
}

export function generateAdminToken(username: string, passwordHash: string): string {
  return Buffer.from(`${username}:${passwordHash}`).toString('base64');
}

export async function changeAdminCredentials(
  currentUsername: string,
  currentPassword: string,
  newUsername?: string,
  newPassword?: string
): Promise<{ success: boolean; error?: string }> {
  const data = initializeStorage();
  const creds = data.adminCredentials;

  // Verify current credentials first
  if (creds.username !== currentUsername || creds.passwordHash !== hashPassword(currentPassword)) {
    return { success: false, error: 'Current username or password is incorrect.' };
  }

  if (newUsername && newUsername.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters long.' };
  }

  if (newPassword && newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  if (newUsername) data.adminCredentials.username = newUsername.trim();
  if (newPassword) data.adminCredentials.passwordHash = hashPassword(newPassword);
  data.adminCredentials.lastChanged = new Date().toISOString();

  saveStorage(data);
  return { success: true };
}

export async function getAdminCredentials(): Promise<AdminCredentials> {
  const data = initializeStorage();
  return data.adminCredentials;
}

// ======================== PRODUCT OPERATIONS ========================

export async function getAllProducts(): Promise<Product[]> {
  const data = initializeStorage();
  return data.products.map(p => ({
    ...p,
    isOutOfStock: p.stock <= 0,
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.id === id) || null;
}

export async function createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const data = initializeStorage();
  const id = productData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);

  const newProduct: Product = {
    ...productData,
    id,
    stock: Number(productData.stock) || 0,
    isOutOfStock: Number(productData.stock) <= 0,
    price: Number(productData.price) || 0,
    createdAt: new Date().toISOString(),
    reviews: productData.reviews || [],
    media: productData.media || [],
    specifications: productData.specifications || [],
  };

  data.products.unshift(newProduct);
  saveStorage(data);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const data = initializeStorage();
  const index = data.products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const current = data.products[index];
  const updatedStock = updates.stock !== undefined ? Number(updates.stock) : current.stock;

  const updatedProduct: Product = {
    ...current,
    ...updates,
    id: current.id,
    stock: updatedStock,
    isOutOfStock: updatedStock <= 0,
    price: updates.price !== undefined ? Number(updates.price) : current.price,
  };

  data.products[index] = updatedProduct;
  saveStorage(data);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = initializeStorage();
  const prevCount = data.products.length;
  data.products = data.products.filter(p => p.id !== id);
  if (data.products.length !== prevCount) {
    saveStorage(data);
    return true;
  }
  return false;
}

export async function addProductReview(productId: string, review: Omit<Review, 'id' | 'date'>): Promise<Product | null> {
  const data = initializeStorage();
  const index = data.products.findIndex(p => p.id === productId);
  if (index === -1) return null;

  const newReview: Review = {
    ...review,
    id: 'rev-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
  };

  data.products[index].reviews = [newReview, ...(data.products[index].reviews || [])];
  saveStorage(data);
  return data.products[index];
}

export async function deleteProductReview(productId: string, reviewId: string): Promise<Product | null> {
  const data = initializeStorage();
  const index = data.products.findIndex(p => p.id === productId);
  if (index === -1) return null;

  data.products[index].reviews = (data.products[index].reviews || []).filter(r => r.id !== reviewId);
  saveStorage(data);
  return data.products[index];
}

// ======================== CATEGORY OPERATIONS ========================

export async function getAllCategories(): Promise<Category[]> {
  const data = initializeStorage();
  return data.categories;
}

export async function addCategory(name: string, icon?: string): Promise<Category> {
  const data = initializeStorage();
  const id = 'cat-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(100 + Math.random() * 900);
  const newCat: Category = {
    id,
    name: name.trim(),
    icon: icon || 'Package',
    createdAt: new Date().toISOString(),
  };
  data.categories.push(newCat);
  saveStorage(data);
  return newCat;
}

export async function removeCategory(categoryId: string): Promise<boolean> {
  const data = initializeStorage();
  const prev = data.categories.length;
  data.categories = data.categories.filter(c => c.id !== categoryId);
  if (data.categories.length !== prev) {
    saveStorage(data);
    return true;
  }
  return false;
}

// ======================== ORDER & STOCK OPERATIONS ========================

export interface PlaceOrderInput {
  student: StudentDetails;
  items: { productId: string; quantity: number }[];
}

export async function placeOrder(input: PlaceOrderInput): Promise<{ success: boolean; order?: Order; error?: string }> {
  const data = initializeStorage();

  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const item of input.items) {
    const prod = data.products.find(p => p.id === item.productId);
    if (!prod) {
      return { success: false, error: `Product with ID "${item.productId}" not found.` };
    }
    if (prod.stock < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for "${prod.title}". Only ${prod.stock} unit(s) remaining in campus inventory.`,
      };
    }

    const itemTotal = prod.price * item.quantity;
    totalAmount += itemTotal;
    orderItems.push({
      productId: prod.id,
      productTitle: prod.title,
      unitPrice: prod.price,
      quantity: item.quantity,
      totalPrice: itemTotal,
    });
  }

  // Decrement stock
  for (const item of input.items) {
    const prod = data.products.find(p => p.id === item.productId)!;
    prod.stock -= item.quantity;
    if (prod.stock <= 0) {
      prod.stock = 0;
      prod.isOutOfStock = true;
    }
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderCode = `ECE-${input.student.branch.toUpperCase()}-${randomSuffix}`;

  const newOrder: Order = {
    id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    orderCode,
    student: input.student,
    studentRollNumber: input.student.rollNumber,
    items: orderItems,
    totalAmount,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  data.orders.unshift(newOrder);
  saveStorage(data);

  return { success: true, order: newOrder };
}

export async function getOrdersForStudent(rollNumber: string, phoneNumber?: string): Promise<Order[]> {
  const data = initializeStorage();
  const cleanRoll = rollNumber.trim().toUpperCase();
  const cleanPhone = phoneNumber ? phoneNumber.trim().slice(-10) : '';

  return data.orders.filter(o => {
    if (o.studentRollNumber && o.studentRollNumber.toUpperCase() === cleanRoll) return true;
    if (o.student.rollNumber && o.student.rollNumber.toUpperCase() === cleanRoll) return true;
    if (cleanPhone && o.student.phoneNumber && o.student.phoneNumber.slice(-10) === cleanPhone) return true;
    return false;
  });
}

export async function getAllOrders(): Promise<Order[]> {
  const data = initializeStorage();
  return data.orders;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, adminNotes?: string): Promise<Order | null> {
  const data = initializeStorage();
  const orderIndex = data.orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return null;

  const currentOrder = data.orders[orderIndex];
  const oldStatus = currentOrder.status;

  // If cancelled, restore reserved stock
  if (status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
    for (const item of currentOrder.items) {
      const prod = data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock += item.quantity;
        prod.isOutOfStock = prod.stock <= 0;
      }
    }
  }

  currentOrder.status = status;
  if (adminNotes !== undefined) {
    currentOrder.adminNotes = adminNotes;
  }

  saveStorage(data);
  return currentOrder;
}

// ======================== HELP QUERIES ========================

export async function submitHelpQuery(query: Omit<HelpQuery, 'id' | 'status' | 'createdAt'>): Promise<HelpQuery> {
  const data = initializeStorage();
  const newQuery: HelpQuery = {
    ...query,
    id: 'help-' + Date.now(),
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };
  data.helpQueries.unshift(newQuery);
  saveStorage(data);
  return newQuery;
}

export async function getAllHelpQueries(): Promise<HelpQuery[]> {
  const data = initializeStorage();
  return data.helpQueries;
}

export async function updateHelpQueryStatus(queryId: string, status: 'OPEN' | 'RESOLVED', adminReply?: string): Promise<HelpQuery | null> {
  const data = initializeStorage();
  const idx = data.helpQueries.findIndex(q => q.id === queryId);
  if (idx === -1) return null;
  data.helpQueries[idx].status = status;
  if (adminReply !== undefined) data.helpQueries[idx].adminReply = adminReply;
  saveStorage(data);
  return data.helpQueries[idx];
}

// ======================== BUG REPORTS ========================

export async function submitBugReport(report: Omit<BugReport, 'id' | 'status' | 'createdAt'>): Promise<BugReport> {
  const data = initializeStorage();
  const newReport: BugReport = {
    ...report,
    id: 'bug-' + Date.now(),
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };
  data.bugReports.unshift(newReport);
  saveStorage(data);
  return newReport;
}

export async function getAllBugReports(): Promise<BugReport[]> {
  const data = initializeStorage();
  return data.bugReports;
}

export async function updateBugReportStatus(reportId: string, status: 'OPEN' | 'FIXED'): Promise<BugReport | null> {
  const data = initializeStorage();
  const idx = data.bugReports.findIndex(b => b.id === reportId);
  if (idx === -1) return null;
  data.bugReports[idx].status = status;
  saveStorage(data);
  return data.bugReports[idx];
}

// ======================== STUDENT USER AUTH & MANAGEMENT ========================

export function generateStudentToken(studentId: string, rollNumber: string): string {
  return Buffer.from(`student:${studentId}:${rollNumber}:${Date.now()}`).toString('base64');
}

export async function verifyStudentToken(token: string): Promise<StudentUser | null> {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [prefix, studentId, rollNumber] = decoded.split(':');
    if (prefix !== 'student' || !studentId || !rollNumber) return null;

    const data = initializeStorage();
    return data.students.find(s => s.id === studentId && s.rollNumber.toUpperCase() === rollNumber.toUpperCase()) || null;
  } catch {
    return null;
  }
}

export async function registerStudent(
  input: Omit<StudentUser, 'id' | 'createdAt'>
): Promise<{ success: boolean; student?: StudentUser; token?: string; error?: string }> {
  const data = initializeStorage();
  const cleanRoll = input.rollNumber.trim().toUpperCase();

  const existing = data.students.find(s => s.rollNumber.toUpperCase() === cleanRoll);
  if (existing) {
    return {
      success: false,
      error: `Roll Number "${cleanRoll}" is already registered. Please enter your password to Log In.`
    };
  }

  const newStudent: StudentUser = {
    ...input,
    id: 'stu-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    rollNumber: cleanRoll,
    createdAt: new Date().toISOString()
  };

  data.students.push(newStudent);
  saveStorage(data);

  const token = generateStudentToken(newStudent.id, newStudent.rollNumber);
  return { success: true, student: newStudent, token };
}

export async function authenticateStudent(
  rollNumber: string,
  password: string
): Promise<{ success: boolean; student?: StudentUser; token?: string; error?: string }> {
  const data = initializeStorage();
  const cleanRoll = rollNumber.trim().toUpperCase();
  const student = data.students.find(s => s.rollNumber.toUpperCase() === cleanRoll);

  if (!student) {
    return {
      success: false,
      error: `No student account found for Roll Number "${cleanRoll}". Please click "Create Account" below.`
    };
  }

  if (student.passwordHash !== hashPassword(password)) {
    return {
      success: false,
      error: 'Incorrect password. Please verify your password or use "Forgot Password".'
    };
  }

  const token = generateStudentToken(student.id, student.rollNumber);
  return { success: true, student, token };
}

export async function getStudentByRollNumber(rollNumber: string): Promise<StudentUser | null> {
  const data = initializeStorage();
  const cleanRoll = rollNumber.trim().toUpperCase();
  return data.students.find(s => s.rollNumber.toUpperCase() === cleanRoll) || null;
}

export async function getStudentById(id: string): Promise<StudentUser | null> {
  const data = initializeStorage();
  return data.students.find(s => s.id === id) || null;
}

export async function resetStudentPassword(
  rollNumber: string,
  securityAnswer: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const data = initializeStorage();
  const cleanRoll = rollNumber.trim().toUpperCase();
  const student = data.students.find(s => s.rollNumber.toUpperCase() === cleanRoll);

  if (!student) {
    return { success: false, error: `Student with Roll Number "${cleanRoll}" not found.` };
  }

  const cleanAnswer = securityAnswer.trim().toLowerCase();
  if (student.securityAnswerHash !== hashPassword(cleanAnswer)) {
    return { success: false, error: 'Incorrect answer to security question. Please check and try again.' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  student.passwordHash = hashPassword(newPassword);
  saveStorage(data);
  return { success: true };
}

export async function updateStudentCart(studentId: string, cart: CartItem[]): Promise<StudentUser | null> {
  const data = initializeStorage();
  const student = data.students.find(s => s.id === studentId);
  if (!student) return null;

  student.cart = cart;
  saveStorage(data);
  return student;
}

export async function getAllStudents(): Promise<StudentUser[]> {
  const data = initializeStorage();
  return data.students;
}

export async function deleteStudent(studentId: string): Promise<boolean> {
  const data = initializeStorage();
  const prevCount = data.students.length;
  data.students = data.students.filter(s => s.id !== studentId);
  if (data.students.length !== prevCount) {
    saveStorage(data);
    return true;
  }
  return false;
}

export async function getBranchAnalytics(): Promise<{ totalStudents: number; totalOrders: number; branchStats: BranchTrafficStat[] }> {
  const data = initializeStorage();
  const totalStudents = data.students.length;
  const totalOrders = data.orders.length;

  const branchMap: Record<string, { count: number; orders: number; name: string }> = {};

  for (const s of data.students) {
    const key = s.branchCode || s.branch || 'OTHER';
    if (!branchMap[key]) {
      branchMap[key] = { count: 0, orders: 0, name: s.branch || key };
    }
    branchMap[key].count++;
  }

  for (const o of data.orders) {
    const branchKey = o.student.branch || 'OTHER';
    let matchedKey = Object.keys(branchMap).find(k => branchMap[k].name.includes(branchKey) || k === branchKey);
    if (!matchedKey) matchedKey = branchKey;
    if (!branchMap[matchedKey]) {
      branchMap[matchedKey] = { count: 0, orders: 0, name: branchKey };
    }
    branchMap[matchedKey].orders++;
  }

  const branchStats: BranchTrafficStat[] = Object.keys(branchMap).map(k => ({
    branchCode: k,
    branchName: branchMap[k].name,
    studentCount: branchMap[k].count,
    orderCount: branchMap[k].orders,
    percentage: totalStudents > 0 ? Math.round((branchMap[k].count / totalStudents) * 100) : 0
  })).sort((a, b) => b.studentCount - a.studentCount);

  return { totalStudents, totalOrders, branchStats };
}

export async function flagStudentWrongContact(studentId: string, flag: boolean): Promise<{ success: boolean; cancelledOrders: number }> {
  const data = initializeStorage();
  const student = data.students.find(s => s.id === studentId);
  if (!student) return { success: false, cancelledOrders: 0 };

  student.wrongContactFlag = flag;

  // If flagging as wrong contact, auto-cancel all their pending orders
  let cancelledOrders = 0;
  if (flag) {
    for (const order of data.orders) {
      if (
        order.studentRollNumber?.toUpperCase() === student.rollNumber.toUpperCase() &&
        (order.status === 'PENDING' || order.status === 'CONFIRMED')
      ) {
        order.status = 'CANCELLED';
        order.adminNotes = (order.adminNotes ? order.adminNotes + ' | ' : '') + 'Auto-cancelled: Student flagged for wrong/unreachable contact details.';
        cancelledOrders++;

        // Restore stock for cancelled items
        for (const item of order.items) {
          const prod = data.products.find(p => p.id === item.productId);
          if (prod) {
            prod.stock += item.quantity;
            prod.isOutOfStock = prod.stock <= 0;
          }
        }
      }
    }
  }

  saveStorage(data);
  return { success: true, cancelledOrders };
}
