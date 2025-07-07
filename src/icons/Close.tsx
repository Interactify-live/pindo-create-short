interface CloseProps {
  width?: string;
  height?: string;
  stroke?: string;
  strokeWidth?: string;
}

export default function Close({
  width = "14",
  height = "14",
  stroke = "white",
  strokeWidth = "2"
}: CloseProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 1L1 13M1 1L13 13"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}