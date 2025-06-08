import React from "react";
import { useEffect, useRef } from "react";
import { InteractionView } from "../../types/interactionView";

interface Payload {
  text: string;
  size: number;
  background: string;
  color: string;
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
      props.setPayload?.("text", textRef.current);
    }
  };
  useEffect(() => {
    return submitText;
  }, []);

  return (
    <div
      onClick={onClick?.bind(null, payload)}
      style={{
        whiteSpace: "pre-wrap",
        fontSize: payload.size,
        background: payload.background,
        color: payload.color,
        padding: 8,
        borderRadius: 8,
        fontWeight: 400,
        overflow: "hidden",
        outline: "none",
      }}
      className={className}
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
    </div>
  );
}

export { View };
