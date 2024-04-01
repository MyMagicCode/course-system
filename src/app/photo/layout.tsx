import { PropsWithChildren, ReactNode } from "react";

interface PhotoProps extends PropsWithChildren {
  modal: ReactNode;
}

export default function PhotoLayout({ children, modal }: PhotoProps) {
  console.log(" PhotoLayout");
  return (
    <div>
      {modal}
      {children}
    </div>
  );
}
