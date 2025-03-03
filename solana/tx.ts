// tx.ts - Transaction utilities for Solana
import { Transaction, SystemProgram, PublicKey, Keypair, TransactionInstruction } from '@solana/web3.js';
import { logger } from '../utils';

// Transfer SOL instruction
export function createTransferInstruction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number
): TransactionInstruction {
  return SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports,
  });
}

// Build and sign a transaction
export async function buildTransaction(
  payer: Keypair,
  instructions: TransactionInstruction[],
  connection: Connection
): Promise<Transaction> {
  try {
    const transaction = new Transaction();
    const recentBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = payer.publicKey;

    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.sign(payer);

    logger.debug(`Transaction built with ${instructions.length} instructions`);
    return transaction;
  } catch (error) {
    logger.error('Failed to build transaction:', error);
    throw error;
  }
}