const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkConnection() {
  try {
    // Get connection info
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_schema() as schema_name,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port,
        version() as postgres_version
    `;
    
    console.log('📡 Database Connection Details:');
    console.log(`   Database: ${dbInfo[0].database_name}`);
    console.log(`   Schema: ${dbInfo[0].schema_name}`);
    console.log(`   Server IP: ${dbInfo[0].server_ip || 'localhost'}`);
    console.log(`   Server Port: ${dbInfo[0].server_port || 'default'}`);
    console.log(`   PostgreSQL Version: ${dbInfo[0].postgres_version.split(' ')[0]}`);
    
    console.log('\n🔍 Exact SQL to find users:');
    console.log('SELECT * FROM "User";');
    console.log('SELECT * FROM "Account";');
    console.log('SELECT * FROM "Session";');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();