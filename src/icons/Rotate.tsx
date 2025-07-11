interface RotateProps {
  width?: string;
  height?: string;
  stroke?: string;
  strokeWidth?: string;
}

export default function Rotate({
  width = "24",
  height = "24",
  stroke = "white",
  strokeWidth = "1.5"
}: RotateProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 12.5C22 18.02 17.52 22.5 12 22.5C6.48 22.5 3.11 16.94 3.11 16.94M3.11 16.94H7.63M3.11 16.94V21.94M2 12.5C2 6.98 6.44 2.5 12 2.5C18.67 2.5 22 8.06 22 8.06M22 8.06V3.06M22 8.06H17.56"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}