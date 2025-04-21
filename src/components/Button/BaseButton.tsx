// @ts-nocheck
import { CSSProperties, ComponentProps, ReactNode } from "react";
import { Button as BaseButton } from "antd";
import classnames from "classnames";
import { COLORS } from "../../shared/colors";
import { hexToRGB } from "../../shared/utils";
import styles from "./styles.module.scss";

interface Props
  extends Partial<
    Pick<
      ComponentProps<typeof BaseButton>,
      "onClick" | "loading" | "disabled" | "id" | "htmlType"
    >
  > {
  size?: "sm" | "md" | "lg";
  shape?: "fill" | "outline" | "ghost";
  children?: ReactNode;
  color?: string;
  bgColor?: string | false;
  borderColor?: string | false;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  appendIcon?: ReactNode;
  icon?: ReactNode;
  height?: number;
  noHover?: boolean;
  padding?: CSSProperties["padding"];
}

const MAP_SHAPE_TO_ANT_TYPE = {
  fill: "primary",
  ghost: "text",
} as const;

const MAP_SIZE_TO_PADDING = {
  sm: ["0", "8px"],
  md: ["0", "16px"],
  lg: ["0", "16px"],
} as const;

function colorNameToRGBA(name: string, opacity: number) {
  try {
    const [variant, shadeNumber] = name.split("-");
    let color = COLORS[variant];
    if (shadeNumber) {
      color = color[shadeNumber];
    }
    const rgb = hexToRGB(color);

    return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
  } catch (e) {
    return name;
  }
}

function Button({
  size = "md",
  children,
  color = "primary-50",
  shape = "fill",
  width = "auto",
  style,
  appendIcon,
  icon,
  className,
  bgColor,
  borderColor,
  height,
  noHover,
  padding,
  ...props
}: Props) {
  const colorCSSVar = `var(--color-${color})`;
  const bgCSSVar = `var(--color-${bgColor})`;
  const borderCSSVar = `var(--color-${borderColor})`;

  const btnStyle: CSSProperties = {
    padding: children
      ? MAP_SIZE_TO_PADDING[size].join(" ")
      : MAP_SIZE_TO_PADDING[size][0],
    height: height || { sm: 28, md: 36, lg: 48 }[size],
    width,
    color: colorCSSVar,
    ...style,
  };
  if (typeof padding !== "undefined") {
    btnStyle.padding = padding;
  }
  if (shape !== "ghost" && (bgColor || color)) {
    btnStyle.boxShadow = `0 2px 0 ${colorNameToRGBA(bgColor || color, 0.1)}`;
  }
  switch (shape) {
    case "fill":
      btnStyle.background = bgColor ? bgCSSVar : colorCSSVar;
      break;

    case "outline":
      btnStyle.borderColor = borderColor ? borderCSSVar : colorCSSVar;
      btnStyle.background = "transparent";
      break;
  }

  return (
    <BaseButton
      className={classnames(`tg-button-${size}`, className, {
        [styles.noHover]: noHover,
      })}
      type={MAP_SHAPE_TO_ANT_TYPE[shape]}
      style={btnStyle}
      {...props}
    >
      {icon}
      {children}
      {appendIcon}
    </BaseButton>
  );
}

export { Button };
