import type { ProductMasterRecord } from "./catalogue";
import { awplProductsChunk0 } from "./awpl-products-chunk0";
import { awplProductsChunk1 } from "./awpl-products-chunk1";
import { awplProductsChunk2 } from "./awpl-products-chunk2";
import { awplWellnessWellrootProducts } from "./awpl-products-wellness-wellroot";

export const awplProducts: ProductMasterRecord[] = [
  ...awplProductsChunk0,
  ...awplProductsChunk1,
  ...awplProductsChunk2,
  ...awplWellnessWellrootProducts,
];
