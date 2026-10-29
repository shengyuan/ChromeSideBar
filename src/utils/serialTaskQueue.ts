/**
 * Runs async tasks one at a time, in the order they were queued.
 * A failing task does not stop the tasks queued after it.
 */
export class SerialTaskQueue
{
  #tail: Promise<void> = Promise.resolve();

  enqueue(task: () => Promise<void>): void
  {
    this.#tail = this.#tail.then(task).catch((error) =>
    {
      if (import.meta.env.DEV)
      {
        console.error('[SerialTaskQueue] task failed:', error);
      }
    });
  }
}
