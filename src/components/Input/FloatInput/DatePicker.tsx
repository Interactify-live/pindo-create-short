import { ComponentProps } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

type Props = ComponentProps<typeof DatePicker> & {
  label: string;
};

export default function FloatDatePicker({ label, ...props }: Props) {
  return (
    <>
      <DatePicker
        // @ts-ignore
        showTime
        style={{ height: "52px", borderRadius: "6px", width: "100%" }}
        defaultValue={dayjs()}
        {...(props || {})}
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
        {label}
      </label>
    </>
  );
}
