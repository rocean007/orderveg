import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vegetables } from '@/lib/db/schema';
import { eq, and, gte, lte, like, or, desc, asc } from 'drizzle-orm';
import type { APIResponse, PaginatedResponse, VegetableWithDetails } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const organic = searchParams.get('organic');
    const featured = searchParams.get('featured');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50); // Max 50 items
    
    // Build filters
    const filters = [eq(vegetables.isActive, true)];
    
    if (category) {
      filters.push(eq(vegetables.category, category));
    }
    
    if (organic === 'true') {
      filters.push(eq(vegetables.organic, true));
    }
    
    if (featured === 'true') {
      filters.push(eq(vegetables.featured, true));
    }
    
    if (minPrice) {
      filters.push(gte(vegetables.price, minPrice));
    }
    
    if (maxPrice) {
      filters.push(lte(vegetables.price, maxPrice));
    }
    
    if (search) {
      filters.push(
        or(
          like(vegetables.name, `%${search}%`),
          like(vegetables.description, `%${search}%`)
        )!
      );
    }
    
    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'price_asc':
        orderBy = asc(vegetables.price);
        break;
      case 'price_desc':
        orderBy = desc(vegetables.price);
        break;
      case 'name':
        orderBy = asc(vegetables.name);
        break;
      default:
        orderBy = desc(vegetables.createdAt);
    }
    
    // Get total count
    const allVegetables = await db.query.vegetables.findMany({
      where: and(...filters),
    });
    const total = allVegetables.length;
    
    // Get paginated results
    const offset = (page - 1) * limit;
    const items = await db.query.vegetables.findMany({
      where: and(...filters),
      orderBy,
      limit,
      offset,
    });
    
    // Calculate final prices with discounts
    const itemsWithFinalPrice: VegetableWithDetails[] = items.map((item) => ({
      ...item,
      finalPrice: item.discount
        ? (parseFloat(item.price) * (1 - item.discount / 100)).toFixed(2)
        : item.price,
    }));
    
    const response: PaginatedResponse<VegetableWithDetails> = {
      items: itemsWithFinalPrice,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
    
    return NextResponse.json<APIResponse<PaginatedResponse<VegetableWithDetails>>>(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vegetables fetch error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to fetch vegetables' },
      { status: 500 }
    );
  }
}
