export type Product = {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  description: string;
  mrp: number;
  dp: number;
  sp: number;
  qty: string;
  image?: string;
};

const labelReference =
  "Refer to the verified product label for ingredients, intended use, directions and warnings.";

export const products: Product[] = [
  // This is the current committed starter catalogue. Add the remaining products
  // only from the exact, owner-supplied product list and verified pack labels.
  { id: "immuno-doc", name: "ImmunoDoc Ras", nameHi: "इम्यूनोडॉक रस", category: "Wellness", description: labelReference, mrp: 2073, dp: 1789, sp: 12, qty: "1000 ML" },
  { id: "stone-doc", name: "StoneDoc Ras", nameHi: "स्टोनडॉक रस", category: "Wellness", description: labelReference, mrp: 2507, dp: 2163, sp: 14, qty: "1000 ML" },
  { id: "livo-doc", name: "LivoDoc Ras", nameHi: "लिवोडॉक रस", category: "Wellness", description: labelReference, mrp: 1494, dp: 1289, sp: 8, qty: "500 ML" },
  { id: "ortho-doc", name: "OrthoDoc Ras", nameHi: "ऑर्थोडॉक रस", category: "Wellness", description: labelReference, mrp: 2250, dp: 1941, sp: 13, qty: "1000 ML" },
  { id: "cardio-doc", name: "CardioDoc Ras", nameHi: "कार्डियोडॉक रस", category: "Wellness", description: labelReference, mrp: 2253, dp: 1945, sp: 13, qty: "1000 ML" },
  { id: "diabo-doc", name: "DiaboDoc Ras", nameHi: "डायबोडॉक रस", category: "Wellness", description: labelReference, mrp: 1460, dp: 1259, sp: 8, qty: "1000 ML" },
  { id: "aloe-vera-ras", name: "Ex Aloe Vera Ras", nameHi: "एक्स एलोवेरा रस", category: "Wellness", description: labelReference, mrp: 949, dp: 819, sp: 5, qty: "1000 ML" },
  { id: "shilajit-60", name: "Shilajit Extract Capsule", nameHi: "शिलाजीत एक्सट्रैक्ट कैप्सूल", category: "Wellroot", description: labelReference, mrp: 1785, dp: 1422, sp: 8, qty: "60 CAP" },
  { id: "spirulina", name: "SpiraDoc Capsule", nameHi: "स्पाइराडॉक कैप्सूल", category: "Wellroot", description: labelReference, mrp: 1289, dp: 991, sp: 6, qty: "60 TAB" },
  { id: "ashwagandha", name: "Ex Ashwagandha Tablet", nameHi: "एक्स अश्वगंधा टैबलेट", category: "Wellroot", description: labelReference, mrp: 1311, dp: 937, sp: 5, qty: "60 TAB" },
  { id: "testofast", name: "TestoFast Capsule", nameHi: "टेस्टोफास्ट कैप्सूल", category: "Wellroot", description: labelReference, mrp: 2727, dp: 1948, sp: 12, qty: "60 TAB" },
  { id: "kids-protein", name: "Kids Protein", nameHi: "किड्स प्रोटीन", category: "Baby Care", description: labelReference, mrp: 1618, dp: 1156, sp: 1, qty: "200 GM" },
];

export const categories = [
  "All",
  "Wellness",
  "Wellroot",
  "Baby Care",
  "Food",
  "Home Care",
  "SNISS Herbal",
  "SNISS Elite",
  "Spices",
  "Other",
];
