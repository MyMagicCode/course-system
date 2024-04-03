"use client";
import { Button, Form, Input } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";

interface TimetableItem {
  date: string;
  begin: string;
  num: string;
  content: string;
}

const data: TimetableItem[] = [
  {
    date: "2024-04-03",
    begin: "2",
    num: "2",
    content: "Java程序设计@A栋5013(2-3)",
  },
  {
    date: "2024-04-03",
    begin: "4",
    num: "2",
    content: "大数据与开发@A栋5013(2-3)",
  },
  {
    date: "2024-04-03",
    begin: "8",
    num: "2",
    content: "时事政治@A栋5013(2-3)",
  },
  {
    date: "2024-04-04",
    begin: "1",
    num: "3",
    content: "Java程序设计@A栋4003(2-3)",
  },
];

export default function Timetable() {
  const handleQuery = () => {};
  const bodyContent = useMemo(() => {
    const timetableList = generateTableList(data);
    return timetableList.map((list, i) => {
      return (
        <tr
          key={"table-row-" + i}
          className="odd:bg-white even:bg-gray-50 border-b border-dashed">
          {list.map((item) => {
            if (!item.isShow) return null;
            if (item.tag === "th") {
              return (
                <th
                  key={item.key}
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.content}
                </th>
              );
            } else {
              return (
                <td
                  key={item.key}
                  rowSpan={item.rowSpan}
                  className="px-2 py-2 relative">
                  {item.content}
                </td>
              );
            }
          })}
        </tr>
      );
    });
  }, [data]);
  return (
    <>
      <div className="w-full mt-6 p-5 bg-white rounded-xl">
        <Form
          layout="inline"
          initialValues={{ layout: "inline" }}
          onFinish={handleQuery}>
          <Form.Item label="学期名称" name="name">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="bg-[#1677ff]" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="relative custom-scrollbar overflow-x-auto shadow-md sm:rounded-lg mt-5 overflow-y-scroll h-[calc(100vh-180px)]">
        <table className="w-full table-fixed text-sm text-left rtl:text-right text-gray-700 ">
          <thead className="text-xs text-gray-700 bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3 w-[80px]">
                时间
              </th>
              <th scope="col" className="px-6 py-3">
                一
              </th>
              <th scope="col" className="px-6 py-3">
                二
              </th>
              <th scope="col" className="px-6 py-3">
                三
              </th>
              <th scope="col" className="px-6 py-3">
                四
              </th>
              <th scope="col" className="px-6 py-3">
                五
              </th>
              <th scope="col" className="px-6 py-3">
                六
              </th>
              <th scope="col" className="px-6 py-3">
                天
              </th>
            </tr>
          </thead>
          <tbody>{bodyContent}</tbody>
        </table>
      </div>
    </>
  );
}

/**
  单元格组件
 */
function Col({ content }: { content: string }) {
  return (
    <div className="shadow-md absolute inset-[10px] overflow-y-scroll custom-scrollbar bg-white rounded-lg box-border p-1">
      {content}
    </div>
  );
}

/**
 * 生成课程表数据
 * @returns 二维列表
 */
function generateTableList(list: TimetableItem[]) {
  // 生成表格默认数据
  const dataList = Array.from({ length: 13 }).map((_, index) => {
    const thContent = (
      <span>{`${index + 1}(${calcTime(index + 1).format})`}</span>
    );
    return Array.from({ length: 8 }).map((_, i) => {
      return {
        key: "col" + index + i,
        tag: i === 0 ? "th" : "td",
        isShow: true,
        rowSpan: 1, // 合并多少行
        content: i === 0 ? thContent : null,
      };
    });
  });
  list.forEach((item) => {
    const y = dayjs(item.date).day();
    const x = parseInt(item.begin) - 1;
    const col = dataList[x][y];

    // 合并行
    // 计算合并多少行
    const num = parseInt(item.num);
    for (let i = 1; i < num; i++) {
      dataList[x + i][y].isShow = false;
    }
    col.rowSpan = num;
    col.content = <Col content={item.content} />;
    // <div className="w-full overflow-hidden">{item.content}</div>;
  });
  return dataList;
}

/**
 *
 * @param num 第几节课
 * @returns
 */
function calcTime(num: number) {
  let minutes = 480; // 基础上课时间
  const timeLength = 45; // 一节课的时间
  switch (num) {
    case 13:
      minutes += timeLength + 10;
    case 12:
      minutes += timeLength + 10;
    case 11:
      minutes += timeLength + 10;
    case 10:
      minutes += 60 + timeLength;
    case 9:
      minutes += timeLength + 10;
    case 8:
      minutes += timeLength + 10;
    case 7:
      minutes += timeLength + 10;
    case 6:
      minutes += 125 + timeLength;
    case 5:
      minutes += timeLength + 10;
    case 4:
      minutes += timeLength + 10;
    case 3:
      minutes += timeLength + 10;
    case 2:
      minutes += timeLength + 10; // 第二季为一节课40分钟 + 10分钟休息时间
    case 1:
      minutes += 0; // 第一节课上课偏移时间
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hoursString = String(hours).padStart(2, "0");
  const minsString = String(mins).padStart(2, "0");

  return {
    format: `${hoursString}:${minsString}`,
    timeLength,
    minutes,
  };
}
