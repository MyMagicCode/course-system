import { GetProp, TableProps } from "antd";
import { useEffect, useState } from "react";

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

type TableParams = {
  pagination?: TablePaginationConfig;
  [k: string]: any;
};
/**
 *
 * @param url 请求地址
 * @returns [数据列表，请求参数，加载状态，表格onChange回调，查询方法]
 */
export function useAntTable<T>(
  url: string
): [
  T[],
  TableParams,
  boolean,
  TableProps["onChange"],
  (load: Record<string, any>) => void
] {
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // 参数信息
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  // 表格数据
  const [tableData, setTableData] = useState<T[]>([]);

  // 查询数据的方法
  const fetchData = () => {
    let flag = true;
    setLoading(true);
    fetch(`${url}?${objectToParams(getParams(tableParams))}`)
      .then((res) => res.json())
      .then(({ results, total }) => {
        setLoading(false);
        if (!flag) false;
        setTableData(results);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total,
          },
        });
      });
    return () => {
      flag = false;
    };
  };

  const handleQuery = (load: Record<string, any>) => {
    load = JSON.parse(JSON.stringify(load));
    setTableParams({
      ...load,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
    setRefresh((r) => !r);
  };

  const handleTableChange: TableProps["onChange"] = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
    setRefresh((r) => !r);
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableData([]);
    }
  };

  useEffect(() => {
    const cancel = fetchData();
    return () => cancel();
  }, [refresh]);

  return [tableData, tableParams, loading, handleTableChange, handleQuery];
}

const getParams = ({ pagination, ...other }: TableParams) => ({
  ...other,
  pageSize: pagination?.pageSize,
  page: pagination?.current,
});

function objectToParams(obj: Record<string, any>) {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }

  return params.toString();
}
