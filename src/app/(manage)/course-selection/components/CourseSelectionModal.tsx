import { useSelectData } from "@/hook/useSelectData";
import { course } from "@prisma/client";
import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface CourseSelectionModel {
  id?: string;
  courses?: course[];
  name: string;
  courseIds: number[];
}

export interface CourseSelectionModalRef {
  open: (item?: CourseSelectionModel) => void;
  close: () => void;
}

function initData(): CourseSelectionModel {
  return {
    name: "",
    courseIds: [],
  };
}

const fieldNames = { label: "name", value: "id" };

/**
 * 新增和修改课程组件
 */
export const CourseSelectionModal = forwardRef<
  CourseSelectionModalRef,
  { onSubmit: () => void }
>(({ onSubmit }, ref) => {
  const data = initData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const courseList = useSelectData("courseList");

  // 暴露ref接口控制组件
  useImperativeHandle(
    ref,
    () => {
      return {
        open(item?: CourseSelectionModel) {
          if (item) {
            const { courses, ...other } = item;
            form.setFieldsValue({
              ...other,
              courseIds: courses?.map((it) => it.id) || [],
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

  const handleFinish: FormProps<CourseSelectionModel>["onFinish"] = (item) => {
    fetch("/api/course-selection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...item }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          onSubmit();
          messageApi.success("操作成功");
          handleCancel();
        } else {
          messageApi.error(res.msg);
        }
      })
      .catch(() => {
        messageApi.error("操作失败");
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
      title={"选课情况"}
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
        <Form.Item<CourseSelectionModel> hidden name="id"></Form.Item>
        <Form.Item<CourseSelectionModel>
          label="学生名称"
          name="name"
          rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item<CourseSelectionModel> name="courseIds" label="课程选择">
          <Select
            mode="multiple"
            maxTagCount={1}
            options={courseList}
            fieldNames={fieldNames}
            placeholder="请选择"
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
