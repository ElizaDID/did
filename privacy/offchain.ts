// offchain.ts - Off-chain encrypted storage (e.g., IPFS)
import { create } from 'ipfs-http-client';
import { encrypt, decrypt } from '../did/crypto';
import { logger } from '../utils';

// IPFS client configuration
interface OffchainConfig {
  ipfsUrl: string; // e.g., 'http://localhost:5001'
  encryptionKey: string;
}

export class OffchainStorage {
  private ipfs: any;
  private config: OffchainConfig;

  constructor(config: OffchainConfig) {
    this.ipfs = create({ url: config.ipfsUrl });
    this.config = config;
  }

  // Store encrypted data on IPFS
  async storeData(data: any): Promise<string> {
    try {
      const encryptedData = encrypt(this.config.encryptionKey, JSON.stringify(data));
      const { cid } = await this.ipfs.add(Buffer.from(encryptedData));
      logger.info(`Data stored on IPFS: ${cid.toString()}`);
      return cid.toString();
    } catch (error) {
      logger.error('Failed to store data on IPFS:', error);
      throw error;
    }
  }

  // Retrieve and decrypt data from IPFS
  async retrieveData(cid: string): Promise<any> {
    try {
      const stream = this.ipfs.cat(cid);
      let data = '';
      for await (const chunk of stream) {
        data += chunk.toString();
      }
      const decryptedData = decrypt(this.config.encryptionKey, data);
      logger.debug(`Data retrieved from IPFS: ${cid}`);
      return JSON.parse(decryptedData);
    } catch (error) {
      logger.error(`Failed to retrieve data from IPFS: ${cid}`, error);
      throw error;
    }
  }
}