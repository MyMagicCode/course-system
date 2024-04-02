"use client"
import { Button, Form, Input } from "antd";
import Classrooms from "./components/Classrooms";

export default function Scheduling() {
  const handleQuery = ()=>{

  }
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
    <Classrooms></Classrooms>
    </>
  );
}
