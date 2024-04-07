import { Button, Flex, Tag, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ClassroomModal, ClassroomModalRef } from "./ClassroomModal";
import { useRef } from "react";

const { Text } = Typography;

interface ClassroomsProps {
  list: ClassroomType[];
}

export default function Classrooms({ list }: ClassroomsProps) {
  const ClassroomRef = useRef<ClassroomModalRef>(null);

  const handleEdit = (item: ClassroomType) => {
    ClassroomRef.current?.open(item);
  };

  return (
    <>
      <Flex rootClassName="mt-5" wrap="wrap" gap="middle">
        {list.map((item) => {
          return (
            <Classroom
              key={item.id}
              onEdit={handleEdit}
              value={item}></Classroom>
          );
        })}
      </Flex>
      <ClassroomModal ref={ClassroomRef}></ClassroomModal>
    </>
  );
}

// 排期的类型
export interface ScheduleType {
  examId?: number;
  courseId?: number;
  courseName?: string;
  type: string;
  courseBegin?: number;
  whenDay: string;
  num?: number;
  examBegin?: string;
  examEnd?: string;
}

export interface ClassroomType {
  id: null;
  name: string;
  scheduleList?: ScheduleType[];
}

interface ClassroomProps {
  value: ClassroomType;
  onEdit: (item: ClassroomType) => void;
}

function Classroom({ value, onEdit }: ClassroomProps) {
  const { name, scheduleList } = value;
  return (
    <div className="w-[360px] h-[200px] p-4 rounded-xl bg-white shadow-md">
      <Text>{name}</Text>
      <div className="h-[120px]">
        <Flex
          gap="4px 0"
          className="h-[120px] overflow-y-scroll scroll-m-6 custom-scrollbar content-start"
          wrap="wrap"
          align="flex-start">
          {scheduleList?.map((item, index) => {
            const format = "${begin}-${end} ${label}";
            const color = colors[index];
            return (
              <Tag key={"t" + item.type + index} color={color}>
                {format}
              </Tag>
            );
          })}
        </Flex>
      </div>
      <div className="text-center">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(value)}></Button>
      </div>
    </div>
  );
}

const colors = [
  "magenta",
  "red",
  "geekblue",
  "purple",
  "gold",
  "lime",
  "green",
  "volcano",
  "orange",
  "cyan",
];
