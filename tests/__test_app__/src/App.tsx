import { useEffect, useMemo } from "react";
import Reacoon, { useAsync, useFilter } from "../../../src/";

Reacoon.configure({
  hooks: {
    useAsync: {
      onError: (error: Error) => {
        const errors = document.getElementById('errors');
        if (errors) errors.innerHTML += `<li>${error.message}</li>`;
      }
    },
    useFilter: {
      fuseConfig: {
        threshold: 0.1
      }
    }
  }
})

function TestUseAsync() {
  const async1 = useAsync(undefined, () => new Promise((resolve) => {
    setTimeout(() => {
      resolve('Hello World');
    }, 2500);
  }) as Promise<string>, { init: true });

  const async2 = useAsync(undefined, () => new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Hello World'));
    }, 5000);
  }));

  useEffect(() => {
    if (async1.status === 'FULFILLED') {
      async2.caller();
    }
  }, [async1.status]);


  return <div id="test-use-async">
    <hr/>
    {(() => {
      if (async2.status === 'PENDING') return <h1>Loading 2 ...</h1>;
      if (async2.status === 'REJECTED') return <h1>Error: {async2.error?.message}</h1>;
      if (async1.status === 'PENDING') return <h1>Loading 1 ...</h1>;
      if (async1.status === 'FULFILLED') return <h1>Result: {async1.result}</h1>;
      else return <h1>Wait What?</h1>;
    })()}
    <hr/>
  </div>
}

function TestUseFilter() {
  const testItems = useMemo(() => [
    { firstName: 'John', lastName: 'Doe', age: 20 },
    { firstName: 'Jane', lastName: 'Smith', age: 21 },
    { firstName: 'Alice', lastName: 'Johnson', age: 22 },
    { firstName: 'Bob', lastName: 'Brown', age: 23 },
    { firstName: 'Charlie', lastName: 'Davis', age: 24 },
  ], [])
  const [items, { setFilter }] = useFilter(testItems, { keys: ['firstName', 'lastName'] });

  return <div>
    <input placeholder="Search" type="text" onChange={(e) => setFilter(e.target.value)} />
    <ul>
      {items.map((item, index) => <li key={index}>{item.firstName} {item.lastName}</li>)}
    </ul>
  </div>
}

export default function App() {
  return <>
    <ul id="errors" style={{ color: 'red' }}></ul>
    <TestUseAsync />
    <TestUseFilter />
  </>
}