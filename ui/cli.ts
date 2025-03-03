// cli.ts - Command-line interface for ElizaDID
import { Command } from 'commander';
import { Agent } from '../agent';
import { DIDManager } from '../did';
import { SolanaClient } from '../solana';
import { logger } from '../utils';

const program = new Command();

program
  .version('0.1.0')
  .description('ElizaDID CLI');

program
  .command('init')
  .description('Initialize an Agent with a DID')
  .action(async () => {
    try {
      const didManager = new DIDManager(process.env.SOLANA_RPC_URL!);
      const didDoc = await didManager.createDID();
      const agent = new Agent({
        did: didDoc.id,
        solanaRpcUrl: process.env.SOLANA_RPC_URL!,
        keypair: Keypair.generate(), // Placeholder keypair
      });
      await agent.initialize();
      logger.info('Agent initialized successfully');
    } catch (error) {
      logger.error('CLI init failed:', error);
    }
  });

program
  .command('balance <publicKey>')
  .description('Check Solana account balance')
  .action(async (publicKey) => {
    try {
      const client = new SolanaClient({ rpcUrl: process.env.SOLANA_RPC_URL! });
      const balance = await client.getBalance(new PublicKey(publicKey));
      console.log(`Balance: ${balance / 1e9} SOL`);
    } catch (error) {
      logger.error('CLI balance check failed:', error);
    }
  });

program.parse(process.argv);