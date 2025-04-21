import { ComponentProps } from "react";
import { Form } from "antd";
import classnames from "classnames";
import FloatInput from "../../../components/Input/FloatInput";
import styles from "./styles.module.scss";

function URLInput(
  props: Pick<ComponentProps<typeof FloatInput.Text>, "onChange" | "value">,
) {
  return (
    <div className={classnames("p-4 bg-neutral-90 w-full", styles.container)}>
      <Form.Item style={{ margin: 0 }}>
        <FloatInput.Text
          className={classnames("bg-neutral-90 color-white", styles.input)}
          labelStyle={{
            background: "var(--color-neutral-90)",
            color: "var(--color-neutral-10)",
          }}
          label="URL"
          placeholder="Type or paste url"
          {...props}
        />
      </Form.Item>
    </div>
  );
}

export { URLInput };
