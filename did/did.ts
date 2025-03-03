// did.ts - Advanced DID management with Solana integration
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { generateKeyPair, signMessage, verifySignature } from './crypto';
import { logger } from '../utils';

// DID Document interface (based on W3C DID spec)
interface DIDDocument {
  '@context': string;
  id: string; // e.g., "did:eliza:abc123"
  publicKey: string[];
  authentication: string[];
  created: string;
}

// DID management class
export class DIDManager {
  private connection: Connection;
  private keypair: { publicKey: string; privateKey: string };

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.keypair = generateKeyPair();
  }

  // Generate a new DID and store its document on Solana
  async createDID(): Promise<DIDDocument> {
    const did = `did:eliza:${Buffer.from(this.keypair.publicKey).toString('hex').slice(0, 8)}`;
    const didDocument: DIDDocument = {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      publicKey: [this.keypair.publicKey],
      authentication: [`${did}#keys-1`],
      created: new Date().toISOString(),
    };

    // Store DID document on Solana (simplified, using a program-derived address)
    const pda = await this.storeDIDDocument(didDocument);
    logger.info(`DID created and stored at PDA: ${pda.toBase58()}`);
    return didDocument;
  }

  // Verify a DID signature against a message
  async verifyDIDSignature(did: string, message: string, signature: Buffer | string): Promise<boolean> {
    try {
      // Resolve DID document from Solana (placeholder for real resolution)
      const didDocument = await this.resolveDID(did);
      const publicKey = didDocument.publicKey[0];
      return verifySignature(publicKey, message, signature);
    } catch (error) {
      logger.error(`DID verification failed for ${did}:`, error);
      return false;
    }
  }

  // Store DID document on Solana (simplified)
  private async storeDIDDocument(doc: DIDDocument): Promise<PublicKey> {
    const programId = new PublicKey('11111111111111111111111111111111'); // Placeholder
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from(doc.id)],
      programId
    );

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(this.keypair.publicKey),
        toPubkey: pda,
        lamports: 0.001 * 1e9, // Minimal rent
      })
    );

    // Sign and send (requires a signer keypair in real implementation)
    // const signature = await this.connection.sendTransaction(transaction, [signer]);
    logger.debug(`DID document stored at: ${pda.toBase58()}`);
    return pda;
  }

  // Placeholder: Resolve DID document from Solana
  private async resolveDID(did: string): Promise<DIDDocument> {
    // Implement resolution logic (e.g., fetch from PDA or IPFS)
    return {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      publicKey: ['mock-public-key'],
      authentication: [`${did}#keys-1`],
      created: '2025-03-02T00:00:00Z',
    };
  }
}

// Utility function for signature verification
export async function verifyDIDSignature(did: string, message: string, signature: Buffer | string): Promise<boolean> {
  const manager = new DIDManager(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
  return manager.verifyDIDSignature(did, message, signature);
}