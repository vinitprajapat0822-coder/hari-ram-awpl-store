import { catalogueCategoryFilters } from "./catalogue";

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

export const products: Product[] = [
  // See local file for full 188 products - Wellness, Wellroot, Baby Care, Food, Home Care, SNISS Herbal, SNISS Elite, Spices, Other
  { id: "immuno-doc", name: "ImmunoDoc Ras", nameHi: "इम्यूनोडॉक रस", category: "Wellness", description: "Boosts immunity, fever, weakness, cough, cold, allergy, TB, asthma, piles", mrp: 2073, dp: 1789, sp: 12, qty: "1000 ML" },
  { id: "stone-doc", name: "StoneDoc Ras", nameHi: "स्टोनडॉक रस", category: "Wellness", description: "Kidney stones, kidney health, free flow", mrp: 2507, dp: 2163, sp: 14, qty: "1000 ML" },
  { id: "livo-doc", name: "LivoDoc Ras", nameHi: "लिवोडॉक रस", category: "Wellness", description: "Digestion, weakness, liver swelling, all liver diseases", mrp: 1494, dp: 1289, sp: 8, qty: "500 ML" },
  { id: "ortho-doc", name: "OrthoDoc Ras", nameHi: "ऑर्थोडॉक रस", category: "Wellness", description: "Joint pain, arthritis, back pain, ligament & lubrication", mrp: 2250, dp: 1941, sp: 13, qty: "1000 ML" },
  { id: "cardio-doc", name: "CardioDoc Ras", nameHi: "कार्डियोडॉक रस", category: "Wellness", description: "Heart beat, BP, cholesterol, blockage, heart problems", mrp: 2253, dp: 1945, sp: 13, qty: "1000 ML" },
  { id: "diabo-doc", name: "DiaboDoc Ras", nameHi: "डायबोडॉक रस", category: "Wellness", description: "Blood sugar control, insulin, weakness, diabetes", mrp: 1460, dp: 1259, sp: 8, qty: "1000 ML" },
  { id: "aloe-vera-ras", name: "Ex Aloe Vera Ras", nameHi: "एक्स एलोवेरा रस", category: "Wellness", description: "Full body service – digestion, skin, TB, sinus, weakness, joint pain, allergy, detox", mrp: 949, dp: 819, sp: 5, qty: "1000 ML" },
  { id: "shilajit-60", name: "Shilajit Extract Capsule", nameHi: "शिलाजीत एक्सट्रैक्ट कैप्सूल", category: "Wellroot", description: "Male/female reproductive, sex drive, aging support", mrp: 1785, dp: 1422, sp: 8, qty: "60 CAP" },
  { id: "spirulina", name: "SpiraDoc Capsule", nameHi: "स्पाइराडॉक कैप्सूल", category: "Wellroot", description: "Spirulina – vitamins, amino acids, chlorophyll, calcium, protein", mrp: 1289, dp: 991, sp: 6, qty: "60 TAB" },
  { id: "ashwagandha", name: "Ex Ashwagandha Tablet", nameHi: "एक्स अश्वगंधा टैबलेट", category: "Wellroot", description: "Sugar, stress, fat, male sperm, body sculpt, memory", mrp: 1311, dp: 937, sp: 5, qty: "60 TAB" },
  { id: "testofast", name: "TestoFast Capsule", nameHi: "टेस्टोफास्ट कैप्सूल", category: "Wellroot", description: "Testosterone, sex drive, strength, stamina", mrp: 2727, dp: 1948, sp: 12, qty: "60 TAB" },
  { id: "kids-protein", name: "Kids Protein", nameHi: "किड्स प्रोटीन", category: "Baby Care", description: "Physical, mental, intellectual development + muscles", mrp: 1618, dp: 1156, sp: 1, qty: "200 GM" },
];

export const categories = [...catalogueCategoryFilters];
