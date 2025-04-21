import { Select } from "antd";
import { ComponentProps } from "react";

export default function SelectInput(props: ComponentProps<typeof Select>) {
  return <Select {...props} />;
}
