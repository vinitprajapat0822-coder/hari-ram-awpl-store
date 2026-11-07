import type { ProductMasterRecord } from "./catalogue";

/** Official AWPL Wellness products - MRP from asclepiuswellness.com (2026-11-06) */

type ImportedCatalogueSeed = {
  id: string;
  name: string;
  category: ProductMasterRecord["category"];
  mrp: number;
  packSize: string;
  imageUrl?: string;
  imageStatus?: ProductMasterRecord["image"]["status"];
  sourceUrl?: string;
  description: string;
  priceStatus?: ProductMasterRecord["status"];
  reviewNote?: string;
};

const sourceByCategory: Record<ImportedCatalogueSeed["category"], string> = {
  agriculture: "https://www.asclepiuswellness.com/product/agriculture/",
  apparels: "https://www.asclepiuswellness.com/product/apparels/",
  "baby-care": "https://www.asclepiuswellness.com/product/baby-care/",
  food: "https://www.asclepiuswellness.com/product/food/",
  "home-care": "https://www.asclepiuswellness.com/product/home-care/",
  jeeveda: "https://www.asclepiuswellness.com/product/jeeveda/",
  "oral-care": "https://www.asclepiuswellness.com/product/oral-care/",
  others: "https://www.asclepiuswellness.com/product/others/",
  "sniss-cosmetic": "https://www.asclepiuswellness.com/product/sniss-cosmetic/",
  "sniss-elite": "https://www.asclepiuswellness.com/product/sniss-elite/",
  "sniss-fragrances": "https://www.asclepiuswellness.com/product/sniss-fragrances/",
  "sniss-herbal": "https://www.asclepiuswellness.com/product/sniss-herbal/",
  veterinary: "https://www.asclepiuswellness.com/product/veterinary/",
  wellness: "https://www.asclepiuswellness.com/product/wellness/",
  wellroot: "https://www.asclepiuswellness.com/product/wellroot/"
};

