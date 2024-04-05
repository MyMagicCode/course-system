"use client";
import { Button, Form, Input, Space, Table, TableProps, message } from "antd";
import {
  SemesterModal,
  SemesterModalRef,
  SemesterModel,
} from "./components/SemesterModal";
import { useRef } from "react";
import { useAntTable } from "@/hook/useAntTable";

export default function Semester() {
  const semesterModalRef = useRef<SemesterModalRef>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [tableData, tableParams, loading, handleTableChange, query] =
    useAntTable("/api/semester/list");

  const handleEdit = (item: SemesterModel) => {
    semesterModalRef.current?.open(item);
  };

  const handleDelete = async (item: SemesterModel)=>{
    try {
      await fetch('/api/semester', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id:item.id }),
      })
      messageApi.success("操作成功")
      handleQuery({})
    } catch (error) {
      messageApi.error("操作失败")
    }
  }

  const columns: TableProps<SemesterModel>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_, __, index) => <a>{index + 1}</a>,
    },
    {
      title: "学期名称",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "开始时间",
      dataIndex: "beginDate",
      key: "beginDate",
    },
    {
      title: "结束时间",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "创建事件",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <a>{text}</a>,
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
          <Button type="link" danger onClick={()=>handleDelete(record)}>
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
          onFinish={handleQuery}>
          <Form.Item label="学期名称" name="label">
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
          onClick={() => semesterModalRef.current?.open()}>
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
      <SemesterModal onSubmit={()=>{
        console.log("object");
        query({})
      }} ref={semesterModalRef} />
    </>
  );
}

