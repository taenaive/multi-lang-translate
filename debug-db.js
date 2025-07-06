const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Check connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        role: true,
        subscriptionTier: true,
        subscriptionEnds: true,
        createdAt: true,
        password: true,
        _count: {
          select: {
            accounts: true,
            sessions: true,
          }
        }
      }
    });
    
    console.log('\n📋 Users found:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Subscription: ${user.subscriptionTier}${user.subscriptionEnds ? ` (expires: ${user.subscriptionEnds})` : ''}`);
      console.log(`   Has Password: ${!!user.password}`);
      console.log(`   Email Verified: ${!!user.emailVerified}`);
      console.log(`   Accounts: ${user._count.accounts}`);
      console.log(`   Sessions: ${user._count.sessions}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('   ---');
    });
    
    // Check accounts
    const accountCount = await prisma.account.count();
    console.log(`🔗 Total OAuth accounts: ${accountCount}`);
    
    // Check sessions
    const sessionCount = await prisma.session.count();
    console.log(`🔐 Total sessions: ${sessionCount}`);
    
    // Show table names to verify we're looking at the right place
    const tableNames = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('\n📊 Database tables:');
    tableNames.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    // Show current schema name
    const currentSchema = await prisma.$queryRaw`SELECT current_schema()`;
    console.log(`\n🗂️  Current schema: ${currentSchema[0].current_schema}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();