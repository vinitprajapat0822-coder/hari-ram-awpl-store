"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { localizedProductName } from "@/i18n/product-labels";

export type Locale = "en" | "hi";
const dictionaries = {
  en: {
    home:"Home", catalogue:"Catalogue", about:"About", cart:"Cart", profile:"Profile",
    imageOfficial:"Official product image", imageFallback:"Illustrative image / artwork fallback", pack:"Pack", notListed:"Not listed",
    primaryNavigation:"Primary navigation", mobileNavigation:"Mobile navigation",
    productCatalogue:"Product catalogue", search:"Search", searchCatalogue:"Search catalogue",
    switchToHindi:"Switch language to Hindi", switchToEnglish:"Switch language to English",
    discoverRange:"Discover the range", browseByCategory:"Browse by category or search by name and pack size.",
    searchProducts:"Search products", clearSearch:"Clear search", clearFilters:"Clear filters",
    products:"products", product:"product", lineMrp:"Line MRP", mrpPerUnit:"MRP", spPerUnit:"SP", noMatches:"No matches found",
    tryAnother:"Try another product name, pack size or category.", resetCatalogue:"Reset catalogue",
    displayedMrpNotice:"Displayed MRP and availability are subject to confirmation before an order is accepted.",
    detailsReview:"Details review", mrpReview:"MRP review", mrpUnderReview:"MRP under review",
    listedMrp:"Listed MRP", offerPrice:"Offer price · Listed MRP crossed out",
    addedToCart:"Added to cart", addAnother:"Add another", addToCart:"Add to cart",
    openProductHint:"Open product for available details and store confirmation.",
    backToCatalogue:"Back to catalogue", productInformation:"Product information",
    category:"Category", brand:"Brand", notSpecified:"Not specified", packSize:"Pack size",
    productCode:"Product code", addedDate:"Added date", notRecorded:"Not recorded",
    lastVerified:"Last verified", catalogueVerified:"Catalogue record verified",
    detailsUnderReview:"Details under review", priceInformation:"Price information",
    currentSellingPrice:"Current selling price", confirmWithStore:"Confirm with store",
    currentPriceNotPublished:"Current selling price or offer is not published in the verified catalogue. Confirm with the store before ordering.",
    confirmBeforeOrdering:"The listed MRP is catalogue information. Final selling price and delivery are confirmed by the store.",
    askStore:"Ask store", sellerSupport:"Seller & support", ownerStore:"Owner · Hari Ram AWPL Store",
    contactSeller:"Contact seller on WhatsApp", descriptionUsage:"Description & usage",
    descriptionMissing:"The company has not supplied a product description in the current catalogue. Check the product packaging or ask the store for verified details before use.",
    ingredientsComposition:"Ingredients / composition", ingredientsMissing:"Ingredients and usage directions are not recorded. Follow the label and verified product instructions.",
    exploreMore:"Explore more", youMayAlsoLike:"You may also like", viewFullCatalogue:"View full catalogue",
    continueBrowsing:"Continue browsing", yourSelection:"Your selection", yourCart:"Your Cart",
    itemSelected:"item selected", itemsSelected:"items selected", cartWaiting:"Your cart is waiting",
    addProducts:"Add products from the catalogue and they will appear here.", browseProducts:"Browse products",
    orderSummary:"Order summary", items:"Items", subtotalMrp:"Subtotal (MRP)", subtotalSp:"Subtotal (SP)",
    totalMrp:"Total (MRP)", continueWhatsApp:"Continue on WhatsApp", createTrackedOrder:"Creating tracked order…",
    whatsappOpened:"WhatsApp enquiry opened. Online tracking is not configured for this deployment.",
    listedMrpRecorded:"Listed MRP is recorded now. Selling price, availability and delivery are confirmed by the owner before acceptance.",
    viewMyOrders:"View My Orders", deliveryInformation:"Delivery information", yourDetails:"Your Details",
    profileIntro:"Save your contact and delivery details once. They stay on this device and are included only when you choose to prepare an order on WhatsApp.",
    customerProfile:"Customer profile", requiredFields:"All fields marked with * are required",
    fullName:"Full Name", mobileNumber:"Mobile Number", deliveryAddress:"Delivery Address",
    yourFullName:"Your full name", tenDigitMobile:"10-digit mobile number",
    indianMobileHint:"An Indian mobile number, with or without the +91 prefix.",
    addressHint:"House / street, landmark, city and pincode", saveDetails:"Save details",
    detailsSaved:"Details saved", completeNameAddress:"Please complete your name and delivery address.",
    invalidMobile:"Enter a valid 10-digit Indian mobile number.",
    customerAccountSignin:"Customer account / Sign in", myOrders:"My Orders",
    deviceDetailsNotice:"Details are kept on this device and synchronised to your customer profile when you are signed in. A WhatsApp enquiry alone does not create an online tracking record.",
    returnToCart:"After saving, you will return to your cart.", loadingProfile:"Loading profile…",
    backToProfile:"Back to profile", orderCentre:"Order centre",
    orderHistory:"Order history and owner-updated delivery progress.", refreshOrders:"Refresh orders",
    trackingNotConfigured:"Online order tracking is not configured on this deployment yet. Orders placed through WhatsApp are enquiries and do not create a tracking record.",
    signInToOrders:"Sign in to view your orders.", customerSignIn:"Customer sign in",
    loadingOrders:"Loading your orders…", noTrackedOrders:"No tracked orders yet",
    trackedOrderHint:"A tracked order will appear here after you place it while signed in.",
    browseCatalogue:"Browse catalogue", itemsOrdered:"Items ordered", packNotListed:"Pack not listed",
    orderMrpTotal:"Order MRP total", ownerConfirmedTotal:"Owner-confirmed final total", reviewPublished:"Your review is published.",
    reviewModeration:"Your review is awaiting owner moderation.", trackingTimeline:"Tracking timeline",
    orderPlaced:"Order placed", orderAccepted:"Order accepted", packed:"Packed", shipped:"Shipped",
    inTransit:"In transit", outForDelivery:"Out for delivery", delivered:"Delivered",
    currentStatus:"Current status", done:"Done", expectedDelivery:"Expected delivery",
    deliveryDelayed:"Delivery Delayed Notice", storeUpdatedEta:"The store has updated the delivery estimate.",
    revisedDelivery:"Revised delivery", accountTitle:"Sign in or create account", backToStore:"Back to store", customerAccount:"Customer account", signedInAs:"Signed in as", openMyOrders:"Open My Orders", signOut:"Sign out", signIn:"Sign in", createAccount:"Create account", emailAddress:"Email address", password:"Password", passwordHint:"Use at least 8 characters. Your account is protected by the store database access policies.", pleaseWait:"Please wait…", createCustomerAccount:"Create customer account", accountCreatedNotice:"Account created. Check your email to confirm the address, then sign in.", signedOutNotice:"You have signed out.", accountServiceUnavailable:"Account service is not configured. Contact the store owner.", enterEmailPassword:"Enter an email and a password of at least 8 characters.", enterFullName:"Enter your full name.", accountRequestFailed:"Account request failed.", onlineAccountsNotConfigured:"Online customer accounts are not configured on this deployment yet. WhatsApp enquiry checkout remains available.", chooseRatingAndFields:"Choose a rating and complete all three review fields.", onlineReviewsUnavailable:"Online reviews are not configured yet.", signInReview:"Sign in to the account that placed this order.", reviewIdMissing:"The review service did not return a review ID.", photoWarning:" Review submitted, but one or more photos could not be attached.", reviewSubmitted:"Review submitted for owner moderation.", reviewSubmitFailed:"The review could not be submitted.", reviewProduct:"Review", rateProduct:"Product rating", packagingExperience:"Packaging experience", deliveryExperience:"Delivery experience", camera:"Camera", gallery:"Gallery", photosSelected:"photos selected", submitting:"Submitting…", submitVerifiedReview:"Submit verified review",customerReviews:"Customer ratings & reviews",
    approvedReviewsOnly:"Only approved reviews from delivered purchases are published.",
    verifiedReviews:"verified reviews", loadingReviews:"Loading verified reviews…",
    noVerifiedReviews:"No verified reviews yet",
    reviewsAfterDelivery:"Ratings appear after a customer receives the product, submits a review and the store approves it.",
    verifiedPurchase:"Verified purchase", productQuality:"Product quality", packaging:"Packaging",
    delivery:"Delivery", officialSource:"View official product source", openCart:"Open cart", closeCart:"Close cart", emptyCart:"Your cart is empty", cartItem:"Cart item", emptyCartHint:"Add catalogue items to see them here.", viewCart:"View cart", removeFromCart:"Remove item", decreaseQuantity:"Decrease quantity", increaseQuantity:"Increase quantity", itemSubtotal:"Item subtotal", language:"Language",
    heroSlide1Eyebrow:"HARI RAM AWPL", heroSlide1TitleA:"Everyday essentials,", heroSlide1TitleB:"beautifully organised.", heroSlide1Description:"Explore wellness, personal care, home and everyday ranges in one calm catalogue.",
    heroSlide2Eyebrow:"A CLEARER CATALOGUE", heroSlide2TitleA:"Find your range,", heroSlide2TitleB:"without the clutter.", heroSlide2Description:"Browse categories or find the right product by name and pack size.",
    heroSlide3Eyebrow:"SKU-FIRST SHOPPING", heroSlide3TitleA:"Every pack size,", heroSlide3TitleB:"listed separately.", heroSlide3Description:"Each captured pack size and apparel SKU has its own product card and cart line.",
    heroItemsSuffix:"individual product listings", heroCategorySuffix:"category filters", heroSkuDetail:"Separate product listings",
    exploreCatalogue:"Explore catalogue", storeHighlights:"Store highlights", previousHighlight:"Previous highlight", nextHighlight:"Next highlight", chooseHighlight:"Choose highlight",
    dailyCare:"Daily care", homeAndLiving:"Home & living", wellness:"Wellness",
    productPrefix:"Product", addProductVerb:"Add", toCart:"to cart",
    viewReviewPhoto:"View review photo", closePhoto:"Close photo", reviewPhotoAlt:"Customer-submitted product photo", perUnit:"per unit", trackedOrderReference:"Tracked order reference", orderRecordAvailable:"Your order record is available in My Orders.", orderCreationFailed:"Order creation failed. Please retry.", removeProduct:"Remove", decreaseProductQuantity:"Decrease", increaseProductQuantity:"Increase",

  },
  hi: {
    home:"होम", catalogue:"उत्पाद सूची", about:"हमारे बारे में", cart:"कार्ट", profile:"प्रोफ़ाइल",
    imageOfficial:"कंपनी की उत्पाद तस्वीर", imageFallback:"उदाहरण के लिए बनाई गई तस्वीर", pack:"पैक", notListed:"उल्लेख नहीं है",
    primaryNavigation:"मुख्य नेविगेशन", mobileNavigation:"मोबाइल नेविगेशन",
    productCatalogue:"उत्पाद सूची", search:"खोजें", searchCatalogue:"उत्पाद खोजें",
    switchToHindi:"भाषा हिन्दी में बदलें", switchToEnglish:"भाषा अंग्रेज़ी में बदलें",
    discoverRange:"हमारे उत्पाद देखें", browseByCategory:"श्रेणी चुनें या नाम और पैक के आकार से खोजें।",
    searchProducts:"उत्पाद खोजें", clearSearch:"खोज हटाएँ", clearFilters:"फ़िल्टर हटाएँ",
    products:"उत्पाद", product:"उत्पाद", lineMrp:"इस पंक्ति की कुल कीमत", mrpPerUnit:"सूची कीमत", spPerUnit:"बिक्री कीमत", noMatches:"कोई उत्पाद नहीं मिला",
    tryAnother:"दूसरा नाम, पैक का आकार या श्रेणी खोजें।", resetCatalogue:"सूची रीसेट करें",
    displayedMrpNotice:"ऑर्डर स्वीकार करने से पहले दिखाई गई कीमत और उपलब्धता की पुष्टि की जाएगी।",
    detailsReview:"जानकारी की जाँच", mrpReview:"कीमत की जाँच", mrpUnderReview:"कीमत की जाँच जारी है",
    listedMrp:"सूची कीमत", offerPrice:"ऑफ़र कीमत · सूची कीमत",
    addedToCart:"कार्ट में जोड़ दिया", addAnother:"एक और जोड़ें", addToCart:"कार्ट में जोड़ें",
    openProductHint:"उपलब्ध जानकारी और स्टोर से पुष्टि के लिए उत्पाद खोलें।",
    backToCatalogue:"उत्पाद सूची पर लौटें", productInformation:"उत्पाद की जानकारी",
    category:"श्रेणी", brand:"ब्रांड", notSpecified:"जानकारी उपलब्ध नहीं", packSize:"पैक का आकार",
    productCode:"उत्पाद कोड", addedDate:"सूची में जुड़ने की तारीख", notRecorded:"दर्ज नहीं है",
    lastVerified:"आखिरी बार जाँचा गया", catalogueVerified:"सूची की जानकारी जाँची गई",
    detailsUnderReview:"जानकारी की जाँच जारी है", priceInformation:"कीमत की जानकारी",
    currentSellingPrice:"मौजूदा बिक्री कीमत", confirmWithStore:"स्टोर से पुष्टि करें",
    currentPriceNotPublished:"जाँची गई उत्पाद सूची में बिक्री कीमत या ऑफ़र उपलब्ध नहीं है। ऑर्डर से पहले स्टोर से पुष्टि करें।",
    confirmBeforeOrdering:"यह सूची कीमत है। अंतिम बिक्री कीमत और डिलीवरी की पुष्टि स्टोर करेगा।",
    askStore:"स्टोर से पूछें", sellerSupport:"विक्रेता और सहायता", ownerStore:"मालिक · हरि राम AWPL स्टोर",
    contactSeller:"WhatsApp पर विक्रेता से संपर्क करें", descriptionUsage:"विवरण और उपयोग",
    descriptionMissing:"कंपनी ने इस उत्पाद का विवरण मौजूदा सूची में उपलब्ध नहीं कराया है। इस्तेमाल से पहले पैक पर दी जानकारी पढ़ें या स्टोर से पुष्टि करें।",
    ingredientsComposition:"सामग्री / संघटन", ingredientsMissing:"सामग्री और उपयोग के निर्देश दर्ज नहीं हैं। पैक पर दिए निर्देशों का पालन करें।",
    exploreMore:"और उत्पाद देखें", youMayAlsoLike:"आपको ये भी पसंद आ सकते हैं", viewFullCatalogue:"पूरी उत्पाद सूची देखें",
    continueBrowsing:"खरीदारी जारी रखें", yourSelection:"आपके चुने हुए उत्पाद", yourCart:"आपका कार्ट",
    itemSelected:"उत्पाद चुना गया", itemsSelected:"उत्पाद चुने गए", cartWaiting:"आपका कार्ट खाली है",
    addProducts:"सूची से उत्पाद जोड़ें। वे यहाँ दिखाई देंगे।", browseProducts:"उत्पाद देखें",
    orderSummary:"ऑर्डर का सार", items:"कुल उत्पाद", subtotalMrp:"उप-योग (सूची कीमत)",
    subtotalSp:"उप-योग (बिक्री कीमत)", totalMrp:"कुल (सूची कीमत)",
    continueWhatsApp:"WhatsApp पर आगे बढ़ें", createTrackedOrder:"ऑर्डर बनाया जा रहा है…",
    whatsappOpened:"WhatsApp पर पूछताछ खुल गई है। इस वेबसाइट पर ऑनलाइन ट्रैकिंग चालू नहीं है।",
    listedMrpRecorded:"अभी सूची कीमत दिखाई गई है। अंतिम बिक्री कीमत, उपलब्धता और डिलीवरी की पुष्टि मालिक करेगा।",
    viewMyOrders:"मेरे ऑर्डर देखें", deliveryInformation:"डिलीवरी की जानकारी", yourDetails:"आपकी जानकारी",
    profileIntro:"अपना संपर्क और डिलीवरी पता एक बार सुरक्षित करें। WhatsApp पर ऑर्डर पूछताछ तैयार करते समय ही ये जानकारी शामिल होगी।",
    customerProfile:"ग्राहक प्रोफ़ाइल", requiredFields:"* लगे सभी फ़ील्ड भरना ज़रूरी है",
    fullName:"पूरा नाम", mobileNumber:"मोबाइल नंबर", deliveryAddress:"डिलीवरी का पता",
    yourFullName:"अपना पूरा नाम लिखें", tenDigitMobile:"10 अंकों का मोबाइल नंबर",
    indianMobileHint:"+91 के साथ या उसके बिना भारतीय मोबाइल नंबर लिखें।",
    addressHint:"मकान / गली, पहचान का स्थान, शहर और पिन कोड", saveDetails:"जानकारी सुरक्षित करें",
    detailsSaved:"जानकारी सुरक्षित हो गई", completeNameAddress:"कृपया अपना नाम और डिलीवरी का पता भरें।",
    invalidMobile:"10 अंकों का सही भारतीय मोबाइल नंबर लिखें.",
    customerAccountSignin:"ग्राहक खाता / साइन इन", myOrders:"मेरे ऑर्डर",
    deviceDetailsNotice:"यह जानकारी इसी डिवाइस पर रहती है और साइन इन करने पर ग्राहक प्रोफ़ाइल से जुड़ती है। केवल WhatsApp पूछताछ से ऑनलाइन ट्रैकिंग रिकॉर्ड नहीं बनता।",
    returnToCart:"जानकारी सुरक्षित करने के बाद आप कार्ट पर लौटेंगे।", loadingProfile:"प्रोफ़ाइल खुल रही है…",
    backToProfile:"प्रोफ़ाइल पर लौटें", orderCentre:"ऑर्डर केंद्र",
    orderHistory:"ऑर्डर का इतिहास और स्टोर द्वारा अपडेट की गई डिलीवरी जानकारी।", refreshOrders:"ऑर्डर रीफ़्रेश करें",
    trackingNotConfigured:"इस वेबसाइट पर ऑनलाइन ऑर्डर ट्रैकिंग अभी चालू नहीं है। WhatsApp से भेजी गई पूछताछ का ट्रैकिंग रिकॉर्ड नहीं बनता।",
    signInToOrders:"अपने ऑर्डर देखने के लिए साइन इन करें।", customerSignIn:"ग्राहक साइन इन",
    loadingOrders:"आपके ऑर्डर खुल रहे हैं…", noTrackedOrders:"अभी कोई ट्रैक किया गया ऑर्डर नहीं है",
    trackedOrderHint:"साइन इन करके ऑर्डर देने के बाद उसकी जानकारी यहाँ दिखाई देगी।",
    browseCatalogue:"उत्पाद सूची देखें", itemsOrdered:"ऑर्डर किए गए उत्पाद", packNotListed:"पैक का आकार दर्ज नहीं है",
    orderMrpTotal:"ऑर्डर की सूची कीमत", ownerConfirmedTotal:"मालिक द्वारा पुष्टि की गई अंतिम कीमत", reviewPublished:"आपकी समीक्षा प्रकाशित हो गई है।",
    reviewModeration:"आपकी समीक्षा स्टोर की जाँच के लिए भेज दी गई है।", trackingTimeline:"ऑर्डर की स्थिति",
    orderPlaced:"ऑर्डर दर्ज हुआ", orderAccepted:"ऑर्डर स्वीकार हुआ", packed:"पैक कर दिया गया",
    shipped:"भेज दिया गया", inTransit:"रास्ते में है", outForDelivery:"डिलीवरी के लिए निकला",
    delivered:"डिलीवर हो गया", currentStatus:"मौजूदा स्थिति", done:"पूरा",
    expectedDelivery:"डिलीवरी की संभावित तारीख", deliveryDelayed:"डिलीवरी में देरी की सूचना",
    storeUpdatedEta:"स्टोर ने डिलीवरी का नया अनुमान दिया है।", revisedDelivery:"नई डिलीवरी तारीख",
    accountTitle:"साइन इन करें या खाता बनाएँ", backToStore:"स्टोर पर लौटें", customerAccount:"ग्राहक खाता", signedInAs:"इस खाते से साइन इन हैं", openMyOrders:"मेरे ऑर्डर खोलें", signOut:"साइन आउट", signIn:"साइन इन", createAccount:"खाता बनाएँ", emailAddress:"ईमेल पता", password:"पासवर्ड", passwordHint:"कम से कम 8 अक्षरों का पासवर्ड रखें। आपका खाता स्टोर के सुरक्षित डेटाबेस नियमों से सुरक्षित है।", pleaseWait:"कृपया प्रतीक्षा करें…", createCustomerAccount:"ग्राहक खाता बनाएँ", accountCreatedNotice:"खाता बन गया है। ईमेल में पते की पुष्टि करें, फिर साइन इन करें।", signedOutNotice:"आप साइन आउट हो गए हैं।", accountServiceUnavailable:"खाता सेवा सेट नहीं है। स्टोर संचालक से संपर्क करें।", enterEmailPassword:"ईमेल और कम से कम 8 अक्षरों का पासवर्ड लिखें।", enterFullName:"अपना पूरा नाम लिखें।", accountRequestFailed:"खाते का अनुरोध पूरा नहीं हुआ।", onlineAccountsNotConfigured:"इस वेबसाइट पर ऑनलाइन ग्राहक खाते अभी सेट नहीं हैं। WhatsApp से पूछताछ करके ऑर्डर जारी रखा जा सकता है।", chooseRatingAndFields:"रेटिंग चुनें और तीनों समीक्षा वाले फ़ील्ड भरें।", onlineReviewsUnavailable:"ऑनलाइन समीक्षाएँ अभी सेट नहीं हैं।", signInReview:"इस ऑर्डर वाले ग्राहक खाते से साइन इन करें।", reviewIdMissing:"समीक्षा सेवा से समीक्षा आईडी नहीं मिली।", photoWarning:" समीक्षा भेज दी गई, लेकिन एक या अधिक तस्वीरें नहीं जुड़ सकीं।", reviewSubmitted:"समीक्षा स्टोर की मंज़ूरी के लिए भेज दी गई है।", reviewSubmitFailed:"समीक्षा भेजी नहीं जा सकी।", reviewProduct:"समीक्षा", rateProduct:"उत्पाद की रेटिंग", packagingExperience:"पैकिंग का अनुभव", deliveryExperience:"डिलीवरी का अनुभव", camera:"कैमरा", gallery:"गैलरी", photosSelected:"तस्वीरें चुनी गईं", submitting:"भेजा जा रहा है…", submitVerifiedReview:"सत्यापित समीक्षा भेजें",customerReviews:"ग्राहकों की रेटिंग और समीक्षाएँ", approvedReviewsOnly:"यहाँ केवल डिलीवर हुए ऑर्डर की स्वीकृत समीक्षाएँ दिखाई जाती हैं।",
    verifiedReviews:"सत्यापित समीक्षाएँ", loadingReviews:"सत्यापित समीक्षाएँ खुल रही हैं…",
    noVerifiedReviews:"अभी कोई सत्यापित समीक्षा नहीं है",
    reviewsAfterDelivery:"ग्राहक को उत्पाद मिलने, समीक्षा भेजने और स्टोर की मंज़ूरी के बाद रेटिंग दिखाई जाती है।",
    verifiedPurchase:"सत्यापित खरीद", productQuality:"उत्पाद की गुणवत्ता", packaging:"पैकिंग",
    delivery:"डिलीवरी", officialSource:"कंपनी की मूल उत्पाद सूची देखें", openCart:"कार्ट खोलें", closeCart:"कार्ट बंद करें", emptyCart:"आपका कार्ट खाली है", cartItem:"कार्ट का उत्पाद", emptyCartHint:"उत्पाद सूची से सामान जोड़ें। वे यहाँ दिखाई देंगे।", viewCart:"कार्ट देखें", removeFromCart:"उत्पाद हटाएँ", decreaseQuantity:"मात्रा घटाएँ", increaseQuantity:"मात्रा बढ़ाएँ", itemSubtotal:"उत्पाद का कुल", language:"भाषा",
    heroSlide1Eyebrow:"हरि राम AWPL स्टोर", heroSlide1TitleA:"रोज़मर्रा की ज़रूरतें,", heroSlide1TitleB:"एक ही जगह, सलीके से।", heroSlide1Description:"वेलनेस, व्यक्तिगत देखभाल, घर और रोज़मर्रा के उत्पाद एक ही सूची में देखें।",
    heroSlide2Eyebrow:"आसान उत्पाद सूची", heroSlide2TitleA:"अपनी ज़रूरत का सामान,", heroSlide2TitleB:"बिना उलझन के खोजें।", heroSlide2Description:"श्रेणियों में देखें या नाम और पैक के आकार से सही उत्पाद खोजें।",
    heroSlide3Eyebrow:"हर SKU अलग", heroSlide3TitleA:"हर पैक का आकार,", heroSlide3TitleB:"अलग से सूचीबद्ध।", heroSlide3Description:"हर पैक आकार और कपड़ों का हर SKU अपने अलग उत्पाद कार्ड और कार्ट में दिखता है।",
    heroItemsSuffix:"अलग-अलग उत्पाद", heroCategorySuffix:"उत्पाद श्रेणियाँ", heroSkuDetail:"अलग-अलग उत्पाद सूची",
    exploreCatalogue:"उत्पाद सूची देखें", storeHighlights:"स्टोर की खास बातें", previousHighlight:"पिछली जानकारी", nextHighlight:"अगली जानकारी", chooseHighlight:"जानकारी चुनें",
    dailyCare:"रोज़मर्रा की देखभाल", homeAndLiving:"घर और रोज़मर्रा का सामान", wellness:"वेलनेस",
    productPrefix:"उत्पाद", addProductVerb:"जोड़ें", toCart:"कार्ट में",
    viewReviewPhoto:"समीक्षा की तस्वीर देखें", closePhoto:"तस्वीर बंद करें", reviewPhotoAlt:"ग्राहक द्वारा भेजी गई उत्पाद की तस्वीर", perUnit:"प्रति इकाई", trackedOrderReference:"ऑर्डर संदर्भ संख्या", orderRecordAvailable:"आपके ऑर्डर की जानकारी मेरे ऑर्डर में उपलब्ध है।", orderCreationFailed:"ऑर्डर नहीं बन पाया। कृपया दोबारा कोशिश करें।", removeProduct:"हटाएँ", decreaseProductQuantity:"मात्रा घटाएँ", increaseProductQuantity:"मात्रा बढ़ाएँ",

  },
} as const;