const importedCatalogueSeeds: ImportedCatalogueSeed[] = [
  // Jeeveda — spices, seasonings and packaged cooking ingredients.
  { id: "awpl-jeeveda-rice-bran-oil-2l", name: "JEEVEDA RICE BRAN OIL (2 LTR)", category: "jeeveda", mrp: 699, packSize: "2 LTR", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T16122_756881.jpg", description: "Jeeveda rice bran cooking oil, 2 LTR pack. Refer to the label for ingredients, nutrition information and storage details.", priceStatus: "PRICE_REVIEW_REQUIRED", reviewNote: "Official category listing shows ₹699 MRP; retained for review because the earlier project snapshot recorded a conflicting price." },
  { id: "awpl-jeeveda-rice-bran-oil-5l", name: "JEEVEDA RICE BRAN OIL (5 LTR)", category: "jeeveda", mrp: 1743, packSize: "5 LTR", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T16222_417330.jpg", imageStatus: "VERIFIED", description: "Jeeveda rice bran cooking oil, 5 LTR pack. Refer to the label for ingredients, nutrition information and storage details." },
  { id: "awpl-jeeveda-chhole-chana-masala", name: "JEEVEDA CHHOLE CHANA MASALA", category: "jeeveda", mrp: 139, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T3241_507729.jpg", imageStatus: "VERIFIED", description: "Jeeveda seasoning blend for chhole and chana dishes, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-chicken-masala", name: "JEEVEDA CHICKEN MASALA", category: "jeeveda", mrp: 147, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T3251_493990.jpg", imageStatus: "VERIFIED", description: "Jeeveda chicken masala seasoning, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-dal-makhani-masala", name: "JEEVEDA DAL MAKHANI MASALA", category: "jeeveda", mrp: 161, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T32622_019437.jpg", description: "Jeeveda dal makhani seasoning blend, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-fish-masala", name: "JEEVEDA FISH MASALA", category: "jeeveda", mrp: 153, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T32722_297115.jpg", description: "Jeeveda fish masala seasoning, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-garam-masala", name: "JEEVEDA GARAM MASALA", category: "jeeveda", mrp: 167, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T32822_773957.jpg", imageStatus: "VERIFIED", description: "Jeeveda garam masala seasoning, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-kitchen-king-masala", name: "JEEVEDA KITCHEN KING MASALA", category: "jeeveda", mrp: 139, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T32911_651975.jpg", imageStatus: "VERIFIED", description: "Jeeveda Kitchen King seasoning blend, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-mutton-masala", name: "JEEVEDA MUTTON MASALA", category: "jeeveda", mrp: 167, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33022_323953.jpg", description: "Jeeveda mutton masala seasoning, 100 GM pack. Check the label for ingredients and allergen information.", priceStatus: "PRICE_REVIEW_REQUIRED", reviewNote: "The main AWPL category listing and another official subdomain show different MRPs; ₹167 is the main-site listing value and must be checked against the pack before ordering." },
  { id: "awpl-jeeveda-pav-bhaji-masala", name: "JEEVEDA PAV BHAJI MASALA", category: "jeeveda", mrp: 139, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33122_215996.jpg", description: "Jeeveda pav bhaji seasoning blend, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-rajma-masala", name: "JEEVEDA RAJMA MASALA", category: "jeeveda", mrp: 139, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33222_153906.jpg", description: "Jeeveda rajma seasoning blend, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-shahi-paneer-masala", name: "JEEVEDA SHAHI PANEER MASALA", category: "jeeveda", mrp: 153, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33322_928204.jpg", description: "Jeeveda shahi paneer seasoning blend, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-sambhar-masala", name: "JEEVEDA SAMBHAR MASALA", category: "jeeveda", mrp: 137, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33422_052556.jpg", description: "Jeeveda sambhar seasoning blend, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-tandoori-chicken-masala", name: "JEEVEDA TANDOORI CHICKEN MASALA", category: "jeeveda", mrp: 139, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33522_670001.jpg", description: "Jeeveda tandoori chicken seasoning, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-ajwain", name: "JEEVEDA CAROM SEEDS AJWAIN", category: "jeeveda", mrp: 83, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33722_924633.jpg", description: "Jeeveda carom seeds (ajwain), 50 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-black-pepper", name: "JEEVEDA BLACK PEPPER-KALI MIRCHI", category: "jeeveda", mrp: 139, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T3381_213430.jpg", description: "Jeeveda black pepper, 50 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-black-cardamom", name: "JEEVEDA BLACK CARDAMOM-BADI ELAIC", category: "jeeveda", mrp: 321, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T33922_325827.jpg", description: "Jeeveda black cardamom, 50 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-green-cardamom", name: "JEEVEDA GREEN CARDAMOM CHOTI ELAI", category: "jeeveda", mrp: 251, packSize: "25 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34022_836612.jpg", description: "Jeeveda green cardamom, 25 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-cumin-seeds", name: "JEEVEDA CUMIN SEEDS JEERA", category: "jeeveda", mrp: 125, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34122_520125.jpg", description: "Jeeveda cumin seeds (jeera), 100 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-nigella-seeds", name: "JEEVEDA NIGELLA SEEDS-KALONJI", category: "jeeveda", mrp: 77, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34222_877906.jpg", description: "Jeeveda nigella seeds (kalonji), 50 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-fenugreek-seeds", name: "JEEVEDA FENUGREEK SEEDS-METHI DANA", category: "jeeveda", mrp: 69, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34322_133961.jpg", description: "Jeeveda fenugreek seeds (methi dana), 100 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-mustard-seeds", name: "JEEVEDA MUSTARD SEEDS-RAI", category: "jeeveda", mrp: 55, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34422_345366.jpg", description: "Jeeveda mustard seeds (rai), 100 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-clove", name: "JEEVEDA CLOVE-LAUNG", category: "jeeveda", mrp: 167, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34522_257859.jpg", description: "Jeeveda whole cloves (laung), 50 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-cinnamon", name: "JEEVEDA CINNAMON STICKS-DALCHINI", category: "jeeveda", mrp: 111, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37822_440812.jpg", description: "Jeeveda cinnamon sticks (dalchini), 50 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-bay-leaf", name: "JEEVEDA BAY LEAF-TEJ PATTA", category: "jeeveda", mrp: 60, packSize: "25 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37922_660794.jpg", description: "Jeeveda bay leaves (tej patta), 25 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-kasoori-methi", name: "FENUGREEK LEAVES-KASOORI METHI", category: "jeeveda", mrp: 88, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T3801_205672.jpg", description: "Dried fenugreek leaves (kasoori methi), 50 GM pack. Refer to the ingredient and storage information on the label." },
  { id: "awpl-jeeveda-chilli-powder", name: "CHILLI POWDER-100 GM", category: "jeeveda", mrp: 105, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T48022_420761.jpg", description: "Jeeveda chilli powder, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-turmeric-powder", name: "TURMERIC POWDER-500 GM", category: "jeeveda", mrp: 335, packSize: "500 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T48522_226603.jpg", description: "Jeeveda turmeric powder, 500 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-coriander-powder", name: "CORIANDER POWDER-100 GM", category: "jeeveda", mrp: 76, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T48622_036949.jpg", description: "Jeeveda coriander powder, 100 GM pack. Check the label for ingredients and allergen information." },
  { id: "awpl-jeeveda-rice-bran-oil-1l", name: "JEEVEDA RICE BRAN OIL (1 LTR.)", category: "jeeveda", mrp: 399, packSize: "1 LTR", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T68822_095650.jpeg", description: "Jeeveda rice bran cooking oil, 1 LTR pack. Refer to the label for ingredients, nutrition information and storage details." },

  // SNISS Cosmetic — exact shade/variant rows from the official listing.
  { id: "awpl-cosmetic-prep-it-primer", name: "PREP-IT PRIMER", category: "sniss-cosmetic", mrp: 1329, packSize: "30.00 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T3952_742788.jpeg", imageStatus: "VERIFIED", description: "SNISS makeup primer, 30 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-lift-sculpt-concealer-ivory-play", name: "LIFT AND SCULPT CONCEALER- IVORY PLAY", category: "sniss-cosmetic", mrp: 909, packSize: "4 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T39633_845124.jpg", description: "SNISS concealer in the Ivory Play variant, 4 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-ultra-smooth-foundation-creamy-vanilla", name: "ULTRA SMOOTH FOUNDATION FOR RADIANT GLOW-CREAMY VANILLA", category: "sniss-cosmetic", mrp: 1049, packSize: "30 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T39011_485458.jpg", description: "SNISS foundation in the Creamy Vanilla variant, 30 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-color-drew-blush-stick-flirty", name: "COLOR DREW BLUSH STICK-FLIRTY", category: "sniss-cosmetic", mrp: 559, packSize: "4 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T40244_868418.jpg", description: "SNISS blush stick in the Flirty variant, 4 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-blurr-loose-powder-white-touch", name: "BLURR LOOSE POWDER-WHITE TOUCH", category: "sniss-cosmetic", mrp: 1245, packSize: "15 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4051_365172.jpg", description: "SNISS loose face powder in the White Touch variant, 15 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-lumitouch-compact-soft-sand", name: "LUMITOUCH COMPACT POWDER-SOFT SAND", category: "sniss-cosmetic", mrp: 979, packSize: "9 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4091_962749.jpg", description: "SNISS compact powder in the Soft Sand variant, 9 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-powder-blush-nasty", name: "POWDER BLUSH-NASTY", category: "sniss-cosmetic", mrp: 909, packSize: "3.5 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T41511_836766.jpg", description: "SNISS powder blush in the Nasty variant, 3.5 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-diamond-bomb-highlighter-rosemary", name: "DIAMOND BOMB HIGHLIGHTER-ROSEMARY", category: "sniss-cosmetic", mrp: 419, packSize: "3.5 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T41911_311487.png", description: "SNISS highlighter in the Rosemary variant, 3.5 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-diamond-bomb-highlighter-champagne", name: "DIAMOND BOMB HIGHLIGHTER-SPARKLING CHAMPAGNE", category: "sniss-cosmetic", mrp: 419, packSize: "3.5 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4201_542211.png", description: "SNISS highlighter in the Sparkling Champagne variant, 3.5 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-eyeliner-holographic-peacock", name: "EYELINER HOLOGRAPHIC-PEACOCK GREEN HALO", category: "sniss-cosmetic", mrp: 279, packSize: "1 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4221_107013.jpg", description: "SNISS holographic eyeliner in the Peacock Green Halo variant, 1 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-eyeliner-metallic-rose-gold", name: "EYELINER METTALIC-ROSE GOLD", category: "sniss-cosmetic", mrp: 979, packSize: "3.5 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T42411_400200.jpg", description: "SNISS metallic eyeliner in the Rose Gold variant, 3.5 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-matte-eye-liner-black", name: "MATTE EYE LINER BLACK", category: "sniss-cosmetic", mrp: 867, packSize: "3.5 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4261_652470.jpg", description: "SNISS black matte eyeliner, 3.5 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-kajal-with-sharpner", name: "KAJAL WITH SHARPNER", category: "sniss-cosmetic", mrp: 979, packSize: "1.5 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T42711_327083.png", description: "SNISS kajal with sharpener, 1.5 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-kajal-retractable", name: "KAJAL RETRACTABLE", category: "sniss-cosmetic", mrp: 349, packSize: "0.3 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T42811_504923.jpeg", description: "SNISS retractable kajal, 0.3 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-flick-lift-mascara", name: "FLICK&LIFT MASCARA", category: "sniss-cosmetic", mrp: 699, packSize: "5 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T42911_957021.jpg", description: "SNISS mascara, 5 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-cream-lipstick-dusky-rose", name: "ALL DAY LUXE CREAM LIPSTICK-DUSKY ROSE", category: "sniss-cosmetic", mrp: 699, packSize: "3.5 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4301_248136.jpg", description: "SNISS cream lipstick in the Dusky Rose shade, 3.5 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-liquid-lipstick-fine-wine", name: "LUXE MATTE LIQUID LIPSTICK-FINE WINE", category: "sniss-cosmetic", mrp: 517, packSize: "3.5 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4421_532018.jpg", description: "SNISS liquid lipstick in the Fine Wine shade, 3.5 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-juicy-lip-balm-vanilla", name: "JUICY LIP BALM-VANILLA", category: "sniss-cosmetic", mrp: 406, packSize: "4 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T45411_803167.jpg", description: "SNISS lip balm in the Vanilla variant, 4 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-skin-tint-radiant-sand", name: "SKIN TINT LUMINOUS VEIL-RADIANT SAND", category: "sniss-cosmetic", mrp: 1399, packSize: "30 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T45711_773299.jpg", description: "SNISS skin tint in the Radiant Sand variant, 30 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-luxe-lips-definer-blossom", name: "LUXE LIPS DEFINER-BLOSSOM", category: "sniss-cosmetic", mrp: 979, packSize: "1.5 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T4602_239553.jpg", description: "SNISS lip pencil in the Blossom variant, 1.5 GM. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-strobe-cream-flamingo", name: "STROBE CREAM DEWY GLOW-FLAMINGO", category: "sniss-cosmetic", mrp: 1399, packSize: "25 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T46611_100265.jpg", description: "SNISS strobe cream in the Flamingo variant, 25 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-silk-shein-lip-gloss-strawberry", name: "SILK SHEIN LUXE LIP GLOSS-STRAWBERRY FLUSH", category: "sniss-cosmetic", mrp: 391, packSize: "2 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T46911_272055.jpg", description: "SNISS lip gloss in the Strawberry Flush shade, 2 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-sindoor-red", name: "SINDOOR-RED", category: "sniss-cosmetic", mrp: 141, packSize: "5 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T47511_655744.jpg", description: "SNISS sindoor in the Red variant, 5 ML. Refer to the package for ingredients and directions." },
  { id: "awpl-cosmetic-mirror-finish-concealer-green", name: "MIRROR FINISH CORRECTOR CONCEALER GREEN", category: "sniss-cosmetic", mrp: 629, packSize: "4 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T47611_494355.jpg", description: "SNISS corrector concealer in the Green variant, 4 ML. Refer to the package for ingredients and directions." },

  // SNISS Elite — personal-care, skin-care and hygiene listings.
  { id: "awpl-elite-charcoal-face-wash", name: "CHARCOAL FACE WASH", category: "sniss-elite", mrp: 419, packSize: "100.00 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T27933_175041.png", imageStatus: "MISMATCH", description: "SNISS Elite charcoal face wash, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-vitamin-c-face-wash", name: "VITAMIN C FACE WASH", category: "sniss-elite", mrp: 357, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28011_503369.jpg", imageStatus: "VERIFIED", description: "SNISS Elite Vitamin C face wash, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-hydrating-face-wash", name: "HYDRATING FACE WASH", category: "sniss-elite", mrp: 357, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28111_982416.jpg", imageStatus: "VERIFIED", description: "SNISS Elite hydrating face wash, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-aloevera-cucumber-gel", name: "ALOEVERA CUCUMBER GEL", category: "sniss-elite", mrp: 371, packSize: "300 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28211_045696.jpg", imageStatus: "VERIFIED", description: "SNISS Elite aloe vera cucumber gel, 300 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-aloevera-turmeric-gel", name: "ALOEVERA TURMERIC GEL", category: "sniss-elite", mrp: 371, packSize: "300 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28311_456748.jpg", imageStatus: "VERIFIED", description: "SNISS Elite aloe vera turmeric gel, 300 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-aloevera-pink-gel", name: "ALOEVERA PINK GEL", category: "sniss-elite", mrp: 371, packSize: "300 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28411_374297.jpg", imageStatus: "VERIFIED", description: "SNISS Elite aloe vera pink gel, 300 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-hyaluronic-moisturizer", name: "HYALURONIC ACID FACE MOISTURIZER", category: "sniss-elite", mrp: 770, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28511_818334.jpg", imageStatus: "VERIFIED", description: "SNISS Elite hyaluronic acid face moisturizer, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-gold-moisturizer", name: "24K GOLD FACE MOISTURIZER", category: "sniss-elite", mrp: 770, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28611_574415.jpg", imageStatus: "VERIFIED", description: "SNISS Elite 24K Gold face moisturizer, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-under-eye-cream", name: "UNDER EYE CREAM", category: "sniss-elite", mrp: 699, packSize: "15 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28711_741561.png", description: "SNISS Elite under-eye cream, 15 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-vitamin-c-toner", name: "VITAMIN C FACE TONER", category: "sniss-elite", mrp: 629, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28811_670815.jpg", imageStatus: "VERIFIED", description: "SNISS Elite Vitamin C face toner, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-snail-mucin-serum", name: "HYALURONIC ACID WITH SNAIL MU", category: "sniss-elite", mrp: 699, packSize: "30 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28911_247730.jpg", imageStatus: "VERIFIED", description: "SNISS Elite hyaluronic acid and snail mucin face serum, 30 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-vitamin-c-serum", name: "VITAMIN C FACE SERUM", category: "sniss-elite", mrp: 749, packSize: "30 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29011_784635.jpg", imageStatus: "VERIFIED", description: "SNISS Elite Vitamin C face serum, 30 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-niacinamide-serum", name: "NIACINAMIDE FACE SERUM", category: "sniss-elite", mrp: 699, packSize: "30 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29111_895776.jpg", imageStatus: "VERIFIED", description: "SNISS Elite niacinamide face serum, 30 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-gold-serum", name: "24K GOLD FACE SERUM", category: "sniss-elite", mrp: 769, packSize: "30 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29211_318004.jpg", imageStatus: "VERIFIED", description: "SNISS Elite 24K Gold face serum, 30 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-hair-growth-serum", name: "HAIR GROWTH SERUM", category: "sniss-elite", mrp: 699, packSize: "30 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29322_561704.jpg", imageStatus: "VERIFIED", description: "SNISS Elite hair serum, 30 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-salicylic-sheet-mask", name: "SALICYLIC ACID FACE SHEET MASK", category: "sniss-elite", mrp: 315, packSize: "20 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29411_175761.jpg", imageStatus: "VERIFIED", description: "SNISS Elite salicylic acid face sheet mask, 20 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-aha-bha-sheet-mask", name: "AHA + BHA FACE SHEET MASK", category: "sniss-elite", mrp: 315, packSize: "20 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29544_356907.jpg", description: "SNISS Elite AHA + BHA face sheet mask, 20 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-kojic-sheet-mask", name: "KOJIC ACID FACE SHEET MASK", category: "sniss-elite", mrp: 315, packSize: "20 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29611_980912.jpg", imageStatus: "VERIFIED", description: "SNISS Elite kojic acid face sheet mask, 20 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-collagen-peptide-sheet-mask", name: "COLLAGEN + PEPTIDE FACE SHEET", category: "sniss-elite", mrp: 315, packSize: "20 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29744_240207.jpg", description: "SNISS Elite collagen and peptide face sheet mask, 20 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-de-tan-sheet-mask", name: "DE-TAN FACIAL SHEET MASK", category: "sniss-elite", mrp: 315, packSize: "20 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29811_161425.jpg", imageStatus: "VERIFIED", description: "SNISS Elite de-tan facial sheet mask, 20 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-elite-handwash", name: "HANDWASH", category: "sniss-elite", mrp: 175, packSize: "250 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T17411_751431.jpg", imageStatus: "VERIFIED", description: "SNISS Elite hand wash, 250 ML. Follow the label directions." },
  { id: "awpl-elite-sunscreen-gel", name: "SUNSCREEN SPF50 PA++++ GEL", category: "sniss-elite", mrp: 405, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29911_455159.jpg", imageStatus: "MISMATCH", description: "SNISS Elite sunscreen gel, SPF50 PA++++, 50 GM. Refer to the label for directions and precautions." },
  { id: "awpl-elite-handwash-refill", name: "HANDWASH REFILLING", category: "sniss-elite", mrp: 388, packSize: "1000 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T17511_640592.jpg", description: "SNISS Elite hand wash refill, 1000 ML. Follow the label directions." },
  { id: "awpl-elite-lavender-sunscreen-stick", name: "LAVENDER SUNSCREEN STICK BROAD SPECTRUM SPF50 PA++++", category: "sniss-elite", mrp: 769, packSize: "20 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T30011_959155.jpg", imageStatus: "VERIFIED", description: "SNISS Elite lavender sunscreen stick, SPF50 PA++++, 20 GM. Refer to the label for directions and precautions." },

  // SNISS Herbal — personal care items only; treatment ointments and unclear items are held back.
  { id: "awpl-herbal-conditioner-hair-shine", name: "HAIR SHINE OINT- CONDITIONER", category: "sniss-herbal", mrp: 363, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35911_600144.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal hair conditioner, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-almond-olive-hair-oil", name: "ALMOND OLIVE HAIR OIL", category: "sniss-herbal", mrp: 111, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36311_622886.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal almond and olive hair oil, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-amla-hair-oil", name: "AMLA HAIR OIL", category: "sniss-herbal", mrp: 105, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36411_785974.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal amla hair oil, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-aloevera-cucumber-cream", name: "ALOEVERA CUCUMBER CREAM", category: "sniss-herbal", mrp: 314, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34611_512890.jpeg", imageStatus: "VERIFIED", description: "SNISS Herbal aloe vera cucumber cream, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-ayucoco-hair-oil", name: "AYUCOCO HAIR OIL", category: "sniss-herbal", mrp: 154, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36511_855352.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal Ayucoco hair oil, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-cool-oil", name: "COOL OIL", category: "sniss-herbal", mrp: 115, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36611_933896.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal Cool Oil, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-face-scrub-cream", name: "FACE SCRUB CREAM", category: "sniss-herbal", mrp: 328, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34711_407525.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal face scrub cream, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-day-cream", name: "DAY CREAM", category: "sniss-herbal", mrp: 358, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34811_653617.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal day cream, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-daily-care-shampoo", name: "DAILY CARE SHAMPOO", category: "sniss-herbal", mrp: 111, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36711_712007.jpeg", imageStatus: "VERIFIED", description: "SNISS Herbal daily care shampoo, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-ultra-smoothing-shampoo", name: "ULTRA SMOOTHING SHAMPOO", category: "sniss-herbal", mrp: 123, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36811_997809.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal ultra smoothing shampoo, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-night-cream-womens", name: "NIGHT CREAM WOMENS", category: "sniss-herbal", mrp: 377, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35011_852379.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal night cream, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-damage-repair-shampoo", name: "DAMAGE REPAIR SHAMPOO", category: "sniss-herbal", mrp: 148, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36911_943238.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal shampoo, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-all-day-glow-cream", name: "ALL DAY GLOW CREAM FOR WOMEN", category: "sniss-herbal", mrp: 372, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35111_178499.jpeg", description: "SNISS Herbal face cream, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-root-shine-shampoo", name: "ROOT & SHINE SHAMPOO", category: "sniss-herbal", mrp: 136, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37011_903292.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal shampoo, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-moisturising-cream", name: "MOISTURISING CREAM", category: "sniss-herbal", mrp: 258, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35211_026549.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal moisturising cream, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-ultra-smoothing-serum", name: "ULTRA SMOOTHING SERUM", category: "sniss-herbal", mrp: 279, packSize: "50 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37611_897384.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal hair serum, 50 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-herbal-face-wash", name: "HERBAL FACE WASH", category: "sniss-herbal", mrp: 335, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35311_953694.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal face wash, 100 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-strawberry-face-wash", name: "STRAWBERRY FACE WASH", category: "sniss-herbal", mrp: 237, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35411_446426.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal strawberry face wash, 100 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-kiwi-face-wash", name: "KIWI FRUIT FACE WASH", category: "sniss-herbal", mrp: 245, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35511_221492.jpg", description: "SNISS Herbal kiwi fruit face wash, 100 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-lip-balm", name: "LIP BALM", category: "sniss-herbal", mrp: 69, packSize: "10 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35611_773222.jpg", imageStatus: "MISMATCH", description: "SNISS Herbal lip balm, 10 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-body-lotion", name: "BODY LOTION", category: "sniss-herbal", mrp: 433, packSize: "200 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35711_578145.jpg", imageStatus: "MISMATCH", description: "SNISS Herbal body lotion, 200 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-face-pack-cream", name: "FACE PACK CREAM", category: "sniss-herbal", mrp: 335, packSize: "50 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36011_993079.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal face pack cream, 50 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-peel-off-mask", name: "PEEL OFF FACE MASK", category: "sniss-herbal", mrp: 251, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37211_890672.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal peel-off face mask, 100 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-aloevera-orange-shower-gel", name: "ALOEVERA ORANGE SHOWER GEL", category: "sniss-herbal", mrp: 321, packSize: "250 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37311_745262.jpg", imageStatus: "MISMATCH", description: "SNISS Herbal aloe vera orange shower gel, 250 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-aloevera-shower-gel", name: "ALOEVERA SHOWER GEL", category: "sniss-herbal", mrp: 357, packSize: "250 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37411_291002.jpg", imageStatus: "MISMATCH", description: "SNISS Herbal aloe vera shower gel, 250 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-talcum-powder", name: "TALCUM POWDER", category: "sniss-herbal", mrp: 156, packSize: "100 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37711_813597.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal talcum powder, 100 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-shaving-cream", name: "SHAVING CREAM FOR MEN", category: "sniss-herbal", mrp: 123, packSize: "75 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T38811_316464.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal shaving cream, 75 GM. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-hair-cleanser-shampoo", name: "HAIR CLEANSER-SHAMPOO", category: "sniss-herbal", mrp: 224, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T51311_348887.jpg", imageStatus: "VERIFIED", description: "SNISS Herbal hair cleanser shampoo, 100 ML. Refer to the label for ingredients and directions." },
  { id: "awpl-herbal-hairdoc-oil-200ml", name: "HAIRDOC OIL 200 ML", category: "sniss-herbal", mrp: 431, packSize: "200.00 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T51411_042878.jpg", imageStatus: "VERIFIED", sourceUrl: "https://www.asclepiuswellness.com/product/sniss-herbal/hairdoc-oil/", description: "Hair oil product, 200 ML. Refer to the product label for ingredients and usage directions." },

  // Baby Care, Food, household essentials, apparel and fragrances.
  { id: "awpl-baby-little-pie-shampoo", name: "LITTLE PIE BABY SHAMPOO", category: "baby-care", mrp: 155, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37111_248371.jpg", imageStatus: "VERIFIED", description: "Little Pie baby shampoo, 100 ML. Check the packaging for ingredients, age guidance and usage directions." },
  { id: "awpl-baby-little-pie-gentle-soap", name: "LITTLE PIE SOOTHING BABY GENTLE SOAP", category: "baby-care", mrp: 258, packSize: "75 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T47811_718922.jpg", imageStatus: "VERIFIED", description: "Little Pie baby soap, 75 GM. Check the packaging for ingredients, age guidance and usage directions." },
  { id: "awpl-baby-little-pie-lotion", name: "LITTLE PIE BABY LOTION", category: "baby-care", mrp: 245, packSize: "100 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37511_235776.jpg", imageStatus: "MISMATCH", description: "Little Pie baby lotion, 100 ML. Check the packaging for ingredients, age guidance and usage directions." },
  { id: "awpl-food-multiflora-honey", name: "ECO AROGYAM MULTIFLORA HONEY (NEW)", category: "food", mrp: 531, packSize: "500 GM", imageUrl: "https://asclepiuswellness.com/upload/product/_T1661.png", imageStatus: "VERIFIED", description: "Eco Arogyam multiflora honey, 500 GM. Refer to the pack for ingredients, nutrition information and storage details." },
  { id: "awpl-food-eco-arogyam-tea", name: "ECO AROGYAM TEA", category: "food", mrp: 197, packSize: "250 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23211_083580.jpg", imageStatus: "VERIFIED", description: "Eco Arogyam tea, 250 GM. Refer to the pack for ingredients, nutrition information and storage details." },
  { id: "awpl-home-bathveda-fresh-lime-bar", name: "BATHVEDA FRESH LIME BAR", category: "home-care", mrp: 234, packSize: "375 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T20511_934836.jpg", imageStatus: "MISMATCH", description: "BathVeda fresh lime bathing bar, 375 GM. Refer to the packaging for ingredients and directions." },
  { id: "awpl-home-bathveda-mysore-sandal-soap", name: "BATHVEDA MYSORE SANDAL SOAP", category: "home-care", mrp: 261, packSize: "375 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T20611_940204.jpg", imageStatus: "MISMATCH", description: "BathVeda Mysore sandal soap, 375 GM. Refer to the packaging for ingredients and directions." },
  { id: "awpl-home-bathveda-neem-tulsi-bar", name: "BATHVEDA NEEM TULSI BAR", category: "home-care", mrp: 216, packSize: "375 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T24111_707974.jpg", description: "BathVeda neem tulsi bathing bar, 375 GM. Refer to the packaging for ingredients and directions." },
  { id: "awpl-home-bathveda-beauty-cream-bar", name: "BATHVEDA BEAUTY CREAM BAR", category: "home-care", mrp: 216, packSize: "375 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23611_495567.jpg", description: "BathVeda beauty cream bathing bar, 375 GM. Refer to the packaging for ingredients and directions." },
  { id: "awpl-home-bathveda-goat-milk-bar", name: "BATHVEDA GOAT MILK BAR", category: "home-care", mrp: 384, packSize: "375 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23711_989465.jpg", description: "BathVeda goat milk bathing bar, 375 GM. Refer to the packaging for ingredients and directions." },
  { id: "awpl-home-bathveda-glycerin-bar", name: "BATHVEDA GLYCERIN NATURAL OIL BAR", category: "home-care", mrp: 216, packSize: "375 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23511_889140.jpg", description: "BathVeda glycerin natural oil bathing bar, 375 GM. Refer to the packaging for ingredients and directions." },
  { id: "awpl-home-limfresh-liquid-dishwash", name: "LIMFRESH LIQUID DISH WASH", category: "home-care", mrp: 133, packSize: "500 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23411_554620.jpg", imageStatus: "VERIFIED", description: "Limfresh liquid dish wash, 500 ML. Follow the product label directions and precautions." },
  { id: "awpl-home-toshine-liquid-wash", name: "TOSHINE LIQUID WASH", category: "home-care", mrp: 271, packSize: "1000 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23811_279313.jpg", imageStatus: "VERIFIED", description: "Toshine liquid laundry wash, 1000 ML. Follow the product label directions and precautions." },
  { id: "awpl-home-toshine-detergent-powder", name: "TOSHINE DETERGENT POWDER", category: "home-care", mrp: 198, packSize: "1000 GM", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23911_011688.jpg", imageStatus: "VERIFIED", description: "Toshine detergent powder, 1000 GM. Follow the product label directions and precautions." },
  { id: "awpl-home-easysweep-surface-cleaner", name: "EASY SWEEP SURFACE CLEANER", category: "home-care", mrp: 133, packSize: "500 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T24011_932018.jpg", imageStatus: "VERIFIED", description: "Easy Sweep surface cleaner, 500 ML. Follow the product label directions and precautions." },
  { id: "awpl-home-powerflush-toilet-cleaner", name: "POWER FLUSH TOILET CLEANER", category: "home-care", mrp: 125, packSize: "500 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T23311_613104.jpg", imageStatus: "VERIFIED", description: "Power Flush toilet cleaner, 500 ML. Follow the product label directions and precautions." },
  { id: "awpl-home-toshine-winterwear-liquid-wash", name: "TOSHINE WINTERWEAR LIQUID WASH", category: "home-care", mrp: 266, packSize: "1000 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T25211_254654.jpg", imageStatus: "VERIFIED", description: "Toshine winterwear liquid wash, 1000 ML. Follow the product label directions and precautions." },
  { id: "awpl-home-toshine-detergent-bar", name: "TOSHINE DETERGENT BAR", category: "home-care", mrp: 120, packSize: "3 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T25811_226084.jpg", description: "Toshine detergent bars, pack of 3. Follow the product label directions and precautions." },
  { id: "awpl-home-limfresh-dishwash-bar", name: "LIMFRESH DISH WASH BAR", category: "home-care", mrp: 129, packSize: "3 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T25911_339243.jpg", description: "Limfresh dish wash bars, pack of 3. Follow the product label directions and precautions." },
  { id: "awpl-home-room-freshener-musk", name: "ROOM FRESHNER(MUSK)", category: "home-care", mrp: 325, packSize: "200 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T26411_057524.jpg", imageStatus: "VERIFIED", description: "Musk room freshener, 200 ML. Follow the product label directions and precautions." },

  { id: "awpl-fragrance-orella-perfume", name: "ORELLA PERFUME", category: "sniss-fragrances", mrp: 1073, packSize: "75 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T27611_046198.jpg", imageStatus: "VERIFIED", description: "SNISS OrellA perfume, 75 ML. Refer to the package for fragrance and ingredient details." },
  { id: "awpl-fragrance-nebel-perfume", name: "NEBEL PERFUME", category: "sniss-fragrances", mrp: 1073, packSize: "75 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T27711_497299.jpg", description: "SNISS Nebel perfume, 75 ML. Refer to the package for fragrance and ingredient details." },
  { id: "awpl-fragrance-sniss-revoque", name: "SNISS REVOQUE", category: "sniss-fragrances", mrp: 406, packSize: "150 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T67011_988311.jpg", description: "SNISS Revoque fragrance, 150 ML. Refer to the package for fragrance and ingredient details." },
  { id: "awpl-fragrance-sniss-london-xi", name: "SNISS LONDON XI", category: "sniss-fragrances", mrp: 406, packSize: "150 ML", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T67111_675985.jpg", description: "SNISS London XI fragrance, 150 ML. Refer to the package for fragrance and ingredient details." },

  // Apparels are individual colour/size SKUs, not a variant selector.
  { id: "awpl-apparels-asclepius-women-saree-crape", name: "ASCLEPIUS WOMEN SAREE CRAPE", category: "apparels", mrp: 2099, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T51911_979702.png", description: "Asclepius women's crape saree. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-asclepius-women-suits", name: "ASCLEPIUS WOMEN SUITS", category: "apparels", mrp: 2099, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T5201_768289.jpg", description: "Asclepius women's suit set. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-asclepius-tie-black", name: "ASCLEPIUS TIE -BLACK", category: "apparels", mrp: 559, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T5211_148684.jpg", description: "Asclepius black tie. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-tshirt-olive-s", name: "ASCLEPIUS T SHIRT -OLIVE- (S)", category: "apparels", mrp: 2559, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T68911_367592.jpg", description: "Asclepius olive T-shirt, size S. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-tshirt-light-blue-s", name: "ASCLEPIUS T SHIRT -LIGHT BLUE (S)", category: "apparels", mrp: 2559, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T71011_904020.jpg", description: "Asclepius light blue T-shirt, size S. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-tshirt-teal-s", name: "ASCLEPIUS T SHIRT -TEAL (S)", category: "apparels", mrp: 2559, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T71111_044937.jpg", description: "Asclepius teal T-shirt, size S. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-tshirt-black-s", name: "ASCLEPIUS T SHIRT -BLACK (S)", category: "apparels", mrp: 2559, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T71211_897277.jpeg", description: "Asclepius black T-shirt, size S. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-tshirt-ivory-s", name: "ASCLEPIUS T SHIRT -IVORY (S)", category: "apparels", mrp: 2559, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T70811_633824.jpg", description: "Asclepius ivory T-shirt, size S. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-women-tshirt-ivory-xs", name: "ASCLEPIUS WOMEN T-SHIRT -IVORY (XS)", category: "apparels", mrp: 2295, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T71411_244334.jpg", description: "Asclepius women's ivory T-shirt, size XS. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-women-tshirt-light-blue-xs", name: "ASCLEPIUS WOMEN T-SHIRT -LIGHT BLUE (XS)", category: "apparels", mrp: 2295, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T72011_373051.jpeg", description: "Asclepius women's light blue T-shirt, size XS. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-women-tshirt-teal-l", name: "ASCLEPIUS WOMEN T-SHIRT -TEAL (L)", category: "apparels", mrp: 2295, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T72911_914409.jpg", description: "Asclepius women's teal T-shirt, size L. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-women-tshirt-black-xs", name: "ASCLEPIUS WOMEN T-SHIRT -BLACK (XS)", category: "apparels", mrp: 2295, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T73211_998292.jpg", description: "Asclepius women's black T-shirt, size XS. Fabric composition and care details are on the product label." },
  { id: "awpl-apparels-women-tshirt-olive-xs", name: "ASCLEPIUS WOMEN T-SHIRT -OLIVE (XS)", category: "apparels", mrp: 2295, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T73811_166450.jpg", description: "Asclepius women's olive T-shirt, size XS. Fabric composition and care details are on the product label." },
  // Lifestyle accessory from the official Others listing.
  { id: "awpl-others-back-pack", name: "BACK PACK", category: "others", mrp: 1679, packSize: "1 NUMBER", imageUrl: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T3011_293368.jpg", imageStatus: "VERIFIED", description: "Asclepius Wellness backpack, 1 unit." },

];

const importedCatalogueProducts: ProductMasterRecord[] = importedCatalogueSeeds.map((seed) => {
  const sourceUrl = seed.sourceUrl ?? sourceByCategory[seed.category];
  const hasImageUrl = Boolean(seed.imageUrl);
  return {
    id: seed.id,
    name: seed.name,
    nameHi: null,
    brand: seed.category.startsWith("sniss-") ? "SNISS"
      : seed.category === "jeeveda" ? "Jeeveda"
      : seed.category === "baby-care" ? "Little Pie"
      : seed.category === "home-care" ? "Asclepius"
      : seed.category === "apparels" ? "Asclepius"
      : seed.category === "food" ? "Eco Arogyam"
      : "Asclepius",
    category: seed.category,
    subcategory: null,
    mrp: seed.mrp,
    packSize: seed.packSize,
    description: seed.description,
    ingredients: null,
    image: {
      url: seed.imageUrl ?? null,
      status: seed.imageStatus ?? (hasImageUrl ? "UPLOADED_UNVERIFIED" : "MISSING"),
      altText: hasImageUrl
        ? seed.imageStatus === "MISMATCH"
          ? seed.name + " product image; pack mismatch identified and image hidden pending replacement"
          : seed.imageStatus === "VERIFIED"
            ? seed.name + " product image; visible product and pack label visually matched"
            : seed.name + " product image; exact SKU and pack match pending"
        : null
    },
    availability: seed.priceStatus === "PRICE_REVIEW_REQUIRED" ? "REVIEW_REQUIRED" : "UNKNOWN",
    status: seed.priceStatus ?? "VERIFIED",
    priceEvidence: {
      sourceLabel: "Official AWPL category listing",
      sourceUrl,
      checkedAt: "2026-11-06",
      reviewNote: seed.reviewNote ?? "MRP transcribed from the official listing; DP and SP are not imported."
    },
    productSource: {
      sourceLabel: "Official AWPL product/category listing",
      sourceUrl,
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  };
});

export const awplProducts: ProductMasterRecord[] = [
  {
    id: "awpl-herbal-hairdoc",
    name: "HAIRDOC OIL",
    nameHi: null,
    brand: null,
    category: "sniss-herbal",
    subcategory: null,
    mrp: 229,
    packSize: "100.00 ML",
    description: "Hair oil product, 100 ML. Refer to the product label for ingredients and usage directions.",
    ingredients: null,
    image: { url: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T51211_960923.jpg", status: "VERIFIED", altText: "HAIRDOC OIL 100 ML; visible product name and 100 ML pack label visually matched" },
    availability: "UNKNOWN",
    status: "VERIFIED",
    priceEvidence: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/sniss-herbal/",
      checkedAt: "2026-11-06",
      reviewNote: "MRP from official listing"
    },
    productSource: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/sniss-herbal/",
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  },
  {
    id: "awpl-oral-dentodoc",
    name: "DENTODOC CREAM",
    nameHi: null,
    brand: null,
    category: "oral-care",
    subcategory: null,
    mrp: 232,
    packSize: "100.00 GM",
    description: "DentoDoc oral-care cream, 100 GM. Refer to the product label for ingredients and directions.",
    ingredients: null,
    image: { url: "https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T5011.jpeg", status: "VERIFIED", altText: "DentoDoc Cream 100 GM; visible product name and 100 g pack label visually matched" },
    availability: "UNKNOWN",
    status: "VERIFIED",
    priceEvidence: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/oral-care/",
      checkedAt: "2026-11-06",
      reviewNote: "MRP from official listing"
    },
    productSource: {
      sourceLabel: "AWPL official category listing",
      sourceUrl: "https://www.asclepiuswellness.com/product/oral-care/",
      checkedAt: "2026-11-06"
    },
    lastVerifiedAt: "2026-11-06"
  },
  ...importedCatalogueProducts
];
