import { Input } from "antd";
import { ComponentProps } from "react";

type Props = {
  label: string;
} & ComponentProps<typeof Input.TextArea>;

export default function TextArea(props: Props) {
  return (
    <>
      <Input.TextArea
        style={{ borderRadius: "6px", resize: "none" }}
        rows={4}
        maxLength={100}
        {...props}
      />
      <label
        style={{
          fontWeight: "normal",
          position: "absolute",
          pointerEvents: "none",
          left: "8px",
          top: "-13px",
          transition: "0.2s ease all",
          background: "white",
          paddingRight: "5px",
          paddingLeft: "5px",
        }}
      >
        {props.label}
      </label>
    </>
  );
}
