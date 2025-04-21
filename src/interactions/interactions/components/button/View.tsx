// @ts-nocheck
import { useEffect, useRef } from "react";
import { InteractionView } from "../../types/interactionView";

interface Payload {
  text: string;
  url: string;
  background: string;
  color: string;
  size: { key: "small" | "medium" | "large"; payload: { scale: number } };
}

function View({
  payload,
  className,
  onClick,
  ...props
}: InteractionView<Payload>) {
  /**
   * Description of textRef existence
   * I'm storing textContent in this ref and I submit this content to form
   *    whenever element is blur or component is going to be unmounted.
   * Why? if I submit text in onInput, the input will lose focus.
   */
  const textRef = useRef<string>("");

  const submitText = () => {
    if (!props.isUserView) {
      props.setPayload("text", textRef.current);
    }
  };
  useEffect(() => {
    return submitText;
  }, []);

  return (
    <a
      onClick={onClick?.bind(null, payload)}
      target="_blank"
      style={{
        display: "inline-block",
        cursor: "pointer",
        whiteSpace: "nowrap",
        background: payload.background,
        color: payload.color || "white",
        padding: "12px 16px",
        borderRadius: 8,
        fontSize: 20,
        fontWeight: 500,
        transform: `scale(${payload.size.payload.scale})`,
      }}
      className={className}
      href={props.isUserView ? payload.url : undefined}
      contentEditable={!props.isUserView && !props.isDesktop && props.isActive}
      onBlur={submitText}
      onInput={(e) => {
        const { textContent } = e.currentTarget;
        if (!props.isUserView && textContent) {
          textRef.current = textContent;
        }
      }}
    >
      {payload.text}
    </a>
  );
}

export { View };
