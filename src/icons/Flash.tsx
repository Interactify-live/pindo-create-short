interface FlashProps {
  isFlashOn?: boolean;
  width?: string;
  height?: string;
  fill?: string;
}

export default function Flash({
  isFlashOn = false,
  width = "24px",
  height = "24px",
  fill = "white"
}: FlashProps) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
    >
      <path
        d="M16.118 2.5H9.10037L8.7689 3.95846L9.74404 4.18008L9.8986 3.5H14.881L13.381 10.5H17.5534L16.1288 12.5894L16.9551 13.1527L19.4456 9.5H14.618L16.118 2.5Z"
        fill={fill}
      />
      {!isFlashOn && (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.7093 16.4463L11.4125 21.2817L10.5044 20.9293L11.4229 14.5H6.37301L7.97222 7.46349L5.59961 4.30001L6.39961 3.70001L18.3996 19.7L17.5996 20.3L14.7093 16.4463ZM8.75923 8.51284L7.62578 13.5H12.4996L8.75923 8.51284ZM12.5637 13.5855L11.7988 18.9401L14.0754 15.601L12.5637 13.5855Z"
          fill={fill}
        />
      )}
    </svg>
  );
}