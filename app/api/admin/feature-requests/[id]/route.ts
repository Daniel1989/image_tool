import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;
    const body = await request.json();

    // Prepare the update data, converting camelCase to snake_case where needed
    const updateData: Record<string, string | number | boolean> = {};
    
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isHidden !== undefined) updateData.is_hidden = body.isHidden;
    if (body.votes !== undefined) updateData.votes = body.votes;

    const { data: updatedRequest, error } = await supabase
      .from('feature_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating feature request:', error);
      return NextResponse.json(
        { error: 'Failed to update feature request' },
        { status: 500 }
      );
    }

    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Feature request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error in admin feature request PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;

    const { error } = await supabase
      .from('feature_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting feature request:', error);
      return NextResponse.json(
        { error: 'Failed to delete feature request' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin feature request DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 