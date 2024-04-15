"use client";
import {
  Button,
  Form,
  Input,
  Space,
  Table,
  TableProps,
  Tooltip,
  message,
} from "antd";
import { UserModal, UserModalRef, UserModel } from "./components/UserModal";
import { useRef } from "react";
import { useAntTable } from "@/hook/useAntTable";
import { useIsAdmin } from "@/hook/useIsAdmin";

export default function User() {
  const UserModalRef = useRef<UserModalRef>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const isAdmin = useIsAdmin();

  const [tableData, tableParams, loading, handleTableChange, query] =
    useAntTable("/api/user/list");

  const handleEdit = (item: UserModel) => {
    UserModalRef.current?.open(item);
  };

  const handleDelete = async (item: UserModel) => {
    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (data.status === 200) {
        messageApi.success("操作成功");
        handleQuery({});
      } else {
        messageApi.error(data.msg);
      }
    } catch (error) {
      messageApi.error("操作失败");
    }
  };

  const columns: TableProps<UserModel>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "用户名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "账户",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "用户类型",
      dataIndex: "role",
      key: "role",
      render(value) {
        return value === "ADMIN"
          ? "管理员"
          : value === "TEACHER"
          ? "教师"
          : "学生";
      },
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "更新日期",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
          <Button
            type="link"
            disabled={record.id === 1}
            onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            disabled={record.id === 1}
            danger
            onClick={() => handleDelete(record)}>
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
          <Form.Item label="用户名称" name="name">
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
            onClick={() => UserModalRef.current?.open()}>
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
      <UserModal
        onSubmit={() => {
          query({});
        }}
        ref={UserModalRef}
      />
    </>
  );
}
