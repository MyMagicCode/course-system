"use client";
import { Button, Form, Input, Space, Table, TableProps } from "antd";
import { ExamModal, ExamModalRef, ExamModel } from "./components/ExamModal";
import { useRef } from "react";
import { useAntTable } from "@/hook/useAntTable";

export default function Exam() {
  const ExamModalRef = useRef<ExamModalRef>(null);

  const [tableData, tableParams, loading, handleTableChange, query] =
    useAntTable("https://randomuser.me/api");

  const handleEdit = (item: ExamModel) => {
    console.log("item", item);
    ExamModalRef.current?.open(item);
  };

  const columns: TableProps<ExamModel>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_, __, index) => <a>{index + 1}</a>,
    },
    {
      title: "考试名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "考试科目",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "考试时间",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "地点",
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
          <Form.Item label="考试名称" name="name">
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
          onClick={() => ExamModalRef.current?.open()}>
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
      <ExamModal ref={ExamModalRef} />
    </>
  );
}

const data: ExamModel[] = [
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
