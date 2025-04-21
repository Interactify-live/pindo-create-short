import { ComponentProps } from "react";
import { Button as BaseButton } from "./BaseButton";

interface Props extends ComponentProps<typeof BaseButton> {
  href?: string;
}

function Button({ href, ...props }: Props) {
  return <BaseButton {...props} />;
}

export { Button };
