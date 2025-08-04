import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../lib/auth0';

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

    console.log('Access Token:', session.tokenSet.accessToken);
    console.log('Expires At:', session.tokenSet.expiresAt);

    // Face request către backend-ul Spring Boot
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.tokenSet.accessToken}`,
      },
    });

    console.log('Backend Response Status:', response.status);
    console.log('Backend Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Backend Error Data:', errorData);
      return NextResponse.json(
        { error: errorData.message || `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in posts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verifică autentificarea
    const session = await auth0.getSession();

    if (!session?.tokenSet.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Face request către backend-ul Spring Boot
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.tokenSet.accessToken}`,
      },
      body: JSON.stringify(body),
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
    console.error('Error in posts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 