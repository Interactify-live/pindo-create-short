interface WarningProps {
  width?: string;
  height?: string;
  fill?: string;
}

export default function Warning({
  width = "18",
  height = "26",
  fill = "#E03240"
}: WarningProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5.5C13.1421 5.5 16.5 8.85786 16.5 13C16.5 17.1421 13.1421 20.5 9 20.5C4.85786 20.5 1.5 17.1421 1.5 13C1.5 8.85786 4.85786 5.5 9 5.5ZM7.5 11.5V13H8.25V16.75H9.75V11.5H7.5ZM9 9.25C8.58579 9.25 8.25 9.58579 8.25 10C8.25 10.4142 8.58579 10.75 9 10.75C9.41421 10.75 9.75 10.4142 9.75 10C9.75 9.58579 9.41421 9.25 9 9.25Z"
        fill={fill}
      />
    </svg>
  );
}