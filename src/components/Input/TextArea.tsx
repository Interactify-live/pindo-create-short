import { Input } from "antd";
import { ComponentProps } from "react";

export default function TextArea(props: ComponentProps<typeof Input.TextArea>) {
  return <Input.TextArea {...props} />;
}
