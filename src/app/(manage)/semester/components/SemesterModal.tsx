import { useSelectData } from "@/hook/useSelectData";
import { Button, DatePicker, Form, FormProps, Input, Modal, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface SemesterModel {
  code?: string;
  id?: string;
  label: string;
  beginDate: string;
  endDate: string;
}

export interface SemesterModalRef {
  open: (item?: SemesterModel) => void;
  close: () => void;
}

function initData(): SemesterModel {
  return { label: "", beginDate: "", endDate: "" };
}


/**
 * 新增和修改学期组件
 */
export const SemesterModal = forwardRef<SemesterModalRef, { onSubmit: () => void }>(({ onSubmit }, ref) => {
  const data = initData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
 
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
              endDate: dayjs(item.endDate),
              beginDate: dayjs(item.beginDate),
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
    endDate,
    beginDate,
    ...item
  }) => {
    endDate = (endDate as any).format("YYYY-MM-DD");
    beginDate = (beginDate as any).format("YYYY-MM-DD");

    fetch('/api/semester', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...item, endDate, beginDate, }),
    }).then(res => {
      onSubmit();
      messageApi.success("操作成功")
      handleCancel();
    }).catch(()=>{
      messageApi.error("操作失败")
    });
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
        <Form.Item<SemesterModel>
          hidden
          name="id"
        >
        </Form.Item>
        <Form.Item<SemesterModel>
          label="学期名称"
          name="label"
          rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item<SemesterModel>
          label="开始时间"
          name="beginDate"
          dependencies={["endDate"]}
          rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item<SemesterModel>
          label="结束时间"
          name="endDate"
          dependencies={["beginDate"]}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator() {
                if (getFieldValue("beginDate") < getFieldValue("endDate")) {
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
