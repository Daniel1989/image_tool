import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params
    const body = await request.json()
    const { status, priority, isHidden } = body

    const featureRequest = await prisma.featureRequest.findUnique({
      where: { id }
    })

    if (!featureRequest) {
      return NextResponse.json(
        { error: 'Feature request not found' },
        { status: 404 }
      )
    }

    const updateData: { status?: string; priority?: string; isHidden?: boolean } = {}
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (isHidden !== undefined) updateData.isHidden = isHidden

    const updatedRequest = await prisma.featureRequest.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating feature request:', error)
    return NextResponse.json(
      { error: 'Failed to update feature request' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
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

    await prisma.featureRequest.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Feature request deleted successfully' })
  } catch (error) {
    console.error('Error deleting feature request:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature request' },
      { status: 500 }
    )
  }
} 