# ElizaDID

ElizaDID is an open-source platform built on Solana, integrating Decentralized Identity (DID) and AI Agents to deliver privacy-preserving decentralized services. Extending the foundation of [ElizaOS](https://github.com/elizaOS/eliza), it combines Solana's high-performance blockchain with advanced privacy features like Zero-Knowledge Proofs (ZKP).

Website: [https://elizadid.com/](https://elizadid.com/)  
Twitter: [https://x.com/elizadid_](https://x.com/elizadid_)  
Repository: [https://github.com/ElizaDID/did](https://github.com/ElizaDID/did)

## Features
- **Decentralized Identity (DID)**: Generate and manage DIDs with privacy-first authentication.
- **Solana Integration**: Fast and scalable blockchain interactions.
- **AI Agent**: Automate tasks (e.g., DeFi, NFT management) based on user permissions.
- **Privacy Protection**: Off-chain encrypted storage and ZKP for sensitive operations.
- **Extensibility**: Custom task definitions for flexible use cases.

## Roadmap
- **Phase 1 (Mar-Apr 2025)**: Build a technical prototype with DID and Solana integration.
- **Phase 2 (May-Jul 2025)**: Add privacy features (ZKP) and DeFi automation.
- **Phase 3 (Aug-Sep 2025)**: Optimize performance and deploy to Solana Testnet.
- **Phase 4 (Oct-Dec 2025)**: Launch on Mainnet and integrate with Solana ecosystem.

See [docs/roadmap.md](./docs/roadmap.md) for details.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Solana CLI (optional, for local testing)
- Git

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ElizaDID/did.git
   cd did
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Solana RPC URL and other settings.

4. Build the project:
   ```bash
   npm run build
   ```

## Usage
### Run the CLI
```bash
npm run cli
```
Follow the prompts to generate a DID or execute a task.

### Run Tests
```bash
npm test
```

### Try an Example
```bash
npm run example:simple-tx
```
See [examples/README.md](./examples/README.md) for more details.

## Development
- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Building**: `npm run build`
- **Testing**: `npm test`

## Project Structure
- `/agent/` - AI Agent logic for task execution and permissions.
- `/did/` - DID generation and verification.
- `/solana/` - Solana blockchain interactions.
- `/privacy/` - Privacy features (ZKP, off-chain storage).
- `/ui/` - User interfaces (CLI and optional web).
- `/types/` - Shared TypeScript types.
- `/utils/` - Utility functions.
- `/tests/` - Unit and integration tests.
- `/examples/` - Example scripts.
- `/docs/` - Project documentation.


## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

See [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) for guidelines.

## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Contact
For questions or feedback, open an issue on [GitHub](https://github.com/ElizaDID/did) or reach out via [Twitter](https://x.com/elizadid_).
