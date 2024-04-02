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
    setLoading(true);
    fetch(`${url}?${objectToParams(getRandomuserParams(tableParams))}`)
      .then((res) => res.json())
      .then(({ results }) => {
        setTableData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 200,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
  };

  const handleQuery = (load: Record<string, any>) => {
    setTableParams({
      ...load,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const handleTableChange: TableProps["onChange"] = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  return [tableData, tableParams, loading, handleTableChange, handleQuery];
}

const getRandomuserParams = ({ pagination, ...other }: TableParams) => ({
  ...other,
  results: pagination?.pageSize,
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
