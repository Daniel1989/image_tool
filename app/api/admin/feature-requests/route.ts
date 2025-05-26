import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const featureRequests = await prisma.featureRequest.findMany({
      orderBy: [
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json(featureRequests)
  } catch (error) {
    console.error('Error fetching feature requests for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature requests' },
      { status: 500 }
    )
  }
} 