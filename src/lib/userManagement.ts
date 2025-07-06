import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR'
export type SubscriptionTier = 'FREE' | 'PRO' | 'ULTRA' | 'ENTERPRISE'

/**
 * Update user role
 * @param userId string User ID
 * @param role UserRole New role
 * @returns Promise<boolean> Success status
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
    return true
  } catch (error) {
    console.error('Error updating user role:', error)
    return false
  }
}

/**
 * Update user subscription
 * @param userId string User ID
 * @param subscriptionTier SubscriptionTier New subscription tier
 * @param subscriptionEnds Date Optional expiration date
 * @returns Promise<boolean> Success status
 */
export async function updateUserSubscription(
  userId: string, 
  subscriptionTier: SubscriptionTier,
  subscriptionEnds?: Date
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        subscriptionTier,
        subscriptionEnds
      }
    })
    return true
  } catch (error) {
    console.error('Error updating user subscription:', error)
    return false
  }
}

/**
 * Check if user has admin privileges
 * @param userId string User ID
 * @returns Promise<boolean> Whether user is admin or moderator
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    return user?.role === 'ADMIN' || user?.role === 'MODERATOR'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check user subscription tier
 * @param userId string User ID
 * @returns Promise<SubscriptionTier | null> User's subscription tier
 */
export async function getUserSubscriptionTier(userId: string): Promise<SubscriptionTier | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true, subscriptionEnds: true }
    })
    
    if (!user) return null
    
    // Check if subscription has expired
    if (user.subscriptionEnds && user.subscriptionEnds < new Date()) {
      // Auto-downgrade expired subscription to FREE
      await updateUserSubscription(userId, 'FREE')
      return 'FREE'
    }
    
    return user.subscriptionTier as SubscriptionTier
  } catch (error) {
    console.error('Error getting subscription tier:', error)
    return null
  }
}

/**
 * Get users by role
 * @param role UserRole Role to filter by
 * @returns Promise<any[]> Users with specified role
 */
export async function getUsersByRole(role: UserRole) {
  try {
    return await prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        createdAt: true
      }
    })
  } catch (error) {
    console.error('Error getting users by role:', error)
    return []
  }
}

/**
 * Get users by subscription tier
 * @param tier SubscriptionTier Subscription tier to filter by
 * @returns Promise<any[]> Users with specified subscription
 */
export async function getUsersBySubscription(tier: SubscriptionTier) {
  try {
    return await prisma.user.findMany({
      where: { subscriptionTier: tier },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        subscriptionEnds: true,
        createdAt: true
      }
    })
  } catch (error) {
    console.error('Error getting users by subscription:', error)
    return []
  }
}