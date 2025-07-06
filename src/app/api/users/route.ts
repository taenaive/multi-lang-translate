import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"
import { getAllUsers, getUserCount } from "@/lib/users"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getAuthSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'count':
        const count = await getUserCount()
        return NextResponse.json({ count })

      case 'list':
      default:
        const users = await getAllUsers()
        return NextResponse.json({ 
          users,
          total: users.length,
          timestamp: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error("Users API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}