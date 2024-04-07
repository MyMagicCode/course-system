"use client";
import { Button, Form, Input } from "antd";
import Classrooms, { ClassroomType } from "./components/Classrooms";
import { useAntTable } from "@/hook/useAntTable";

export default function Scheduling() {
  const [dataList, tableParams, loading, handleTableChange, query] =
    useAntTable<ClassroomType>("/api/scheduling/list");

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
      <Classrooms list={dataList}></Classrooms>
    </>
  );
}
