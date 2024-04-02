import { Button, DatePicker, Form, FormProps, Input, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface CourseModel {
  code?: string;
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface CourseModalRef {
  open: (item?: CourseModel) => void;
  close: () => void;
}

function initData(): CourseModel {
  return { name: "", startTime: "", endTime: "" };
}

/**
 * 新增和修改课程组件
 */
export const CourseModal = forwardRef<CourseModalRef>((_, ref) => {
  const data = initData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const isEdit = !!data.id;

  // 暴露ref接口控制组件
  useImperativeHandle(
    ref,
    () => {
      return {
        open(item?: CourseModel) {
          if (item) {
            form.setFieldsValue({
              ...item,
              endTime: dayjs(item.endTime),
              startTime: dayjs(item.startTime),
            });
          }
          setIsModalOpen(true);
        },
        close() {
          setIsModalOpen(false);
        },
      };
    },
    []
  );

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFinish: FormProps<CourseModel>["onFinish"] = ({
    endTime,
    startTime,
    ...item
  }) => {
    endTime = (endTime as any).format("YYYY-MM-DD");
    startTime = (startTime as any).format("YYYY-MM-DD");
    console.log("item", { ...item, endTime, startTime });
  };

  const validateMessages = {
    required: "'${label}'不能为空",
  };

  return (
    <Modal
      centered
      onCancel={handleCancel}
      title={isEdit ? "编辑课程" : "新增课程"}
      footer={null}
      open={isModalOpen}>
      <Form
        name="basic"
        form={form}
        validateMessages={validateMessages}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        initialValues={data}
        onFinish={handleFinish}
        autoComplete="off">
        <Form.Item<CourseModel>
          label="课程名称"
          name="name"
          rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item<CourseModel>
          label="开始时间"
          name="startTime"
          dependencies={["endTime"]}
          rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item<CourseModel>
          label="结束时间"
          name="endTime"
          dependencies={["startTime"]}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator() {
                if (getFieldValue("startTime") < getFieldValue("endTime")) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("结束时间不能小于开始时间"));
              },
            }),
          ]}>
          <DatePicker />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
          <Button type="primary" className="bg-[#1677ff]" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});
