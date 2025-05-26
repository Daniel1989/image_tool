import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params

    const featureRequest = await prisma.featureRequest.findUnique({
      where: { id }
    })

    if (!featureRequest) {
      return NextResponse.json(
        { error: 'Feature request not found' },
        { status: 404 }
      )
    }

    const updatedRequest = await prisma.featureRequest.update({
      where: { id },
      data: {
        votes: {
          increment: 1
        }
      }
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error voting on feature request:', error)
    return NextResponse.json(
      { error: 'Failed to vote on feature request' },
      { status: 500 }
    )
  }
} 