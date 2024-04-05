import { useEffect, useMemo, useState } from "react";

export function useSelectData(code: string) {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    let flag = true;
    fetch("/api/select/" + code).then(async (result) => {
      if (flag) {
        setList((await result.json()) as any[]);
      }
    });
    return () => {
      flag = false;
    };
  }, [code]);

  return list;
}
