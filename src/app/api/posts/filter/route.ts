import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../../lib/auth0';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

export async function GET(request: NextRequest) {
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
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const postType = searchParams.get('postType');

    // Construiește URL-ul pentru backend cu parametrii de filtrare
    let backendUrl = `${API_BASE_URL}/posts`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (platform) params.append('platform', platform);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (postType) params.append('postType', postType);
    
    if (params.toString()) {
      backendUrl += `?${params.toString()}`;
    }

    // Face request către backend-ul Spring Boot
    const response = await fetch(backendUrl, {
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
    console.error('Error in posts filter API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 