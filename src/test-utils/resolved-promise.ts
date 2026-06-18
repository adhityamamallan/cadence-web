type FulfilledThenable<T> = Promise<T> & {
  status: 'fulfilled';
  value: T;
};

/**
 * Returns a promise that React's `use()` hook can read synchronously (without
 * suspending) by tagging it with the fulfilled-thenable shape React looks for.
 * Useful for unit-testing client components that receive Next.js 15 async
 * `params` / `searchParams` props.
 */
export default function resolvedPromise<T>(value: T): Promise<T> {
  const promise = Promise.resolve(value) as FulfilledThenable<T>;
  promise.status = 'fulfilled';
  promise.value = value;
  return promise;
}
