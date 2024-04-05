"use client";
import { Button, Form, Input, Space, Table, TableProps, Tooltip, message } from "antd";
import {
  CourseModal,
  CourseModalRef,
  CourseModel,
} from "./components/CourseModal";
import { useRef } from "react";
import { useAntTable } from "@/hook/useAntTable";

export default function Course() {
  const CourseModalRef = useRef<CourseModalRef>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [tableData, tableParams, loading, handleTableChange, query] =
    useAntTable("/api/course/list");

  const handleEdit = (item: CourseModel) => {
    CourseModalRef.current?.open(item);
  };

  const handleDelete = async (item: CourseModel) => {
    try {
      await fetch("/api/course", {
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
      render: (text, record) => (
        <Tooltip placement="top" title={text}>
          <div className="truncate">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "简介",
      dataIndex: "describe",
      key: "describe",
      width: 400,
      render: (text, record) => (
        <Tooltip placement="top" title={text}>
          <div className="truncate" style={{width:400}}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "学分",
      dataIndex: "credit",
      key: "credit",
    },
    {
      title: "学时",
      dataIndex: "studyHours",
      key: "studyHours",
    },
    {
      title: "授课老师",
      dataIndex: "teacherName",
      key: "teacherName",
    },
    {
      title: "助教",
      dataIndex: "assistantName",
      key: "assistantName",
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
          <Button type="link" danger onClick={() => handleDelete(record)}>
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
      {contextHolder}
      <div className="w-full mt-6 p-5 bg-white rounded-xl">
        <Form
          layout="inline"
          initialValues={{ layout: "inline" }}
          onFinish={handleQuery}
        >
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
          onClick={() => CourseModalRef.current?.open()}
        >
          添加
        </Button>
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
      <CourseModal onSubmit={()=>{
        query({})
      }} ref={CourseModalRef} />
    </>
  );
}
