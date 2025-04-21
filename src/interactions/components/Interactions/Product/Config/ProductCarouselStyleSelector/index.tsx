import { Payload } from "../../options";
import { Button } from "../../../../../../components/Button";

const PRODUCT_STYLES = [
  { key: "simple", title: "Simple" },
  { key: "detailed", title: "Detailed" },
] as const;

interface Props {
  setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
  payload: Payload;
}

function ProductCarouselStyleSelector({ payload, setPayload }: Props) {
  const computeColor = (isActive: boolean) => {
    return isActive ? "black" : "white";
  };
  const computeBgColor = (isActive: boolean) => {
    return isActive ? "white" : "black-40p";
  };
  return (
    <>
      {PRODUCT_STYLES.map((button) => {
        const isActive = button.key === payload.style;
        return (
          <Button
            className="mr-2"
            shape={"outline"}
            color={computeColor(isActive)}
            bgColor={computeBgColor(isActive)}
            size={"sm"}
            borderColor={!isActive && "neutral-30"}
            onClick={() => {
              setPayload("style", button.key);
            }}
          >
            {button.title}
          </Button>
        );
      })}
    </>
  );
}

export { ProductCarouselStyleSelector };
