const protectedBrands = [
  "ECO AROGYAM", "LITTLE PIE", "ASCLEPIUS", "BATHVEDA", "LIMFRESH", "TOSHINE",
  "HAIRDOC", "AYUCOCO", "JEEVEDA", "ORELLA", "NEBEL", "SNISS", "AWPL",
];

const phraseMap: Array<[string, string]> = [
  ["RICE BRAN OIL", "चावल के चोकर का तेल"], ["CHHOLE CHANA", "छोले चना"], ["DAL MAKHANI", "दाल मखनी"],
  ["PAV BHAJI", "पाव भाजी"], ["SHAHI PANEER", "शाही पनीर"], ["KITCHEN KING", "किचन किंग"],
  ["TANDOORI CHICKEN", "तंदूरी चिकन"], ["CAROM SEEDS", "अजवाइन"], ["BLACK PEPPER", "काली मिर्च"],
  ["BLACK CARDAMOM", "बड़ी इलायची"], ["GREEN CARDAMOM", "हरी इलायची"], ["CUMIN SEEDS", "जीरा"],
  ["NIGELLA SEEDS", "कलौंजी"], ["FENUGREEK SEEDS", "मेथी दाना"], ["MUSTARD SEEDS", "सरसों के दाने"],
  ["CINNAMON STICKS", "दालचीनी"], ["BAY LEAF", "तेज पत्ता"], ["FENUGREEK LEAVES", "कसूरी मेथी"],
  ["CHILLI POWDER", "लाल मिर्च पाउडर"], ["TURMERIC POWDER", "हल्दी पाउडर"], ["CORIANDER POWDER", "धनिया पाउडर"],
  ["LIFT AND SCULPT", "लिफ्ट एंड स्कल्प्ट"], ["ULTRA SMOOTH", "अल्ट्रा स्मूद"], ["RADIANT GLOW", "दमकती चमक"],
  ["DIAMOND BOMB", "डायमंड बॉम्ब"], ["SPARKLING CHAMPAGNE", "चमकता शैम्पेन"], ["PEACOCK GREEN HALO", "मोरपंखी हरा"],
  ["ROSE GOLD", "रोज़ गोल्ड"], ["DUSKY ROSE", "डस्की रोज़"], ["FINE WINE", "फाइन वाइन"], ["WHITE TOUCH", "व्हाइट टच"],
  ["SOFT SAND", "सॉफ्ट सैंड"], ["RADIANT SAND", "रेडिएंट सैंड"], ["STRAWBERRY FLUSH", "स्ट्रॉबेरी फ्लश"],
  ["FACE SHEET MASK", "फेस शीट मास्क"], ["SHEET MASK", "शीट मास्क"], ["FACE WASH", "फेस वॉश"],
  ["FACE MOISTURIZER", "फेस मॉइस्चराइज़र"], ["FACE TONER", "फेस टोनर"], ["FACE SERUM", "फेस सीरम"],
  ["HAIR SHINE", "बालों की चमक"], ["HAIR GROWTH", "बालों की वृद्धि"], ["HAIR OIL", "हेयर ऑयल"],
  ["BODY LOTION", "बॉडी लोशन"], ["LIP BALM", "लिप बाम"], ["LIQUID LIPSTICK", "लिक्विड लिपस्टिक"],
  ["CREAM LIPSTICK", "क्रीम लिपस्टिक"], ["LIP GLOSS", "लिप ग्लॉस"], ["UNDER EYE", "आंखों के नीचे"],
  ["ALOE VERA", "एलोवेरा"], ["VITAMIN C", "विटामिन C"], ["HYALURONIC ACID", "हायलूरोनिक एसिड"],
  ["SALICYLIC ACID", "सैलिसिलिक एसिड"], ["NIACINAMIDE", "नायसिनामाइड"], ["COLLAGEN", "कोलेजन"],
  ["PEPTIDE", "पेप्टाइड"], ["SNAIL MUCIN", "स्नेल म्यूसिन"], ["SUNSCREEN", "सनस्क्रीन"],
  ["HANDWASH", "हैंडवॉश"], ["HAND WASH", "हैंडवॉश"], ["SHAVING CREAM", "शेविंग क्रीम"],
  ["FACE SCRUB", "फेस स्क्रब"], ["DAY CREAM", "डे क्रीम"], ["NIGHT CREAM", "नाइट क्रीम"],
  ["FACE CREAM", "फेस क्रीम"], ["MOISTURISING CREAM", "मॉइस्चराइजिंग क्रीम"], ["SHAMPOO", "शैम्पू"],
  ["CONDITIONER", "कंडीशनर"], ["HAIR SERUM", "हेयर सीरम"], ["PEEL OFF", "पील-ऑफ"],
  ["SHOWER GEL", "शॉवर जेल"], ["TALCUM POWDER", "टैल्कम पाउडर"], ["LIPSTICK", "लिपस्टिक"],
  ["CONCEALER", "कंसीलर"], ["FOUNDATION", "फाउंडेशन"], ["BLUSH STICK", "ब्लश स्टिक"],
  ["LOOSE POWDER", "लूज़ पाउडर"], ["COMPACT POWDER", "कॉम्पैक्ट पाउडर"], ["POWDER BLUSH", "पाउडर ब्लश"],
  ["HIGHLIGHTER", "हाइलाइटर"], ["EYELINER", "आईलाइनर"], ["EYE LINER", "आईलाइनर"],
  ["KAJAL", "काजल"], ["MASCARA", "मस्कारा"], ["STROBE CREAM", "स्ट्रोब क्रीम"],
  ["SKIN TINT", "स्किन टिंट"], ["LIPS DEFINER", "लिप्स डिफाइनर"], ["SINDOOR", "सिंदूर"],
  ["CORRECTOR", "कलर करेक्टर"], ["CHARCOAL", "चारकोल"], ["HYDRATING", "हाइड्रेटिंग"],
  ["GEL", "जेल"], ["CREAM", "क्रीम"], ["OIL", "तेल"], ["MASALA", "मसाला"],
  ["SEASONING", "मसाला मिश्रण"], ["POWDER", "पाउडर"], ["HONEY", "शहद"], ["TEA", "चाय"],
  ["FRESH LIME", "ताज़ा नींबू"], ["MYSORE SANDAL", "मैसूर चंदन"], ["NEEM TULSI", "नीम तुलसी"],
  ["GOAT MILK", "बकरी का दूध"], ["GLYCERIN", "ग्लिसरीन"], ["NATURAL", "प्राकृतिक"],
  ["DISH WASH", "बर्तन धोने का साबुन"], ["LIQUID WASH", "लिक्विड वॉश"], ["DETERGENT", "डिटर्जेंट"],
  ["SURFACE CLEANER", "सतह साफ़ करने वाला"], ["TOILET CLEANER", "टॉयलेट क्लीनर"], ["ROOM FRESHNER", "कमरे की सुगंध"],
  ["ROOM FRESHENER", "कमरे की सुगंध"], ["PERFUME", "परफ्यूम"], ["FRAGRANCE", "सुगंध"],
  ["WOMEN", "महिलाओं के लिए"], ["WOMENS", "महिलाओं के लिए"], ["SAREE", "साड़ी"], ["SUITS", "सूट"],
  ["T-SHIRT", "टी-शर्ट"], ["T SHIRT", "टी-शर्ट"], ["TIE", "टाई"], ["BACK PACK", "बैकपैक"],
  ["BLACK", "काला"], ["WHITE", "सफेद"], ["RED", "लाल"], ["GREEN", "हरा"], ["BLUE", "नीला"],
  ["LIGHT BLUE", "हल्का नीला"], ["TEAL", "टील"], ["OLIVE", "ऑलिव"], ["IVORY", "आइवरी"],
  ["ORANGE", "नारंगी"], ["PINK", "गुलाबी"], ["LAVENDER", "लैवेंडर"], ["STRAWBERRY", "स्ट्रॉबेरी"],
  ["KIWI FRUIT", "कीवी फल"], ["KIWI", "कीवी"], ["VANILLA", "वनीला"], ["FLAMINGO", "फ्लेमिंगो"],
  ["ROSEMARY", "रोज़मेरी"], ["BLOSSOM", "ब्लॉसम"], ["FLIRTY", "फ्लर्टी"], ["NASTY", "नैस्टी"],
  ["MUSK", "मस्क"], ["FRESH", "ताज़ा"], ["COOL", "कूल"], ["ULTRA", "अल्ट्रा"],
  ["SMOOTHING", "स्मूदिंग"], ["SHINE", "चमक"], ["GLOW", "चमक"], ["CARE", "देखभाल"],
  ["DAILY", "दैनिक"], ["DAMAGE REPAIR", "क्षति की मरम्मत"], ["ROOT", "जड़ों"], ["ALL DAY", "पूरे दिन"],
  ["ELITE", "एलीट"], ["HERBAL", "हर्बल"], ["BABY", "शिशु"], ["GENTLE", "मृदु"], ["SOOTHING", "सुकून देने वाला"],
  ["MULTIFLORA", "बहुफूल"], ["BATHING BAR", "नहाने का साबुन"], ["BAR", "साबुन"], ["LIQUID", "लिक्विड"],
  ["EASY SWEEP", "ईज़ी स्वीप"], ["POWER FLUSH", "पावर फ्लश"], ["WINTERWEAR", "सर्दियों के कपड़े"],
  ["WASH", "वॉश"], ["PACK", "पैक"], ["FOR", "के लिए"], ["WITH", "के साथ"], ["AND", "और"],
  ["NEW", "नया"], ["WOMEN'S", "महिलाओं के"], ["WOMEN", "महिलाओं के"], ["MEN", "पुरुषों के"],
  ["SIZE", "आकार"], ["GM", "GM"], ["ML", "ML"], ["LTR", "LTR"], ["SPF", "SPF"], ["PA", "PA"],
];

