import { useSelectData } from "@/hook/useSelectData";
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

export interface ExamModel {
  id?: number;
  courseId: number | null; // 课程id
  name: string;
  minutes: number | null; // 分钟数
  classroomId: number | null; // 考试地点
  courseName?: string;
  position?: string;
}

export interface ExamModalRef {
  open: (item?: ExamModel) => void;
  close: () => void;
}

function initData(): ExamModel {
  return { name: "", minutes: null, classroomId: null, courseId: null };
}

const fieldNames = { label: "name", value: "id" };

/**
 * 新增和修改考试组件
 */
export const ExamModal = forwardRef<ExamModalRef, { onSubmit?: () => void }>(
  ({ onSubmit }, ref) => {
    const data = initData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const courseList = useSelectData("courseList");
    const classrooms = useSelectData("classrooms");

    const isEdit = !!data.id;

    // 暴露ref接口控制组件
    useImperativeHandle(
      ref,
      () => {
        return {
          open(item?: ExamModel) {
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

    const handleFinish: FormProps<ExamModel>["onFinish"] = ({ ...item }) => {
      fetch("/api/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...item }),
      })
        .then((res) => {
          onSubmit?.();
          messageApi.success("操作成功");
          handleCancel();
        })
        .catch(() => {
          messageApi.error("操作失败");
        });
    };

    const validateMessages = {
      required: "'${label}'不能为空",
    };

    return (
      <Modal
        centered
        onCancel={handleCancel}
        title={isEdit ? "编辑考试" : "新增考试"}
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
          <Form.Item<ExamModel> hidden name="id"></Form.Item>
          <Form.Item<ExamModel>
            label="考试名称"
            name="name"
            rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item<ExamModel>
            label="考试课程"
            name="courseId"
            rules={[{ required: true }]}>
            <Select
              options={courseList}
              fieldNames={fieldNames}
              placeholder="请选择"
            />
          </Form.Item>

          <Form.Item<ExamModel>
            label="考试时间"
            name="minutes"
            rules={[{ required: true }]}>
            <InputNumber
              addonAfter={<span className="ml-2">分钟</span>}
              min={1}
              style={{ width: "100%" }}
              placeholder="请输入"
            />
          </Form.Item>

          <Form.Item<ExamModel>
            label="考试地点"
            name="classroomId"
            rules={[{ required: true }]}>
            <Select
              options={classrooms}
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
  }
);
