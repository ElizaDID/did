// agent.ts - Advanced AI Agent implementation with Solana and DID integration
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Task, TaskQueue } from './tasks';
import { verifyDIDSignature } from '../did';
import { logger } from '../utils';

// Configuration interface for the Agent
interface AgentConfig {
  did: string; // User's Decentralized Identity
  solanaRpcUrl: string; // Solana RPC endpoint (e.g., https://api.devnet.solana.com)
  keypair: Keypair; // Agent's Solana keypair for Signing transactions
}

// Agent state interface
interface AgentState {
  initialized: boolean;
  connection: Connection;
  taskQueue: TaskQueue;
}

// Main Agent class
export class Agent {
  private config: AgentConfig;
  private state: AgentState;

  constructor(config: AgentConfig) {
    this.config = config;
    this.state = {
      initialized: false,
      connection: new Connection(config.solanaRpcUrl, 'confirmed'),
      taskQueue: new TaskQueue(),
    };
  }

  // Initialize the Agent with DID verification and Solana connection check
  async initialize(): Promise<void> {
    try {
      // Verify DID validity
      const isValid = await verifyDIDSignature(this.config.did, 'init', this.config.keypair.secretKey);
      if (!isValid) {
        throw new Error('DID signature verification failed during initialization');
      }

      // Test Solana connection
      const version = await this.state.connection.getVersion();
      logger.info(`Connected to Solana node version: ${version['solana-core']}`);

      this.state.initialized = true;
      logger.info(`Agent initialized for DID: ${this.config.did}`);
    } catch (error) {
      logger.error('Agent initialization failed:', error);
      throw error;
    }
  }

  // Add a task to the queue with DID-based permission check
  async queueTask(task: Task): Promise<void> {
    if (!this.state.initialized) {
      throw new Error('Agent not initialized');
    }

    try {
      // Verify task signature with DID
      const message = `${task.type}:${JSON.stringify(task.payload)}`;
      const isAuthorized = await verifyDIDSignature(this.config.did, message, task.signature);
      if (!isAuthorized) {
        throw new Error(`Unauthorized task: ${task.type}`);
      }

      this.state.taskQueue.enqueue(task);
      logger.info(`Task queued: ${task.type}`);
      this.processNextTask(); // Start processing if not already running
    } catch (error) {
      logger.error('Failed to queue task:', error);
      throw error;
    }
  }

  // Process the next task in the queue
  private async processNextTask(): Promise<void> {
    const task = this.state.taskQueue.dequeue();
    if (!task) return;

    try {
      logger.info(`Processing task: ${task.type}`);
      switch (task.type) {
        case 'transfer':
          await this.executeTransfer(task.payload);
          break;
        case 'swap':
          await this.executeSwap(task.payload);
          break;
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }
      logger.info(`Task completed: ${task.type}`);
      this.processNextTask(); // Continue processing
    } catch (error) {
      logger.error(`Task execution failed for ${task.type}:`, error);
      throw error;
    }
  }

  // Example: Execute a Solana transfer
  private async executeTransfer(payload: { to: string; amount: number }): Promise<void> {
    const toPubkey = new PublicKey(payload.to);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.config.keypair.publicKey,
        toPubkey,
        lamports: payload.amount * 1e9, // Convert SOL to lamports
      })
    );

    const signature = await this.state.connection.sendTransaction(transaction, [this.config.keypair]);
    await this.state.connection.confirmTransaction(signature);
    logger.info(`Transfer completed: ${signature}`);
  }

  // Placeholder: Execute a token swap (requires Serum or other DEX integration)
  private async executeSwap(payload: { tokenIn: string; tokenOut: string; amount: number }): Promise<void> {
    // Implement swap logic with Solana DEX (e.g., Serum, Raydium)
    logger.info(`Swap executed: ${payload.amount} ${payload.tokenIn} -> ${payload.tokenOut}`);
  }
}