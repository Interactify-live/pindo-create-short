// @ts-nocheck
import { useRef } from "react";
// import { useModalUrlState } from "@livuvo/shared/hooks/useModalUrlState";
// import { AddProductModal } from "@/components/AddProductModal";
import { Payload } from "../options";
import { MobileConfig } from "./MobileConfig";

interface Props {
  setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
  payload: Payload;
}

function Config({ setPayload, payload }: Props) {
  // const { isOpen, close, open } = useModalUrlState({ key: "add-product" });
  const currentEditingProduct = useRef<
    Partial<Payload["products"][number]> & { index: number }
  >({ index: -1 });

  return (
    <div>
      <MobileConfig
        onAddProductClick={false}
        setPayload={setPayload}
        payload={payload}
      />

      {
        // <AddProductModal
        //   initialValues={currentEditingProduct.current}
        //   onSubmit={({ product, isEdit }) => {
        //     const products = payload.products;
        //     const newProduct = {
        //       image: product.image,
        //       title: product.title,
        //       price: product.price,
        //       url: product.url,
        //     };
        //
        //     if (isEdit) {
        //       payload.products[currentEditingProduct.current.index] = newProduct;
        //     } else {
        //       payload.products.push(newProduct);
        //     }
        //     setPayload("products", products.slice());
        //
        //     currentEditingProduct.current = { index: -1 };
        //     // close();
        //   }}
        //   open={isOpen}
        //   onCancel={() => {
        //     currentEditingProduct.current = { index: -1 };
        //     // close();
        //   }}
        // />
      }
    </div>
  );
}

export { Config };
