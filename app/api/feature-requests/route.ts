import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: featureRequests, error } = await supabase
      .from('feature_requests')
      .select('*')
      .eq('is_hidden', false)
      .order('votes', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching feature requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feature requests' },
        { status: 500 }
      )
    }

    return NextResponse.json(featureRequests)
  } catch (error) {
    console.error('Error in feature requests GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, userName, userEmail, priority } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const { data: featureRequest, error } = await supabase
      .from('feature_requests')
      .insert([
        {
          title,
          description,
          user_name: userName || null,
          user_email: userEmail || null,
          priority: priority || 'MEDIUM',
          status: 'PENDING',
          votes: 0,
          is_hidden: false,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating feature request:', error)
      return NextResponse.json(
        { error: 'Failed to create feature request' },
        { status: 500 }
      )
    }

    return NextResponse.json(featureRequest, { status: 201 })
  } catch (error) {
    console.error('Error in feature requests POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 