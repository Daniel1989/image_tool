import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const featureRequests = await prisma.featureRequest.findMany({
      where: {
        isHidden: false
      },
      orderBy: [
        { votes: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json(featureRequests)
  } catch (error) {
    console.error('Error fetching feature requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, userName, userEmail, priority = 'LOW' } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const featureRequest = await prisma.featureRequest.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        userName: userName?.trim() || null,
        userEmail: userEmail?.trim() || null,
        priority
      }
    })

    return NextResponse.json(featureRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating feature request:', error)
    return NextResponse.json(
      { error: 'Failed to create feature request' },
      { status: 500 }
    )
  }
} 