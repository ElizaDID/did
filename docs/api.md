# ElizaDID API Documentation

This document outlines the initial API for ElizaDID. It will expand as the project develops.

## Agent Module
- **`Agent` Class**
  - `constructor(config: AgentConfig)`: Initializes the Agent with a DID and Solana RPC URL.
  - `initialize(): Promise<void>`: Verifies the DID and sets up the Agent.
  - `queueTask(task: Task): Promise<void>`: Adds a task to the execution queue.

## DID Module
- **`DIDManager` Class**
  - `createDID(): Promise<DIDDocument>`: Generates and stores a new DID.
  - `verifyDIDSignature(did: string, message: string, signature: Buffer | string): Promise<boolean>`: Verifies a signature.