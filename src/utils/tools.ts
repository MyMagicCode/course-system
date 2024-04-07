/**
 * 对数组进行分组处理
 * @returns [Array,Object]
 * ```
 * @example
 const results = groupByArray(
  [
    { name: "zhang", age: 18 },
    { name: "zhang", age: 18 },
    { name: "li", age: 18 },
    { name: "li", age: 18 },
  ],
   (item) => item.name
);
```
 */
export function groupByArray<T extends any>(
  list: T[],
  field: (item: T) => any
): [Array<Array<T>>, Map<any, T[]>] {
  const group = new Map<any, T[]>();
  for (let item of list) {
    const key = field(item);

    if (!group.has(key)) {
      group.set(key, []);
    }

    group.get(key)?.push(item);
  }

  return [Array.from(group.values()), group];
}
