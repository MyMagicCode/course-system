import { Button, Flex, Tag, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ClassroomModal, ClassroomModalRef } from "./ClassroomModal";
import { useRef } from "react";

const { Text } = Typography;

const dataList: ClassroomType[] = [
  {
    id: "1",
    location: "A栋5015",
    scheduleList: [
      { label: "课程设计", begin: "1", end: "3" },
      { label: "计算机组成原理", begin: "4", end: "5" },
      { label: "Java程序设计", begin: "6", end: "7" },
      { label: "大学体育", begin: "8", end: "9" },
      { label: "大学英语", begin: "10", end: "11" },
      { label: "实时政治", begin: "12", end: "12" },
      { label: "Java程序设计期末考试", begin: "10:30", end: "12:30" },
    ],
  },
  {
    id: "2",
    location: "A栋5013",
    scheduleList: [
      { label: "课程设计", begin: "1", end: "2" },
      { label: "计算机组成原理", begin: "3", end: "5" },
      { label: "Java程序设计", begin: "6", end: "7" },
      { label: "大学体育", begin: "8", end: "10" },
    ],
  },
];

export default function Classrooms() {
  const ClassroomRef = useRef<ClassroomModalRef>(null);

  const handleEdit = (item: ClassroomType) => {
    ClassroomRef.current?.open(item);
  };

  return (
    <>
      <Flex rootClassName="mt-5" wrap="wrap" gap="middle">
        {dataList.map((item) => {
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

export interface ScheduleType {
  label: string;
  begin: string;
  end: string;
}

export interface ClassroomType {
  id: string;
  location: string;
  scheduleList: ScheduleType[];
}

interface ClassroomProps {
  value: ClassroomType;
  onEdit: (item: ClassroomType) => void;
}

function Classroom({ value, onEdit }: ClassroomProps) {
  const { location, scheduleList } = value;
  return (
    <div className="w-[200px] h-[260px] p-4 rounded-xl bg-white shadow-md">
      <Text>{location}</Text>
      <Flex
        gap="4px 0"
        className="h-[180px] overflow-y-scroll scroll-m-6 custom-scrollbar content-start"
        wrap="wrap"
        align="flex-start">
        {scheduleList.map(({ begin, end, label }, index) => {
          const format = `${begin}-${end} ${label}`;
          const color = colors[index];
          return (
            <Tag key={"t" + begin + end} color={color}>
              {format}
            </Tag>
          );
        })}
      </Flex>
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