const vowelSigns: Record<string, string> = { a: "", aa: "ा", i: "ि", ee: "ी", u: "ु", oo: "ू", e: "े", ai: "ै", o: "ो", au: "ौ", ri: "ृ" };
const independentVowels: Record<string, string> = { a: "अ", aa: "आ", i: "इ", ee: "ई", u: "उ", oo: "ऊ", e: "ए", ai: "ऐ", o: "ओ", au: "औ", ri: "ऋ" };
const consonants: Record<string, string> = {
  kh:"ख", gh:"घ", chh:"छ", ch:"च", jh:"झ", th:"थ", dh:"ध", ph:"फ", bh:"भ", sh:"श", ksh:"क्ष",
  k:"क", g:"ग", j:"ज", T:"ट", Th:"ठ", D:"ड", Dh:"ढ", N:"ण", t:"त", d:"द", n:"न", p:"प", b:"ब", m:"म",
  y:"य", r:"र", l:"ल", v:"व", w:"व", s:"स", h:"ह", f:"फ़", z:"ज़", q:"क", x:"क्स",
};
const vowelTokens = ["aa", "ee", "oo", "ai", "au", "ri", "a", "i", "u", "e", "o"];
const consonantTokens = ["ksh", "chh", "kh", "gh", "ch", "jh", "th", "dh", "ph", "bh", "sh", "Th", "Dh", "T", "D", "N", "k", "g", "j", "t", "d", "n", "p", "b", "m", "y", "r", "l", "v", "w", "s", "h", "f", "z", "q", "x"];

