import { useEffect, useState } from "react";
import Fuse, {type IFuseOptions} from "fuse.js";
import { getConfig } from "../config";

/**
 * @description Hook to filter items using Fuse.js
 * @example
 * const testItems = useMemo(() => [
    { firstName: 'John', lastName: 'Doe', age: 20 },
    { firstName: 'Jane', lastName: 'Smith', age: 21 },
    { firstName: 'Alice', lastName: 'Johnson', age: 22 },
    { firstName: 'Bob', lastName: 'Brown', age: 23 },
    { firstName: 'Charlie', lastName: 'Davis', age: 24 },
  ], [])

  const [items, { setFilter }] = useFilter(testItems, { keys: ['firstName', 'lastName'] });
 */
export function useFilter<T extends Record<string, any>>(
  items: T[],
  config: IFuseOptions<T> &{ keys: (keyof T)[] }
) {
  const fuseConfig = getConfig().hooks.useFilter.fuseConfig;
  const fuse = new Fuse<T>(items, { ...fuseConfig, ...config,  });
  const [filter, setFilter] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  useEffect(() => {
    if (!filter) setFilteredItems(items);
    else setFilteredItems(fuse.search(filter).map(r => r.item));
  }, [filter, items]);

  return <const>[
    filteredItems,
    {filter, setFilter}
  ]
}