import { Button, DatePicker, Form, FormProps, Input, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface SemesterModel {
  code?: string;
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface SemesterModalRef {
  open: (item?: SemesterModel) => void;
  close: () => void;
}

function initData(): SemesterModel {
  return { name: "", startTime: "", endTime: "" };
}

/**
 * 新增和修改学期组件
 */
export const ClassroomModal = forwardRef<SemesterModalRef>((_, ref) => {
  const data = initData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const isEdit = !!data.id;

  // 暴露ref接口控制组件
  useImperativeHandle(
    ref,
    () => {
      return {
        open(item?: SemesterModel) {
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

  const handleFinish: FormProps<SemesterModel>["onFinish"] = ({
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
      title={isEdit ? "编辑学期" : "新增学期"}
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
        <Form.Item<SemesterModel>
          label="学期名称"
          name="name"
          rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item<SemesterModel>
          label="开始时间"
          name="startTime"
          dependencies={["endTime"]}
          rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item<SemesterModel>
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
