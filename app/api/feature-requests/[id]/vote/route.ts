import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;

    // First, get the current vote count
    const { data: featureRequest, error: fetchError } = await supabase
      .from('feature_requests')
      .select('votes')
      .eq('id', id)
      .single();

    if (fetchError || !featureRequest) {
      return NextResponse.json(
        { error: 'Feature request not found' },
        { status: 404 }
      );
    }

    // Increment the vote count
    const { data: updatedRequest, error: updateError } = await supabase
      .from('feature_requests')
      .update({ votes: featureRequest.votes + 1 })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating vote count:', updateError);
      return NextResponse.json(
        { error: 'Failed to update vote count' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error in vote POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 