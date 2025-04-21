import { CSSProperties, ComponentProps } from "react";
import Input from "..";

interface Props extends ComponentProps<typeof Input.Text> {
  label: string;
  labelStyle?: CSSProperties;
  rtl?: boolean;
}

export default function Text({ label, labelStyle, rtl, ...props }: Props) {
  return (
    <>
      <Input.Text
        style={{
          borderRadius: "6px",
          height: "56px",
          direction: rtl ? "rtl" : "ltr",
        }}
        {...props}
      />
      {rtl ? (
        <label
          style={{
            fontWeight: "normal",
            direction: "rtl",
            position: "absolute",
            pointerEvents: "none",
            right: "8px",
            top: "-10px",
            transition: "0.2s ease all",
            background: "white",
            paddingRight: "5px",
            paddingLeft: "5px",
            zIndex: 99,
            ...(labelStyle || {}),
          }}
        >
          {label}
        </label>
      ) : (
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
            zIndex: 99,
            ...(labelStyle || {}),
          }}
        >
          {label}
        </label>
      )}
    </>
  );
}