function transliterateWord(word: string): string {
  if (!/[A-Za-z]/.test(word) || /^(?:[A-Z]{2,}|\d|SPF|PA|LTR|ML|GM)$/i.test(word)) return word;
  let result = "";
  let index = 0;
  while (index < word.length) {
    const rest = word.slice(index);
    const vowel = vowelTokens.find((token) => rest.toLowerCase().startsWith(token));
    if (vowel) {
      result += result ? (vowelSigns[vowel] ?? "") : independentVowels[vowel];
      index += vowel.length;
      continue;
    }
    const consonant = consonantTokens.find((token) => rest.startsWith(token));
    if (consonant) {
      result += consonants[consonant] ?? "";
      index += consonant.length;
      const nextRest = word.slice(index);
      const nextVowel = vowelTokens.find((token) => nextRest.toLowerCase().startsWith(token));
      if (nextVowel) {
        result += vowelSigns[nextVowel] ?? "";
        index += nextVowel.length;
      } else if (index < word.length && /[A-Za-z]/.test(word[index])) {
        result += "्";
      }
      continue;
    }
    result += word[index];
    index += 1;
  }
  return result;
}

export function translateProductNameToHindi(name: string): string {
  let output = name;
  const preserved: string[] = [];
  for (const brand of protectedBrands) {
    const expression = new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    output = output.replace(expression, (match) => {
      const marker = `BRANDTOKEN${preserved.length}TOKEN`;
      preserved.push(match);
      return marker;
    });
  }
  for (const [source, target] of phraseMap.sort((a, b) => b[0].length - a[0].length)) {
    output = output.replace(new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), target);
  }
  output = output.replace(/\b(\d+(?:\.\d+)?\s*(?:ML|GM|LTR|L|XS|S|M|L|XL))\b/gi, "$1");
  output = output.replace(/[A-Za-z]+/g, (word) => {
    if (/^BRANDTOKEN\d+TOKEN$/i.test(word)) return word;
    if (/^(?:SPF|PA|GM|ML|LTR|XS|XL)$/i.test(word)) return word;
    return transliterateWord(word);
  });
  return output.replace(/BRANDTOKEN(\d+)TOKEN/gi, (_, index: string) => preserved[Number(index)] ?? "");
}

export function translateProductDescriptionToHindi(nameHi: string, category: string, packSize: string): string {
  const pack = packSize ? ` पैक आकार: ${packSize}।` : "";
  if (category === "jeeveda" || category === "food") {
    return `${nameHi}। सामग्री, पोषण संबंधी जानकारी और भंडारण निर्देश पैक पर देखें।${pack}`;
  }
  if (category === "home-care") {
    return `${nameHi}। उत्पाद का उपयोग पैक पर दिए निर्देशों और सावधानियों के अनुसार करें।${pack}`;
  }
  if (category === "apparels") {
    return `${nameHi}। कपड़े की संरचना और देखभाल संबंधी जानकारी उत्पाद लेबल पर दी गई है।`;
  }
  return `${nameHi}। सामग्री, उपयोग संबंधी निर्देश और आवश्यक सावधानियाँ उत्पाद के लेबल पर पढ़ें।${pack}`;
}
