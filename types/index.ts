// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Vegetable types
export interface VegetableWithDetails {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  unit: string;
  stock: number;
  imageUrl: string | null;
  category: string | null;
  organic: boolean | null;
  featured: boolean | null;
  discount: number | null;
  nutritionInfo: string | null;
  isActive: boolean;
  finalPrice?: string; // After discount
}

// Cart types
export interface CartItemWithDetails {
  id: number;
  vegetableId: number;
  vegetableName: string;
  vegetableSlug: string;
  price: string;
  unit: string;
  quantity: string;
  imageUrl: string | null;
  organic: boolean | null;
  discount: number | null;
  subtotal: string;
}

export interface Cart {
  items: CartItemWithDetails[];
  subtotal: string;
  itemCount: number;
}

// Order types
export interface OrderWithDetails {
  id: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  subtotal: string;
  deliveryFee: string;
  tax: string;
  total: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string | null;
  customerNotes: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  items: OrderItemDetails[];
}

export interface OrderItemDetails {
  id: number;
  vegetableName: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  subtotal: string;
}

// User types
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: 'customer' | 'admin';
  address: string | null;
  city: string | null;
  postalCode: string | null;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// Filter and sorting
export interface VegetableFilters {
  category?: string;
  organic?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
