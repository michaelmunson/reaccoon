import { useEffect, useState } from "react";
import { getConfig } from "../config";



export type UseAsyncRequestStatus = 'IDLE' | 'PENDING' | 'FULFILLED' | 'REJECTED';


type Caller<T, Args extends any[] = any[]> = (...args:Args) => Promise<T | Error>;
type Config = Partial<{
  /**@description call async function immediately */
  init: boolean;
  /**@description disallow calling function while status is pending */
  rejectWhilePending: boolean;
}>
export type UseAsyncResult<T, I, Args extends any[] = any[]> = (
  {status: "IDLE", result:I, caller:Caller<T, Args>, setResult:React.Dispatch<React.SetStateAction<I | T>>, error:undefined} |
  {status: "PENDING", result:I, caller:Caller<T,Args>, setResult:React.Dispatch<React.SetStateAction<I | T>>, error:undefined} |
  {status: "FULFILLED", result: T, caller:Caller<T,Args>, setResult:React.Dispatch<React.SetStateAction<I | T>>, error:undefined} |
  {status: "REJECTED", result:I, caller:Caller<T, Args>, setResult:React.Dispatch<React.SetStateAction<I | T>>, error:Error }
)

/**
 * @description Hook to handle asynchronous operations with status tracking and error handling
 * @template T The type of the successful result
 * @template I The type of the initial value (defaults to T)
 * @template Args The types of arguments the async function accepts
 * @param initial The initial value before the async operation completes
 * @param asyncFn The async function to execute
 * @param config
 * * `config.init` If true, calls the async function immediately on mount
 * * `config.rejectWhilePending` If true, prevents calling the function while status is pending
 * @returns {UseAsyncResult<T,I,Args>} Object containing:
 * - `status`: Current state of the async operation ('IDLE'|'PENDING'|'FULFILLED'|'REJECTED')
 * - `result`: The current value (initial value or successful result)
 * - `error`: Error object if status is 'REJECTED', undefined otherwise
 * - `caller`: Function to manually trigger the async operation
 * - `setResult`: Function to manually update the result value

 * @example
 * ```tsx
 * const async1 = useAsync(undefined, () => new Promise((resolve) => {
 *   setTimeout(() => {
 *     resolve('Hello World');
 *   }, 2500);
 * }) as Promise<string>, { init: true });
 * 
 * const async2 = useAsync(undefined, () => new Promise((_, reject) => {
 *   setTimeout(() => {
 *     reject(new Error('Hello World'));
 *   }, 5000);
 * }));
 * 
 * useEffect(() => {
 *   if (async1.status === 'FULFILLED') {
 *     async2.caller();
 *   }
 * }, [async1.status]);
 * 
 * 
 * if (async2.status === 'PENDING') return <h1>Loading 2 ...</h1>;
 * if (async2.status === 'REJECTED') return <h1>Error: {async2.error?.message}</h1>;
 * if (async1.status === 'PENDING') return <h1>Loading 1 ...</h1>;
 * if (async1.status === 'FULFILLED') return <h1>Result: {async1.result}</h1>;
 * else return <h1>Won't Get Here</h1>;
 * ```
 */
export function useAsync<T, I=T, Args extends any[] = any[]>(initial:I, asyncFn:(...args:Args) => Promise<T>, config:Config={}) : UseAsyncResult<T,I,Args> {
  const [status, setStatus] = useState<UseAsyncRequestStatus>('IDLE');
  const [result, setResult] = useState<T | I>(initial);
  const [error, setError] = useState<Error>();

  const caller = async (...args:Args) => {
    if (status === 'PENDING' && config.rejectWhilePending)
      return new Error('Cannot invoke function while status is PENDING')
    setStatus('PENDING');
    try {
      const res = await asyncFn(...args);
      setResult(res);
      setStatus('FULFILLED');
      return res;
    }
    catch (e) {
      let error:Error;
      if (typeof e === 'string') error = new Error(e);
      else if (e instanceof Error) error = e;
      else error = new Error('UseAsync Caller Promise Rejected')
      setStatus('REJECTED')
      setError(error);
      if (getConfig().hooks.useAsync.onError) getConfig().hooks.useAsync.onError(error);
      return error;
    }
  }

  useEffect(() => {
    if (config.init){
      caller(...[] as any)
    }
  }, [])

  return <UseAsyncResult<T, I, Args>>{
    status,
    result,
    error,
    caller,
    setResult
  }
}
