interface QueuedJob<T> {
  task: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: Error) => void;
  enqueuedAt: number;
  timer: NodeJS.Timeout;
}

export class QueueOverflowError extends Error {
  constructor() {
    super('Execution queue is full — try again in a moment');
    this.name = 'QueueOverflowError';
  }
}

export class QueueTimeoutError extends Error {
  constructor(waitMs: number) {
    super(`Waited ${waitMs}ms for a free execution slot`);
    this.name = 'QueueTimeoutError';
  }
}

/**
 * A bounded, concurrency-limited FIFO queue.
 *
 * Containers are expensive; without a cap a burst of submissions would spawn
 * one per request and take the host down. Requests beyond the depth limit are
 * rejected fast rather than queued forever, and anything that waits too long
 * for a slot gives up so the HTTP request never hangs.
 *
 * This is an in-process queue, which is the right size for a single-user prep
 * app. The interface matches what a Redis/BullMQ worker pool would expose, so
 * swapping in a distributed queue later is a drop-in change.
 */
export class JobQueue {
  private readonly pending: Array<QueuedJob<unknown>> = [];
  private active = 0;

  constructor(
    private readonly concurrency: number,
    private readonly maxDepth: number,
    private readonly waitTimeoutMs: number,
  ) {}

  get stats(): { active: number; queued: number; concurrency: number } {
    return { active: this.active, queued: this.pending.length, concurrency: this.concurrency };
  }

  add<T>(task: () => Promise<T>): Promise<T> {
    if (this.pending.length >= this.maxDepth) {
      return Promise.reject(new QueueOverflowError());
    }

    return new Promise<T>((resolve, reject) => {
      const job: QueuedJob<T> = {
        task,
        resolve,
        reject,
        enqueuedAt: Date.now(),
        timer: setTimeout(() => {
          const index = this.pending.indexOf(job as QueuedJob<unknown>);
          if (index !== -1) {
            this.pending.splice(index, 1);
            reject(new QueueTimeoutError(this.waitTimeoutMs));
          }
        }, this.waitTimeoutMs),
      };

      this.pending.push(job as QueuedJob<unknown>);
      this.drain();
    });
  }

  private drain(): void {
    while (this.active < this.concurrency && this.pending.length > 0) {
      const job = this.pending.shift();
      if (!job) return;
      clearTimeout(job.timer);
      this.active += 1;

      job
        .task()
        .then(job.resolve)
        .catch((err: unknown) => job.reject(err instanceof Error ? err : new Error(String(err))))
        .finally(() => {
          this.active -= 1;
          this.drain();
        });
    }
  }
}