type Key = keyof typeof dictionaries.en;
const categories: Record<string,string> = {
  All:"सभी", Agriculture:"कृषि", Apparels:"परिधान", "Baby Care":"शिशु देखभाल",
  Food:"खाद्य पदार्थ", "Home Care":"घरेलू उपयोग", Jeeveda:"जीवेदा",
  "Oral Care":"मौखिक देखभाल", Others:"अन्य", "SNISS Cosmetic":"SNISS कॉस्मेटिक्स",
  "SNISS Elite":"SNISS एलीट", "SNISS Fragrances":"SNISS सुगंध", "SNISS Herbal":"SNISS हर्बल",
  Veterinary:"पशु चिकित्सा", Wellness:"वेलनेस", Wellroot:"वेलरूट",
};
type ProductLike = { id:string; name:string; nameHi?:string|null };
type ContextValue = {
  locale:Locale; setLocale:(locale:Locale)=>void; t:(key:Key)=>string;
  categoryLabel:(name:string)=>string; productName:(product:ProductLike)=>string;
};
const LanguageContext=createContext<ContextValue|null>(null);

export function LanguageProvider({children}:{children:React.ReactNode}) {
  const [locale,setLocaleState]=useState<Locale>("en");
  useEffect(()=>{
    const saved=window.localStorage.getItem("hari-ram-awpl-locale");
    if(saved==="hi"||saved==="en") setLocaleState(saved);
  },[]);
  useEffect(()=>{document.documentElement.lang=locale;},[locale]);
  const setLocale=useCallback((next:Locale)=>{
    window.localStorage.setItem("hari-ram-awpl-locale",next);
    setLocaleState(next);
  },[]);
  const value=useMemo<ContextValue>(()=>({
    locale,setLocale,
    t:(key)=>dictionaries[locale][key]??dictionaries.en[key],
    categoryLabel:(name)=>locale==="hi"?categories[name]??name:name,
    productName:(product)=>locale==="hi"?product.nameHi?.trim()||localizedProductName(product.name):product.name,
  }),[locale,setLocale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){
  const value=useContext(LanguageContext);
  if(!value) throw new Error("useLanguage must be used inside LanguageProvider.");
  return value;
}
