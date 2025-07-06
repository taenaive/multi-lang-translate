import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface UserWithCounts {
  id: string;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  role: string;
  subscriptionTier: string;
  subscriptionEnds: Date | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    accounts: number;
  };
}

export interface UserSummary {
  id: string;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  role: string;
  subscriptionTier: string;
  subscriptionEnds: Date | null;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
  accountsCount: number;
}

/**
 * Get all users with basic information (excluding sensitive data like passwords)
 * @returns Promise<UserSummary[]> Array of user summaries
 */
export async function getAllUsers(): Promise<UserSummary[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as UserWithCounts[]

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      subscriptionEnds: user.subscriptionEnds,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      hasPassword: !!user.password,
      accountsCount: user._count.accounts,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

/**
 * Get user count
 * @returns Promise<number> Total number of users
 */
export async function getUserCount(): Promise<number> {
  try {
    return await prisma.user.count()
  } catch (error) {
    console.error('Error counting users:', error)
    throw new Error('Failed to count users')
  }
}

/**
 * Get user by ID with detailed information
 * @param userId string User ID
 * @returns Promise<UserSummary | null> User details or null if not found
 */
export async function getUserById(userId: string): Promise<UserSummary | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    }) as UserWithCounts | null

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      subscriptionEnds: user.subscriptionEnds,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      hasPassword: !!user.password,
      accountsCount: user._count.accounts,
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    throw new Error('Failed to fetch user')
  }
}