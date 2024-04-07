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
  SelectProps,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  EditOutlined,
  HighlightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ClassroomType, ScheduleType } from "./Classrooms";
import { useSelectData } from "@/hook/useSelectData";

export interface ClassroomModalRef {
  open: (item?: ClassroomType) => void;
  close: () => void;
}

function initData(): ClassroomType {
  return {
    id: null,
    name: "",
    scheduleList: [],
  };
}

function initNumData(): SelectProps["options"] {
  return [
    { label: "第一节", value: 1 },
    { label: "第二节", value: 2 },
    { label: "第三节", value: 3 },
    { label: "第四节", value: 4 },
    { label: "第五节", value: 5 },
    { label: "第六节", value: 6 },
    { label: "第七节", value: 7 },
    { label: "第八节", value: 8 },
    { label: "第九节", value: 9 },
    { label: "第十节", value: 10 },
    { label: "第十一节", value: 11 },
    { label: "第十二节", value: 12 },
    { label: "第十三节", value: 13 },
  ];
}

const options = [
  { label: "课程", value: "COURSE" },
  { label: "考试", value: "EXAM" },
];

const fieldNames = { label: "name", value: "id" };

/**
 * 新增和修改学期组件
 */
export const ClassroomModal = forwardRef<
  ClassroomModalRef,
  { onSubmit?: () => void }
>(({ onSubmit }, ref) => {
  const [data, setData] = useState<ClassroomType>(initData);
  const beginNumOptions = initNumData()!;
  const [numOption, setNumOption] = useState<SelectProps["options"]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const courseList = useSelectData("courseList");
  const [messageApi, contextHolder] = message.useMessage();

  // 修改状态
  const { scheduleList } = data;
  scheduleList?.forEach((item) => {
    const initialIndex = item.courseBegin! - 1;
    for (let i = 0; i < item.num!; i++) {
      beginNumOptions[initialIndex + i].disabled = true;
    }
  });

  // 暴露ref接口控制组件
  useImperativeHandle(
    ref,
    () => {
      return {
        open(item?: ClassroomType) {
          if (item) {
            const { scheduleList = [], ...other } = item;

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
    form.setFieldsValue(item);
  };

  const handleDeleteItem = (index: number) => {
    const { scheduleList = [], ...other } = data;
    setData({
      ...other,
      scheduleList: scheduleList.filter((_, i) => i !== index),
    });
  };

  const handleFormFinish: FormProps<ScheduleType>["onFinish"] = ({
    ...item
  }) => {
    const { scheduleList = [], ...other } = data;
    item.courseName = courseList.find((it) => it.id === item.courseId).name;
    item.whenDay = dayjs().format("YYYY-MM-DD");
    setData({
      ...other,
      scheduleList: [...scheduleList, item],
    });
    form.resetFields();
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

  const handleSave = () => {
    console.log("data", data);
    fetch("/api/scheduling", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

  return (
    <Modal
      centered
      onCancel={handleCancel}
      title={data.name + "教室排期"}
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
            renderItem={(item, index) => {
              // 格式化显示样式
              let format = "";
              if (item.type === "COURSE") {
                format = `${item.courseName}(${item.courseBegin}-${
                  item.courseBegin! + item.num! - 1
                })`;
              } else {
                format = `课程`;
              }
              return (
                <List.Item style={{ padding: "10px 12px" }}>
                  <div className="flex justify-between w-full">
                    <span>{format}</span>
                    <div>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditItem(item)}></Button>

                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteItem(index)}></Button>
                    </div>
                  </div>
                </List.Item>
              );
            }}
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
            initialValues={{ type: "COURSE" }}
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
                getFieldValue("type") === "COURSE" ? (
                  <>
                    <Form.Item
                      name="courseId"
                      label="课程"
                      rules={[{ required: true }]}>
                      <Select
                        options={courseList}
                        fieldNames={fieldNames}
                        placeholder="请选择"
                      />
                    </Form.Item>
                    <Form.Item
                      name="courseBegin"
                      label="开始"
                      rules={[{ required: true }]}>
                      <Select
                        options={beginNumOptions}
                        onChange={(value) => {
                          const newNumOptions: SelectProps["options"] = [];
                          for (
                            let i = value - 1;
                            i < beginNumOptions!.length;
                            i++
                          ) {
                            if (beginNumOptions?.[i].disabled) {
                              break;
                            }
                            newNumOptions.push({
                              label: i - value + 2,
                              value: i - value + 2,
                            });
                          }
                          setNumOption(newNumOptions);
                          // 清空节数
                          form.setFieldValue("num", null);
                        }}
                        placeholder="请选择"
                      />
                    </Form.Item>
                    <Form.Item
                      name="num"
                      label="节数"
                      rules={[{ required: true }]}>
                      <Select options={numOption} placeholder="请选择" />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      name="examId"
                      label="考试"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="examBegin"
                      label="开始"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="teacherIds"
                      label="监考老师"
                      rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="studentIds"
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
                  添加
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
        <Button type="text" icon={<HighlightOutlined />} onClick={handleSave}>
          保存
        </Button>
      </div>
    </Modal>
  );
});
