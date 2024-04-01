interface BarProps {
  params: {
    bar: string;
  };
}

export default function Bar({ params }: BarProps) {
  return <h1>{params.bar}</h1>;
}
