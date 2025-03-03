// app.ts - Basic web interface (to be bundled)
import { SolanaClient } from '../../solana';

document.addEventListener('DOMContentLoaded', async () => {
  const appDiv = document.getElementById('app')!;
  const client = new SolanaClient({ rpcUrl: 'https://api.devnet.solana.com' });

  try {
    const balance = await client.getBalance(new PublicKey('11111111111111111111111111111111'));
    appDiv.innerHTML = `<p>Balance: ${balance / 1e9} SOL</p>`;
  } catch (error) {
    appDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});