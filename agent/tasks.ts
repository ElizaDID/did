// tasks.ts - Task definitions, queue, and execution logic
import { logger } from '../utils';

// Task interface with stricter typing
export interface Task {
  type: 'transfer' | 'swap' | 'vote' | string; // Extensible task types
  payload: Record<string, any>; // Task-specific data
  signature: Buffer | Uint8Array | string; // DID signature for authorization
  priority?: number; // Optional priority for queue ordering
}

// Task queue implementation
export class TaskQueue {
  private tasks: Task[] = [];

  // Enqueue a task with optional priority
  enqueue(task: Task): void {
    const priority = task.priority ?? 0;
    this.tasks.push({ ...task, priority });
    this.tasks.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)); // Higher priority first
    logger.debug(`Task enqueued: ${task.type}, Queue size: ${this.tasks.length}`);
  }

  // Dequeue the next task
  dequeue(): Task | undefined {
    const task = this.tasks.shift();
    if (task) {
      logger.debug(`Task dequeued: ${task.type}, Queue size: ${this.tasks.length}`);
    }
    return task;
  }

  // Check if queue is empty
  isEmpty(): boolean {
    return this.tasks.length === 0;
  }
}

// Task factory with validation
export function createTask(type: string, payload: Record<string, any>, signature: Buffer | string): Task {
  if (!type || typeof payload !== 'object' || !signature) {
    throw new Error('Invalid task parameters');
  }
  return { type, payload, signature };
}