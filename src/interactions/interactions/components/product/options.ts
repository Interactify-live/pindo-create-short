export interface Payload {
  style: "simple" | "detailed";
  products: { price?: string; title: string; image: string; url: string }[];
}
