interface CameraProps {
  width?: string;
  height?: string;
  stroke?: string;
  strokeWidth?: string;
}

export default function Camera({
  width = "40",
  height = "40",
  stroke = "rgba(141, 143, 144, 1)",
  strokeWidth = "1"
}: CameraProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "scaleX(-1)" }}
    >
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="19.5"
        stroke={stroke}
      />
      <path
        d="M18.5 11C16.567 11 15 12.567 15 14.5V16H17V14.5C17 13.6716 17.6716 13 18.5 13H22.5C23.3284 13 24 13.6716 24 14.5V16.5388C24 16.8425 23.8619 17.1298 23.6247 17.3196L19.7506 20.4189C19.2762 20.7984 19 21.3731 19 21.9806V25H21V21.9806L24.8741 18.8814C25.5857 18.312 26 17.4501 26 16.5388V14.5C26 12.567 24.433 11 22.5 11H18.5Z"
        fill={stroke}
      />
      <path d="M21 27H19V29H21V27Z" fill={stroke} />
    </svg>
  );
}