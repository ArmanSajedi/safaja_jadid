const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  location?: string;
  images: string[];
  imageDetails?: { url: string; title: string; order: number }[];
  amenities?: string[];
  access?: string[];
  rules?: string;
  rating: number;
  reviewsCount: number;
  discount: number;
  isNew: boolean;
  isActive: boolean;
  status?: string;
  hostId?: number;
  stock: number;
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  slug?: string;
  publishedAt?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: number;
  authorId: number;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private async fetchData<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Products API
  async getProducts(params?: { category?: string; search?: string }): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return this.fetchData<Product[]>(`/products${query ? `?${query}` : ''}`);
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    return this.fetchData<Product>(`/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    return this.fetchData<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.fetchData<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return this.fetchData<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.fetchData<Category[]>('/categories');
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return this.fetchData<Category>(`/categories/${slug}`);
  }

  async getProductsByCategory(slug: string): Promise<ApiResponse<Product[]>> {
    return this.fetchData<Product[]>(`/categories/${slug}/products`);
  }

  // Blog API
  async getBlogPosts(limit?: number): Promise<ApiResponse<BlogPost[]>> {
    const query = limit ? `?limit=${limit}` : '';
    return this.fetchData<BlogPost[]>(`/blog${query}`);
  }

  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return this.fetchData<BlogPost>(`/blog/${slug}`);
  }
}

export const apiClient = new ApiClient();
