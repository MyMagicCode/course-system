"use client";
import { Button, Form, Input, Space, Table, TableProps } from "antd";
import {
  CourseModal,
  CourseModalRef,
  CourseModel,
} from "./components/CourseModal";
import { useRef } from "react";
import { useAntTable } from "@/hook/useAntTable";

export default function Course() {
  const CourseModalRef = useRef<CourseModalRef>(null);

  const [tableData, tableParams, loading, handleTableChange, query] =
    useAntTable("https://randomuser.me/api");

  const handleEdit = (item: CourseModel) => {
    console.log("item", item);
    CourseModalRef.current?.open(item);
  };

  const columns: TableProps<CourseModel>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_, __, index) => <a>{index + 1}</a>,
    },
    {
      title: "课程名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "简介",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "学分",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "学时",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "授课老师",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "助教",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleQuery = (fromData: any) => {
    query({ ...fromData });
  };
  return (
    <>
      <div className="w-full mt-6 p-5 bg-white rounded-xl">
        <Form
          layout="inline"
          initialValues={{ layout: "inline" }}
          onFinish={handleQuery}>
          <Form.Item label="课程名称" name="name">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="bg-[#1677ff]" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="w-full mt-4 p-5 bg-white rounded-xl">
        <Button
          type="primary"
          className="bg-[#1677ff] mb-2"
          onClick={() => CourseModalRef.current?.open()}>
          添加
        </Button>
        <Table
          columns={columns}
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          rowKey={(record) => "rwo" + record.id}
          scroll={{ y: "calc(100vh - 390px - 2.25rem)", x: "max-content" }}
          onChange={handleTableChange}
        />
      </div>
      <CourseModal ref={CourseModalRef} />
    </>
  );
}

const data: CourseModel[] = [
  {
    code: "XQ.123123131",
    name: "John Brown",
    startTime: "2024-10-27",
    endTime: "2024-12-27",
    id: "1",
  },
  {
    code: "XQ.123123131",
    name: "John Brown",
    startTime: "2024-01-27",
    endTime: "2024-03-27",
    id: "2",
  },
  {
    code: "XQ.123123131",
    name: "John Brown",
    startTime: "2024-03-27",
    endTime: "2024-09-27",
    id: "3",
  },
];
