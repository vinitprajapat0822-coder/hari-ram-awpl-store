import StaticInfoPage from "@/components/StaticInfoPage";

export const metadata = {
  title: "Product Information | Hari Ram AWPL Store",
  description: "Important information about listed product details, MRP, images and availability.",
};

export default function ProductDisclaimerPage() {
  return <StaticInfoPage kind="product" />;
}
