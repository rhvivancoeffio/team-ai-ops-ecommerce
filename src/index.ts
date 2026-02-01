import { Platform } from './core/Platform';
import { ApiServer } from './api/ApiServer';

// Export main classes
export { Platform } from './core/Platform';
export { TeamOrchestrator } from './core/TeamOrchestrator';
export { MessageBus } from './core/MessageBus';
export { BaseAgent } from './core/BaseAgent';
export { CustomerSupportAgent } from './agents/CustomerSupportAgent';
export { OrderManagementAgent } from './agents/OrderManagementAgent';
export { LogisticsAgent } from './agents/LogisticsAgent';
export { ApiServer } from './api/ApiServer';

// Export types
export * from './types';

/**
 * Main entry point
 */
async function main() {
  console.log('🚀 Starting AI Teams Platform for E-commerce Operations...\n');

  // Create platform instance
  const platform = new Platform();

  // Create an e-commerce operations team
  console.log('📦 Creating E-commerce Operations Team...');
  const team = await platform.createEcommerceTeam('ecommerce-ops');
  await team.start();

  console.log('✅ Team created and started!');
  console.log(`   - Team ID: ${team.getConfig().id}`);
  console.log(`   - Team Name: ${team.getConfig().name}`);
  console.log(`   - Agents: ${team.getAgents().length}\n`);

  team.getAgents().forEach((agent) => {
    console.log(`   ✓ ${agent.getName()} (${agent.getType()})`);
  });

  // Start API server
  console.log('\n🌐 Starting API Server...');
  const apiServer = new ApiServer(platform, 3000);
  await apiServer.start();

  console.log('\n✨ Platform is ready!');
  console.log('   API Server: http://localhost:3000');
  console.log('   Health Check: http://localhost:3000/health\n');
  console.log('📚 Available API Endpoints:');
  console.log('   POST /api/teams/ecommerce - Create ecommerce team');
  console.log('   GET  /api/teams - List all teams');
  console.log('   GET  /api/teams/:teamId - Get team details');
  console.log('   POST /api/teams/:teamId/tasks - Submit a task');
  console.log('   GET  /api/teams/:teamId/tasks/:taskId - Get task status');
  console.log('   GET  /api/teams/:teamId/tasks - List all tasks\n');
}

// Run if this is the main module
if (require.main === module) {
  main().catch(console.error);
}

export default main;
