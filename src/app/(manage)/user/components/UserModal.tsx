import { useSelectData } from "@/hook/useSelectData";
import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  message,
} from "antd";
import { MD5 } from "crypto-js";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface UserModel {
  id?: number;
  name: string;
  courseId: number | null;
  teacherId: number | null;
  title?: string;
  age?: number;
  password?: string;
  account: String;
  role: string;
}

export interface UserModalRef {
  open: (item?: UserModel) => void;
  close: () => void;
}

function initData(): UserModel {
  return {
    name: "",
    password: "",
    teacherId: null,
    courseId: null,
    role: "TEACHER",
    account: "",
  };
}
const options = [
  { label: "教师", value: "TEACHER" },
  { label: "学生", value: "STUDENT" },
  { label: "管理员", value: "ADMIN" },
];

const titleOptions = [
  { label: "教师", value: "FORMAL" },
  { label: "助教", value: "DEPUTY" },
];

const fieldNames = { label: "name", value: "id" };

/**
 * 新增和修改课程组件
 */
export const UserModal = forwardRef<UserModalRef, { onSubmit: () => void }>(
  ({ onSubmit }, ref) => {
    const data = initData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEdit, setIsEdit] = useState(false);

    // 暴露ref接口控制组件
    useImperativeHandle(
      ref,
      () => {
        return {
          open(item?: UserModel) {
            if (item) {
              if (item.id) {
                setIsEdit(true);
              }
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
      setIsEdit(false);
      form.resetFields();
    };

    const handleFinish: FormProps<UserModel>["onFinish"] = (item) => {
      item.password = item.password ? MD5(item.password).toString() : undefined;
      fetch("/api/user", {
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
            messageApi.error("操作失败");
          }
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
        title={"用户信息"}
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
          <Form.Item<UserModel> hidden name="id"></Form.Item>
          <Form.Item<UserModel>
            label="用户名称"
            name="name"
            rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item<UserModel>
            label="登录账户"
            name="account"
            rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item<UserModel>
            label="用户类型"
            name="role"
            rules={[{ required: true }]}>
            <Radio.Group
              disabled={isEdit}
              options={options}
              optionType="button"
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.role !== currentValues.role
            }>
            {({ getFieldValue }) =>
              getFieldValue("role") === "TEACHER" ? (
                <>
                  <Form.Item
                    name="title"
                    label="职称"
                    rules={[{ required: true }]}>
                    <Select options={titleOptions} placeholder="请选择" />
                  </Form.Item>
                  <Form.Item
                    name="age"
                    label="年龄"
                    rules={[{ required: true }]}>
                    <InputNumber min={1} placeholder="请输入" />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
          <Form.Item
            label="登录密码"
            name="password"
            rules={[{ required: !isEdit }]}>
            <Input />
          </Form.Item>

          {/* <Form.Item
            label="确认密码"
            name="password2"
            dependencies={["password"]}
            rules={[
              {
                required: !isEdit,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次密码输入不匹配！"));
                },
              }),
            ]}>
            <Input />
          </Form.Item> */}
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
