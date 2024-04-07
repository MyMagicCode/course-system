"use client";
import { Button, DatePicker, Form, Input, Spin } from "antd";
import Classrooms, { ClassroomType } from "./components/Classrooms";
import { useAntTable } from "@/hook/useAntTable";
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";

export default function Scheduling() {
  const [form] = Form.useForm()
  const [dataList, tableParams, loading, handleTableChange, query] =
    useAntTable<ClassroomType>("/api/scheduling/list",{date:dayjs().format("YYYY-MM-DD")});

  useEffect(()=>{
    handleQuery(form.getFieldsValue())
  },[])

  const handleQuery = (fromData: any) => {
    fromData.date = fromData.date?.format("YYYY-MM-DD")
    query({ ...fromData });
  };

  const handleRefresh = useCallback(()=>{
    handleQuery(form.getFieldsValue())
  },[query])

  return (
    <>
      <div className="w-full mt-6 p-5 bg-white rounded-xl">
        <Form
          form={form}
          layout="inline"
          initialValues={{ date: dayjs() }}
          onFinish={handleQuery}
        >
          <Form.Item label="日期" name="date">
            <DatePicker placeholder="请输入" />
          </Form.Item>
          <Form.Item label="教室名称" name="name">
            <Input allowClear placeholder="请输入" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="bg-[#1677ff]" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Spin spinning={loading}>
        <Classrooms onRefresh={handleRefresh} list={dataList}></Classrooms>
      </Spin>
    </>
  );
}
