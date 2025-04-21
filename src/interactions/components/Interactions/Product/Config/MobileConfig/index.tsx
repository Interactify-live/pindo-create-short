import { MouseEventHandler } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Payload } from "../../options";
import { Button } from "../../../../../../components/Button";
import { ProductCarouselStyleSelector } from "../ProductCarouselStyleSelector";

interface Props {
  setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
  payload: Payload;
  onAddProductClick: MouseEventHandler;
}
function MobileConfig({ payload, setPayload, onAddProductClick }: Props) {
  return (
    <div className="pos-absolute bottom-0 left-0 w-full z-10 d-flex ai-center jc-between p-4">
      <div>
        <div className="tg-label-md color-white mb-2">Product Cards Style</div>
        <div>
          <ProductCarouselStyleSelector
            payload={payload}
            setPayload={setPayload}
          />
        </div>
      </div>
      <Button
        size="lg"
        shape="fill"
        bgColor="primary-50"
        color="white"
        onClick={onAddProductClick}
      >
        <PlusOutlined />
      </Button>
    </div>
  );
}

export { MobileConfig };
