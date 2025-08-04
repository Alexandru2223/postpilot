import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../../../lib/auth0';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    // Await params for Next.js 15+
    const { platform } = await params;
  try {
    // Verifică autentificarea
    const session = await auth0.getSession();

    if (!session?.tokenSet.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const language = searchParams.get('language');

    // Construiește URL-ul cu parametrii
    let url = `${API_BASE_URL}/posts/suggestions/${platform}`;
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (language) queryParams.append('language', language);
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Face request către backend-ul Spring Boot
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.tokenSet.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in suggestions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 