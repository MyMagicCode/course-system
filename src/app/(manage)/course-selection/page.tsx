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
import {
  CourseSelectionModal,
  CourseSelectionModalRef,
  CourseSelectionModel,
} from "./components/CourseSelectionModal";
import { useRef } from "react";
import { useAntTable } from "@/hook/useAntTable";
import { useIsAdmin } from "@/hook/useIsAdmin";

export default function CourseSelection() {
  const CourseSelectionModalRef = useRef<CourseSelectionModalRef>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const isAdmin = useIsAdmin();

  const [tableData, tableParams, loading, handleTableChange, query] =
    useAntTable("/api/course-selection/list");

  const handleEdit = (item: CourseSelectionModel) => {
    CourseSelectionModalRef.current?.open(item);
  };

  const columns: TableProps<CourseSelectionModel>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "学生姓名",
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: "选课情况",
      dataIndex: "courses",
      key: "courses",
      render: (_, record) => (
        <div className="truncate" style={{ width: 400 }}>
          {record.courses?.map((it) => it.name).join(",")}
        </div>
      ),
    },
    {
      title: "累计学分",
      dataIndex: "credit",
      key: "credit",
      width: 120,
      render: (_, record) => (
        <span>
          {record.courses
            ?.map((it) => it.credit)
            .reduce((pr, cu) => pr + cu, 0) || 0}
        </span>
      ),
    },
    {
      title: "累计学时",
      dataIndex: "studyHours",
      key: "studyHours",
      width: 120,
      render: (_, record) => (
        <span>
          {record.courses
            ?.map((it) => it.studyHours)
            .reduce((pr, cu) => pr + cu, 0) || 0}
        </span>
      ),
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
            选课
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
          <Form.Item label="学生姓名" name="name">
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
        <div className=" font-bold text-base mb-2">学生选课列表</div>
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
      <CourseSelectionModal
        onSubmit={() => {
          query({});
        }}
        ref={CourseSelectionModalRef}
      />
    </>
  );
}
