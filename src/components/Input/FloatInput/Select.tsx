import Input from "..";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Input.Select> {
  label: string;
}

export default function Select(props: Props) {
  return (
    <div style={{ position: "relative" }}>
      <Input.Select
        placeholder={props.placeholder}
        style={{ borderRadius: "6px", height: "56px" }}
        {...props}
      />
      <label
        style={{
          fontWeight: "normal",
          position: "absolute",
          pointerEvents: "none",
          left: "8px",
          top: "-10px",
          transition: "0.2s ease all",
          background: "white",
          paddingRight: "5px",
          paddingLeft: "5px",
        }}
      >
        {props.label}
      </label>
    </div>
  );
}
