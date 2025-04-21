import { Input } from "antd";
import { ComponentProps } from "react";

export default function Password(props: ComponentProps<typeof Input.Password>) {
  return <Input.Password {...props} />;
}
