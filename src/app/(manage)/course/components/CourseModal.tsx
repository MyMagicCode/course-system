import { useSelectData } from "@/hook/useSelectData";
import { Button, DatePicker, Form, FormProps, Input, InputNumber, Modal, Select, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface CourseModel {
  id?: string;
  describe: String;
  name: string;
  studyHours: string;
  credit: string;
  teacherId: string | null;
  assistantId: string | null;
}

export interface CourseModalRef {
  open: (item?: CourseModel) => void;
  close: () => void;
}

function initData(): CourseModel {
  return { name: "", describe: "", teacherId: null, assistantId: null, studyHours: "", credit: "" };
}

const fieldNames = { label: "name", value: "id" }

/**
 * 新增和修改课程组件
 */
export const CourseModal = forwardRef<CourseModalRef, { onSubmit: () => void }>(({onSubmit}, ref) => {
  const data = initData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const assistants = useSelectData("assistants")
  const teachers = useSelectData("teachers")

  // 暴露ref接口控制组件
  useImperativeHandle(
    ref,
    () => {
      return {
        open(item?: CourseModel) {
          if (item) {
            form.setFieldsValue({
              ...item,
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

  const handleFinish: FormProps<CourseModel>["onFinish"] = (item
  ) => {
    fetch('/api/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...item}),
    }).then(res => {
      onSubmit();
      messageApi.success("操作成功")
      handleCancel();
    }).catch(()=>{
      messageApi.error("操作失败")
    });
    console.log("item", { ...item });
  };

  const validateMessages = {
    required: "'${label}'不能为空",
  };

  return (
    <Modal
      centered
      onCancel={handleCancel}
      title={"课程信息"}
      footer={null}
      open={isModalOpen}>
        {contextHolder}
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
          hidden
          name="id"
        >
        </Form.Item>
        <Form.Item<CourseModel>
          label="课程名称"
          name="name"
          rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item<CourseModel>
          label="简介"
          name="describe"
          rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="请输入" />
        </Form.Item>

        <Form.Item<CourseModel>
          label="学分"
          name="credit"
          rules={[{ required: true }]}>
          <InputNumber min={0}  style={{ width: '100%' }}  placeholder="请输入" />
        </Form.Item>

        <Form.Item<CourseModel>
          label="学时"
          name="studyHours"
          rules={[{ required: true }]}>
          <InputNumber min={1}  style={{ width: '100%' }}  placeholder="请输入" />
        </Form.Item>

        <Form.Item<CourseModel>
          label="任课老师"
          name="teacherId"
          rules={[{ required: true }]}>
          <Select
            options={teachers}
            fieldNames={fieldNames}
            placeholder="请选择"
          />
        </Form.Item>
        <Form.Item<CourseModel>
          label="助教"
          name="assistantId"
          >
          <Select
            options={assistants}
            fieldNames={fieldNames}
            placeholder="请选择"
            allowClear
          />
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
