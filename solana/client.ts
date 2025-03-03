// client.ts - Solana blockchain client for ElizaDID
import { Connection, PublicKey, Keypair, Commitment } from '@solana/web3.js';
import { logger } from '../utils';

// Solana client configuration
interface SolanaConfig {
  rpcUrl: string;
  commitment?: Commitment; // e.g., 'confirmed', 'finalized'
}

// Solana client class
export class SolanaClient {
  private connection: Connection;
  private config: SolanaConfig;

  constructor(config: SolanaConfig) {
    this.config = {
      ...config,
      commitment: config.commitment || 'confirmed',
    };
    this.connection = new Connection(this.config.rpcUrl, this.config.commitment);
  }

  // Get account balance in lamports
  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      logger.info(`Balance for ${publicKey.toBase58()}: ${balance} lamports`);
      return balance;
    } catch (error) {
      logger.error(`Failed to fetch balance for ${publicKey.toBase58()}:`, error);
      throw error;
    }
  }

  // Fetch account info
  async getAccountInfo(publicKey: PublicKey): Promise<any> {
    try {
      const info = await this.connection.getAccountInfo(publicKey);
      if (!info) {
        throw new Error(`Account ${publicKey.toBase58()} not found`);
      }
      logger.debug(`Account info fetched for ${publicKey.toBase58()}`);
      return info;
    } catch (error) {
      logger.error(`Failed to fetch account info for ${publicKey.toBase58()}:`, error);
      throw error;
    }
  }

  // Send a signed transaction
  async sendTransaction(transaction: Transaction, signers: Keypair[]): Promise<string> {
    try {
      const signature = await this.connection.sendTransaction(transaction, signers, {
        skipPreflight: false,
        preflightCommitment: this.config.commitment,
      });
      await this.connection.confirmTransaction(signature, this.config.commitment);
      logger.info(`Transaction sent and confirmed: ${signature}`);
      return signature;
    } catch (error) {
      logger.error('Transaction failed:', error);
      throw error;
    }
  }
}