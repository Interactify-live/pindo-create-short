import styles from "./styles.module.scss";
import classnames from "classnames";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Payload } from "../../options";
import { Button } from "antd";

interface Props {
  className?: string;
  product: Payload["products"][number];
  onDeleteClick: VoidFunction;
  onEditClick: VoidFunction;
}

function ProductCard({
  className,
  product,
  onDeleteClick,
  onEditClick,
}: Props) {
  return (
    <div
      className={classnames(
        className,
        "border-1 border-neutral-20 p-2 rounded-2 d-flex",
      )}
    >
      <img
        className={classnames(styles.image, "rounded-1 mr-3")}
        src={product.image}
        title={product.title}
      />
      <div className="d-flex flex-col jc-between">
        <span className="tg-body-md color-neutral-90 ellipsis-2">
          {product.title}
        </span>
        <div>
          <Button
            onClick={onEditClick}
            className="border-none"
            size="small"
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button
            onClick={onDeleteClick}
            size="small"
            ghost
            className="border-none"
            type="primary"
            icon={<DeleteOutlined />}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ProductCard };
