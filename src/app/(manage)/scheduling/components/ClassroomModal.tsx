import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  List,
  Modal,
  Radio,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { EditOutlined, HighlightOutlined } from "@ant-design/icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ClassroomType, ScheduleType } from "./Classrooms";

const { Option } = Select;

export interface ClassroomModalRef {
  open: (item?: ClassroomType) => void;
  close: () => void;
}

function initData(): ClassroomType {
  return {
    id: "",
    location: "",
    scheduleList: [],
  };
}

const options = [
  { label: "课程", value: "0" },
  { label: "考试", value: "1" },
];

/**
 * 新增和修改学期组件
 */
export const ClassroomModal = forwardRef<ClassroomModalRef>((_, ref) => {
  const [data, setData] = useState<ClassroomType>(initData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 暴露ref接口控制组件
  useImperativeHandle(
    ref,
    () => {
      return {
        open(item?: ClassroomType) {
          if (item) {
            const { scheduleList, ...other } = item;
            setData({
              ...other,
              scheduleList: [...scheduleList],
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
  };

  const handleEditItem = (item: ScheduleType) => {
    console.log("item", item);
  };

  const handleFormFinish: FormProps<ClassroomType>["onFinish"] = ({
    ...item
  }) => {
    console.log("item", { ...item });
  };

  const onTypeChange = () => {
    form.setFields([
      {
        name: "customizeGender",
        errors: undefined,
      },
      {
        name: "begin",
        errors: undefined,
      },
      {
        name: "num",
        errors: undefined,
      },
      {
        name: "students",
        errors: undefined,
      },
      {
        name: "teachers",
        errors: undefined,
      },
    ]);
  };

  const validateMessages = {
    required: "'${label}'不能为空",
  };

  return (
    <Modal
      centered
      onCancel={handleCancel}
      title={data.location + "教室排期"}
      footer={null}
      width={600}
      open={isModalOpen}>
      <div className="flex h-[350px]">
        <div className="flex-1">
          <p className="font-bold text-center">当前排期</p>
          <List
            bordered
            className="h-[328px] overflow-y-scroll custom-scrollbar"
            itemLayout="horizontal"
            dataSource={data.scheduleList}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditItem(item)}></Button>,
                ]}>
                <List.Item.Meta
                  title={
                    <span>{`${item.begin}-${item.end} ${item.label}`}</span>
                  }
                />
              </List.Item>
            )}
          />
        </div>
        <div className="w-[240px]">
          <p className="font-bold text-center mb-2">排期设置</p>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            form={form}
            validateMessages={validateMessages}
            name="control-hooks"
            onFinish={handleFormFinish}
            style={{ maxWidth: 600 }}>
            <Form.Item name="type" label="类型">
              <Radio.Group
                options={options}
                onChange={onTypeChange}
                optionType="button"
              />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.type !== currentValues.type
              }>
              {({ getFieldValue }) =>
                getFieldValue("type") === "0" ? (
                  <>
                    <Form.Item
                      name="customizeGender"
                      label="课程"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="begin"
                      label="开始"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="num"
                      label="节数"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      name="customizeGender"
                      label="考试"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="begin"
                      label="开始"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="teachers"
                      label="监考老师"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="students"
                      label="考试学生"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 7, span: 17 }}>
              <Space>
                <Button
                  className="bg-[#1677ff]"
                  type="primary"
                  htmlType="submit">
                  提交
                </Button>
                <Button htmlType="button" onClick={() => form.resetFields()}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="text-center mt-4">
        <Button type="text" icon={<HighlightOutlined />}>
          保存
        </Button>
      </div>
    </Modal>
  );
});
