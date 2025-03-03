// index.ts - Shared TypeScript types
import { Keypair } from '@solana/web3.js';

export interface AgentConfig {
  did: string;
  solanaRpcUrl: string;
  keypair: Keypair;
}

export interface DIDDocument {
  '@context': string;
  id: string;
  publicKey: string[];
  authentication: string[];
  created: string;
}

export interface Task {
  type: string;
  payload: Record<string, any>;
  signature: Buffer | Uint8Array | string;
  priority?: number;
}