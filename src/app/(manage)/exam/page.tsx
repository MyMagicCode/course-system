"use client";
import { Button, Form, Input, Space, Table, TableProps, message } from "antd";
import { ExamModal, ExamModalRef, ExamModel } from "./components/ExamModal";
import { useRef } from "react";
import { useAntTable } from "@/hook/useAntTable";
import { useIsAdmin } from "@/hook/useIsAdmin";

export default function Exam() {
  const ExamModalRef = useRef<ExamModalRef>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const isAdmin = useIsAdmin();

  const [tableData, tableParams, loading, handleTableChange, query] =
    useAntTable("/api/exam/list");

  const handleEdit = (item: ExamModel) => {
    console.log("item", item);
    ExamModalRef.current?.open(item);
  };

  const handleDelete = async (item: ExamModel) => {
    try {
      await fetch("/api/exam", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });
      messageApi.success("操作成功");
      handleQuery({});
    } catch (error) {
      messageApi.error("操作失败");
    }
  };

  const columns: TableProps<ExamModel>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "考试名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "考试科目",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "考试时间",
      dataIndex: "minutes",
      key: "minutes",
    },
    {
      title: "地点",
      dataIndex: "position",
      key: "position",
    },
  ];

  // 管理员才能编辑和删除
  if (isAdmin) {
    columns.push({
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    });
  }

  const handleQuery = (fromData: any) => {
    query({ ...fromData });
  };
  return (
    <>
      {contextHolder}
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
        {isAdmin && (
          <Button
            type="primary"
            className="bg-[#1677ff] mb-2"
            onClick={() => ExamModalRef.current?.open()}>
            添加
          </Button>
        )}
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={tableParams.pagination}
          loading={loading}
          rowKey={(record) => "rwo" + record.id}
          scroll={{ y: "calc(100vh - 390px - 2.25rem)", x: "max-content" }}
          onChange={handleTableChange}
        />
      </div>
      <ExamModal onSubmit={() => query({})} ref={ExamModalRef} />
    </>
  );
}
