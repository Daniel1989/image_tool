import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Admin can see all feature requests including hidden ones
    const { data: featureRequests, error } = await supabase
      .from('feature_requests')
      .select('*')
      .order('votes', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin feature requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feature requests' },
        { status: 500 }
      );
    }

    return NextResponse.json(featureRequests);
  } catch (error) {
    console.error('Error in admin feature requests GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 