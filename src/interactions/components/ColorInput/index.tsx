import { useState } from "react";
import { StopOutlined } from "@ant-design/icons";
import { ColorPicker } from "antd";
import classnames from "classnames";
import { GColorRGBA } from "../../../shared/color";
import styles from "./styles.module.scss";
import { hexToRGB } from "../../../shared/utils";

const COLORS = ["#FF4016", "#3AC592", "#FF9900", "#EA2088"] as const;
const TRANSPARENT_COLOR = "transparent";

interface Props {
  value: string;
  onChange: (hex: string, rgba?: GColorRGBA) => void;
  className?: string;
  noTransparentColor?: boolean;
}

function ColorInput({ className, onChange, value, noTransparentColor }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={classnames("d-flex ai-center", className)}>
      {!noTransparentColor && (
        <StopOutlined
          style={{ fontSize: 19 }}
          className={classnames(
            "mr-4 cursor-pointer",
            value === TRANSPARENT_COLOR ? "color-white" : "color-neutral-20",
          )}
          onClick={() => onChange(TRANSPARENT_COLOR)}
        />
      )}
      {COLORS.map((color, index) => (
        <span
          className={classnames(
            styles.item,
            "rounded-circle d-inline-block mr-4 cursor-pointer",
            {
              "border-2 border-white": value === color,
            },
          )}
          onClick={() => {
            const { r, g, b } = hexToRGB(color);
            onChange(color, { r, g, b, a: 1 });
          }}
          style={{ background: color }}
        ></span>
      ))}
      <label
        className={classnames(
          styles.custom,
          "bg-neutral-90 d-flex ai-center p-1 rounded-4 cursor-pointer pos-relative",
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <ColorPicker
          open={isOpen}
          onChange={(color, hex) => {
            // @ts-ignore
            onChange(hex, color.toRgb());
          }}
          placement="top"
          onOpenChange={setIsOpen}
          className="visibility-hidden pos-absolute left-0"
        />
        <span className="border-1 border-white rounded-circle d-inline-block p-2" />
        <span className="tg-body-md color-neutral-10 ml-2 d-block">Custom</span>
      </label>
    </div>
  );
}

export { ColorInput };
