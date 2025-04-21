import { ComponentProps } from "react";
import { Select } from "antd";

function SelectInput(props: ComponentProps<typeof Select>) {
  return <Select {...props} />;
}

export default SelectInput;
