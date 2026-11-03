-- Hari Ram AWPL Store commerce foundation. Apply once in Supabase SQL Editor.
-- The service-role key must never be exposed to the browser.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '', phone text not null default '', address text not null default '',
 role text not null default 'customer' check (role in ('customer','owner')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,display_name,role) values(new.id,coalesce(new.raw_user_meta_data->>'display_name',''),'customer') on conflict(id) do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.products (
 id text primary key, name text not null, category text not null, pack_size text not null default '',
 mrp numeric(12,2) not null check(mrp>=0), selling_price numeric(12,2) null check(selling_price is null or selling_price>=0),
 image_url text null, image_status text not null default 'MISSING', product_status text not null default 'VERIFIED',
 availability text not null default 'UNKNOWN', updated_at timestamptz not null default now()
);
insert into public.products(id,name,category,pack_size,mrp,selling_price,image_url,image_status,product_status,availability)
values
('awpl-apparels-asclepius-women-saree-crape','ASCLEPIUS WOMEN SAREE CRAPE','apparels','1 NUMBER',2099,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-women-suits','ASCLEPIUS WOMEN SUITS','apparels','1 NUMBER',2099,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-tie-black','ASCLEPIUS TIE - BLACK','apparels','1 NUMBER',559,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-t-shirt-olive-s','ASCLEPIUS T SHIRT - OLIVE (S)','apparels','1 NUMBER',2559,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-t-shirt-light-blue-s','ASCLEPIUS T SHIRT - LIGHT BLUE (S)','apparels','1 NUMBER',2559,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-t-shirt-teal-s','ASCLEPIUS T SHIRT - TEAL (S)','apparels','1 NUMBER',2559,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-t-shirt-black-s','ASCLEPIUS T SHIRT - BLACK (S)','apparels','1 NUMBER',2559,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-t-shirt-ivory-s','ASCLEPIUS T SHIRT - IVORY (S)','apparels','1 NUMBER',2559,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-women-t-shirt-ivory-xs','ASCLEPIUS WOMEN T-SHIRT - IVORY (XS)','apparels','1 NUMBER',2295,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-women-t-shirt-light-blue-xs','ASCLEPIUS WOMEN T-SHIRT - LIGHT BLUE (XS)','apparels','1 NUMBER',2295,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-women-t-shirt-teal-l','ASCLEPIUS WOMEN T-SHIRT - TEAL (L)','apparels','1 NUMBER',2295,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-women-t-shirt-black-xs','ASCLEPIUS WOMEN T-SHIRT - BLACK (XS)','apparels','1 NUMBER',2295,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-apparels-asclepius-women-t-shirt-olive-xs','ASCLEPIUS WOMEN T-SHIRT - OLIVE (XS)','apparels','1 NUMBER',2295,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-baby-care-little-pie-baby-shampoo','LITTLE PIE BABY SHAMPOO','baby-care','100 ML',155,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-baby-care-little-pie-soothing-baby-gentle-soap','LITTLE PIE SOOTHING BABY GENTLE SOAP','baby-care','75 GM',258,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-baby-care-little-pie-baby-lotion','LITTLE PIE BABY LOTION','baby-care','100 ML',245,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-food-eco-arogyam-multiflora-honey-new','ECO AROGYAM MULTIFLORA HONEY (NEW)','food','500 GM',531,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-food-eco-arogyam-tea','ECO AROGYAM TEA','food','250 GM',197,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-bathveda-fresh-lime-bar','BATHVEDA FRESH LIME BAR','home-care','375 GM',234,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-bathveda-mysore-sandal-soap','BATHVEDA MYSORE SANDAL SOAP','home-care','375 GM',261,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-bathveda-neem-tulsi-bar','BATHVEDA NEEM TULSI BAR','home-care','375 GM',216,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-bathveda-beauty-cream-bar','BATHVEDA BEAUTY CREAM BAR','home-care','375 GM',216,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-bathveda-goat-milk-bar','BATHVEDA GOAT MILK BAR','home-care','375 GM',384,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-bathveda-glycerin-natural-oil-bar','BATHVEDA GLYCERIN NATURAL OIL BAR','home-care','375 GM',216,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-limfresh-liquid-dish-wash','LIMFRESH LIQUID DISH WASH','home-care','500 ML',133,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-toshine-liquid-wash','TOSHINE LIQUID WASH','home-care','1000 ML',271,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-toshine-detergent-powder','TOSHINE DETERGENT POWDER','home-care','1000 GM',198,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-easy-sweep-surface-cleaner','EASY SWEEP SURFACE CLEANER','home-care','500 ML',133,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-power-flush-toilet-cleaner','POWER FLUSH TOILET CLEANER','home-care','500 ML',125,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-toshine-winterwear-liquid-wash','TOSHINE WINTERWEAR LIQUID WASH','home-care','1000 ML',266,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-toshine-detergent-bar','TOSHINE DETERGENT BAR','home-care','3 NUMBER',120,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-limfresh-dish-wash-bar','LIMFRESH DISH WASH BAR','home-care','3 NUMBER',129,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-home-care-room-freshner-musk','ROOM FRESHNER (MUSK)','home-care','200 ML',325,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-rice-bran-oil-2-ltr','JEEVEDA RICE BRAN OIL (2 LTR)','jeeveda','2 LTR',699,null,null,'MISSING','PRICE_REVIEW_REQUIRED','UNKNOWN'),
('awpl-jeeveda-jeeveda-rice-bran-oil-5-ltr','JEEVEDA RICE BRAN OIL (5 LTR)','jeeveda','5 LTR',1743,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-chhole-chana-masala','JEEVEDA CHHOLE CHANA MASALA','jeeveda','100 GM',139,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-chicken-masala','JEEVEDA CHICKEN MASALA','jeeveda','100 GM',147,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-dal-makhani-masala','JEEVEDA DAL MAKHANI MASALA','jeeveda','100 GM',161,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-fish-masala','JEEVEDA FISH MASALA','jeeveda','100 GM',153,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-garam-masala','JEEVEDA GARAM MASALA','jeeveda','100 GM',167,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-kitchen-king-masala','JEEVEDA KITCHEN KING MASALA','jeeveda','100 GM',139,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-mutton-masala','JEEVEDA MUTTON MASALA','jeeveda','100 GM',125,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-nigella-seeds-kalonji','JEEVEDA NIGELLA SEEDS - KALONJI','jeeveda','50 GM',77,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-fenugreek-seeds-methi-dana','JEEVEDA FENUGREEK SEEDS - METHI DANA','jeeveda','100 GM',69,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-mustard-seeds-rai','JEEVEDA MUSTARD SEEDS - RAI','jeeveda','100 GM',55,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-clove-laung','JEEVEDA CLOVE - LAUNG','jeeveda','50 GM',167,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-cinnamon-sticks-dalchini','JEEVEDA CINNAMON STICKS - DALCHINI','jeeveda','50 GM',111,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-bay-leaf-tej-patta','JEEVEDA BAY LEAF - TEJ PATTA','jeeveda','25 GM',60,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-fenugreek-leaves-kasoori-methi','FENUGREEK LEAVES - KASOORI METHI','jeeveda','50 GM',88,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-chilli-powder-100-gm','CHILLI POWDER - 100 GM','jeeveda','100 GM',105,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-turmeric-powder-500-gm','TURMERIC POWDER - 500 GM','jeeveda','500 GM',335,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-coriander-powder-100-gm','CORIANDER POWDER - 100 GM','jeeveda','100 GM',76,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-jeeveda-jeeveda-rice-bran-oil-1-ltr','JEEVEDA RICE BRAN OIL (1 LTR)','jeeveda','1 LTR',399,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-oral-care-dentodoc-cream','DENTODOC CREAM','oral-care','100 GM',232,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-others-back-pack','BACK PACK','others','1 NUMBER',1679,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-prep-it-primer','PREP-IT PRIMER','sniss-cosmetic','30 ML',1329,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-lift-and-sculpt-concealer-ivory-play','LIFT AND SCULPT CONCEALER - IVORY PLAY','sniss-cosmetic','4 ML',909,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-ultra-smooth-foundation-for-radiant-glow-creamy-vanilla','ULTRA SMOOTH FOUNDATION FOR RADIANT GLOW - CREAMY VANILLA','sniss-cosmetic','30 ML',1049,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-color-drew-blush-stick-flirty','COLOR DREW BLUSH STICK - FLIRTY','sniss-cosmetic','4 ML',559,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-blurr-loose-powder-white-touch','BLURR LOOSE POWDER - WHITE TOUCH','sniss-cosmetic','15 GM',1245,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-lumitouch-compact-powder-soft-sand','LUMITOUCH COMPACT POWDER - SOFT SAND','sniss-cosmetic','9 GM',979,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-powder-blush-nasty','POWDER BLUSH - NASTY','sniss-cosmetic','3 GM',909,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-eyeliner-holographic-peacock-green-halo','EYELINER HOLOGRAPHIC - PEACOCK GREEN HALO','sniss-cosmetic','1 ML',279,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-eyeliner-metallic-rose-gold','EYELINER METALLIC - ROSE GOLD','sniss-cosmetic','3 ML',979,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-matt-eye-liner-black','MATT EYE LINER BLACK','sniss-cosmetic','3 ML',867,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-kajal-retractable','KAJAL RETRACTABLE','sniss-cosmetic','0 GM',349,null,null,'MISSING','MISSING_DATA','UNKNOWN'),
('awpl-sniss-cosmetic-flick-lift-mascara','FLICK&LIFT MASCARA','sniss-cosmetic','5 ML',699,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-all-day-luxe-cream-lipstick-dusky-rose','ALL DAY LUXE CREAM LIPSTICK - DUSKY ROSE','sniss-cosmetic','3 GM',699,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-luxe-matte-liquid-lipstick-fine-wine','LUXE MATTE LIQUID LIPSTICK - FINE WINE','sniss-cosmetic','3 ML',517,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-juicy-lip-balm-vanilla','JUICY LIP BALM - VANILLA','sniss-cosmetic','4 GM',406,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-skin-tint-luminous-veil-radiant-sand','SKIN TINT LUMINOUS VEIL - RADIANT SAND','sniss-cosmetic','30 ML',1399,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-luxe-lips-definer-blossom','LUXE LIPS DEFINER - BLOSSOM','sniss-cosmetic','1 GM',979,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-strobe-cream-dewy-glow-flamingo','STROBE CREAM DEWY GLOW - FLAMINGO','sniss-cosmetic','25 ML',1399,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-silk-shein-luxe-lip-gloss-strawberry-flush','SILK SHEIN LUXE LIP GLOSS - STRAWBERRY FLUSH','sniss-cosmetic','2 ML',391,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-sindoor-red','SINDOOR - RED','sniss-cosmetic','5 ML',141,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-cosmetic-mirror-finish-corrector-concealer-green','MIRROR FINISH CORRECTOR CONCEALER - GREEN','sniss-cosmetic','4 ML',629,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-charcoal-face-wash','CHARCOAL FACE WASH','sniss-elite','100 ML',419,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T27911_714131.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-vitamin-c-face-wash','VITAMIN C FACE WASH','sniss-elite','100 ML',357,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28011_503369.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-hydrating-face-wash','HYDRATING FACE WASH','sniss-elite','100 ML',357,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28111_982416.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-aloevera-cucumber-gel','ALOEVERA CUCUMBER GEL','sniss-elite','300 ML',371,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28211_045696.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-aloevera-turmeric-gel','ALOEVERA TURMERIC GEL','sniss-elite','300 ML',371,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28311_456748.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-aloevera-pink-gel','ALOEVERA PINK GEL','sniss-elite','300 ML',371,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28411_374297.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-hyaluronic-acid-face-moisturizer','HYALURONIC ACID FACE MOISTURIZER','sniss-elite','50 GM',770,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28511_818334.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-24k-gold-face-moisturizer','24K GOLD FACE MOISTURIZER','sniss-elite','50 GM',770,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28611_574415.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-under-eye-cream','UNDER EYE CREAM','sniss-elite','15 GM',699,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28711_985351.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-vitamin-c-face-toner','VITAMIN C FACE TONER','sniss-elite','100 ML',629,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28811_670815.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-hyaluronic-acid-with-snail-mu','HYALURONIC ACID WITH SNAIL MU','sniss-elite','30 ML',699,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T28911_247730.jpg','VERIFIED','MISSING_DATA','UNKNOWN'),
('awpl-sniss-elite-vitamin-c-face-serum','VITAMIN C FACE SERUM','sniss-elite','30 ML',749,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29011_784635.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-niacinamide-face-serum','NIACINAMIDE FACE SERUM','sniss-elite','30 ML',699,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29111_895776.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-24k-gold-face-serum','24K GOLD FACE SERUM','sniss-elite','30 ML',769,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29211_318004.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-hair-growth-serum','HAIR GROWTH SERUM','sniss-elite','30 ML',699,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29311_376341.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-salicylic-acid-face-sheet-mask','SALICYLIC ACID FACE SHEET MASK','sniss-elite','20 ML',315,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29411_175761.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-aha-bha-face-sheet-mask','AHA + BHA FACE SHEET MASK','sniss-elite','20 ML',315,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29511_356907.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-kojic-acid-face-sheet-mask','KOJIC ACID FACE SHEET MASK','sniss-elite','20 ML',315,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29611_980912.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-collagen-peptide-face-sheet','COLLAGEN + PEPTIDE FACE SHEET','sniss-elite','20 ML',315,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29711_240207.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-de-tan-facial-sheet-mask','DE-TAN FACIAL SHEET MASK','sniss-elite','20 ML',315,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T29811_161425.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-handwash','HANDWASH','sniss-elite','250 ML',175,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T17411_751431.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-sunscreen-spf50-pa-gel','SUNSCREEN SPF50 PA++++ GEL','sniss-elite','50 GM',405,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-handwash-refilling','HANDWASH REFILLING','sniss-elite','1000 ML',388,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T17511_640592.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-elite-lavender-sunsreen-stickbroad-specturm-spf50-pa','LAVENDER SUNSREEN STICKBROAD SPECTURM SPF50 PA++++','sniss-elite','20 GM',769,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T30011_959155.jpg','VERIFIED','MISSING_DATA','UNKNOWN'),
('awpl-sniss-fragrances-orella-perfume','ORELLA PERFUME','sniss-fragrances','75 ML',1073,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-fragrances-nebel-perfume','NEBEL PERFUME','sniss-fragrances','75 ML',1073,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-fragrances-sniss-revoque','SNISS REVOQUE','sniss-fragrances','150 ML',406,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-fragrances-sniss-london-xi','SNISS LONDON XI','sniss-fragrances','150 ML',406,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-hairdoc-oil','HAIRDOC OIL','sniss-herbal','100 ML',229,null,null,'MISSING','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-hair-shine-oint-conditioner','HAIR SHINE OINT - CONDITIONER','sniss-herbal','100 ML',363,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35911_600144.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-almond-olive-hair-oil','ALMOND OLIVE HAIR OIL','sniss-herbal','100 ML',111,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36311_622886.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-amla-hair-oil','AMLA HAIR OIL','sniss-herbal','100 ML',105,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36411_785974.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-ayucoco-hair-oil','AYUCOCO HAIR OIL','sniss-herbal','100 ML',154,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36511_855352.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-aloevera-cucumber-cream','ALOEVERA CUCUMBER CREAM','sniss-herbal','50 GM',314,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34611_512890.jpeg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-cool-oil','COOL OIL','sniss-herbal','100 ML',115,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36611_933896.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-face-scrub-cream','FACE SCRUB CREAM','sniss-herbal','50 GM',328,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34711_407525.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-daily-care-shampoo','DAILY CARE SHAMPOO','sniss-herbal','100 ML',111,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36711_712007.jpeg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-day-cream','DAY CREAM','sniss-herbal','50 GM',358,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34811_653617.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-ultra-smoothing-shampoo','ULTRA SMOOTHING SHAMPOO','sniss-herbal','100 ML',123,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36811_997809.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-v-splash','V SPLASH','sniss-herbal','100 ML',310,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T34911_578627.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-night-cream-womens','NIGHT CREAM WOMENS','sniss-herbal','50 GM',377,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35011_852379.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-damage-repair-shampoo','DAMAGE REPAIR SHAMPOO','sniss-herbal','100 ML',148,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36911_943238.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-root-shine-shampoo','ROOT & SHINE SHAMPOO','sniss-herbal','100 ML',136,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37011_903292.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-all-day-glow-cream-for-women','ALL DAY GLOW CREAM FOR WOMEN','sniss-herbal','50 GM',372,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35111_178499.jpeg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-moisturising-cream','MOISTURISING CREAM','sniss-herbal','50 GM',258,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35211_026549.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-ultra-smoothing-serum','ULTRA SMOOTHING SERUM','sniss-herbal','50 ML',279,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36211_446334.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-herbal-face-wash','HERBAL FACE WASH','sniss-herbal','100 GM',335,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35311_953694.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-strawberry-face-wash','STRAWBERRY FACE WASH','sniss-herbal','100 GM',237,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35411_446426.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-lip-balm','LIP BALM','sniss-herbal','10 GM',69,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35611_773222.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-body-lotion','BODY LOTION','sniss-herbal','200 ML',433,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35711_578145.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-aloevera-saffron-oint-gel','ALOEVERA SAFFRON OINT GEL','sniss-herbal','50 GM',337,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T35811_936157.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-face-pack-cream','FACE PACK CREAM','sniss-herbal','50 GM',335,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36011_993079.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-peel-off-face-mask','PEEL OFF FACE MASK','sniss-herbal','100 GM',251,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37211_890672.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-aloevera-orange-shower-gel','ALOEVERA ORANGE SHOWER GEL','sniss-herbal','250 ML',321,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37311_745262.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-aloevera-shower-gel','ALOEVERA SHOWER GEL','sniss-herbal','250 ML',357,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T36111_493236.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-talcum-powder','TALCUM POWDER','sniss-herbal','100 GM',156,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T37711_813597.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-shaving-cream-for-men','SHAVING CREAM FOR MEN','sniss-herbal','75 GM',123,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T38811_316464.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-hair-cleanser-shampoo','HAIR CLEANSER - SHAMPOO','sniss-herbal','100 ML',224,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T51311_348887.jpg','VERIFIED','VERIFIED','UNKNOWN'),
('awpl-sniss-herbal-hairdoc-oil-200-ml','HAIRDOC OIL 200 ML','sniss-herbal','200 ML',431,null,'https://awpl-kycdocs.s3.ap-south-1.amazonaws.com/upload1/product/_T51411_042878.jpg','VERIFIED','VERIFIED','UNKNOWN')
on conflict(id) do update set name=excluded.name,category=excluded.category,pack_size=excluded.pack_size,mrp=excluded.mrp,
 image_url=excluded.image_url,image_status=excluded.image_status,product_status=excluded.product_status,
 availability=excluded.availability,updated_at=now();

create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 order_code text not null unique default('HR-'||to_char(now(),'YYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
 customer_id uuid not null references public.profiles(id), customer_name text not null, customer_phone text not null, delivery_address text not null,
 status text not null default 'ORDER_PLACED' check(status in('ORDER_PLACED','ORDER_ACCEPTED','PACKED','SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED','CANCELLED')),
 availability_confirmed boolean not null default false, mrp_total numeric(12,2) not null default 0, selling_total numeric(12,2) not null default 0,
 eta_start timestamptz null, eta_end timestamptz null, delay_notice text null, owner_message text null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 product_id text not null references public.products(id), product_name text not null, pack_size text not null default '',
 quantity integer not null check(quantity between 1 and 50), mrp_each numeric(12,2) not null,
 selling_each numeric(12,2) null, image_url text null, created_at timestamptz not null default now()
);
create table if not exists public.order_updates (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 status text not null, message text not null default '', eta_start timestamptz null, eta_end timestamptz null,
 created_by uuid null references public.profiles(id), created_at timestamptz not null default now()
);
create table if not exists public.reviews (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 customer_id uuid not null references public.profiles(id), product_id text not null references public.products(id),
 rating smallint not null check(rating between 1 and 5), quality_rating smallint not null check(quality_rating between 1 and 5),
 packaging_rating smallint not null check(packaging_rating between 1 and 5), delivery_rating smallint not null check(delivery_rating between 1 and 5),
 product_quality text not null default '', packaging_experience text not null default '', delivery_experience text not null default '',
 is_verified_purchase boolean not null default true, is_published boolean not null default false, moderation_note text null,
 created_at timestamptz not null default now(), unique(order_id,product_id)
);
create table if not exists public.review_images (
 id uuid primary key default gen_random_uuid(), review_id uuid not null references public.reviews(id) on delete cascade,
 storage_path text not null unique, created_at timestamptz not null default now()
);
create index if not exists orders_customer_created_idx on public.orders(customer_id,created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_updates_order_created_idx on public.order_updates(order_id,created_at);
create index if not exists reviews_product_published_idx on public.reviews(product_id,is_published,created_at desc);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_updates enable row level security;
alter table public.reviews enable row level security;
alter table public.review_images enable row level security;

create or replace function public.is_store_owner() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='owner');
$$;
drop policy if exists profiles_read_self_or_owner on public.profiles;
create policy profiles_read_self_or_owner on public.profiles for select to authenticated using(id=auth.uid() or public.is_store_owner());
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
revoke all on public.profiles from anon,authenticated;
grant select on public.profiles to authenticated;
grant update(display_name,phone,address,updated_at) on public.profiles to authenticated;

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select to anon,authenticated using(true);
drop policy if exists products_owner_update on public.products;
create policy products_owner_update on public.products for update to authenticated using(public.is_store_owner()) with check(public.is_store_owner());
grant select on public.products to anon,authenticated;
grant update(name,category,pack_size,mrp,selling_price,image_url,image_status,product_status,availability,updated_at) on public.products to authenticated;

drop policy if exists orders_customer_or_owner_read on public.orders;
create policy orders_customer_or_owner_read on public.orders for select to authenticated using(customer_id=auth.uid() or public.is_store_owner());
grant select on public.orders to authenticated;
revoke insert,update,delete on public.orders from anon,authenticated;
drop policy if exists order_items_customer_or_owner_read on public.order_items;
create policy order_items_customer_or_owner_read on public.order_items for select to authenticated
using(exists(select 1 from public.orders o where o.id=order_id and(o.customer_id=auth.uid() or public.is_store_owner())));
grant select on public.order_items to authenticated;
revoke insert,update,delete on public.order_items from anon,authenticated;
drop policy if exists order_updates_customer_or_owner_read on public.order_updates;
create policy order_updates_customer_or_owner_read on public.order_updates for select to authenticated
using(exists(select 1 from public.orders o where o.id=order_id and(o.customer_id=auth.uid() or public.is_store_owner())));
grant select on public.order_updates to authenticated;
revoke insert,update,delete on public.order_updates from anon,authenticated;

drop policy if exists reviews_public_verified_read on public.reviews;
create policy reviews_public_verified_read on public.reviews for select to anon,authenticated using(is_verified_purchase=true and is_published=true);
drop policy if exists reviews_customer_read_own on public.reviews;
create policy reviews_customer_read_own on public.reviews for select to authenticated using(customer_id=auth.uid() or public.is_store_owner());
grant select on public.reviews to anon,authenticated;
revoke insert,update,delete on public.reviews from anon,authenticated;
drop policy if exists review_images_public_read on public.review_images;
create policy review_images_public_read on public.review_images for select to anon,authenticated
using(exists(select 1 from public.reviews r where r.id=review_id and r.is_verified_purchase and r.is_published));
drop policy if exists review_images_customer_read_own on public.review_images;
create policy review_images_customer_read_own on public.review_images for select to authenticated
using(exists(select 1 from public.reviews r where r.id=review_id and(r.customer_id=auth.uid() or public.is_store_owner())));
drop policy if exists review_images_customer_insert_own on public.review_images;
create policy review_images_customer_insert_own on public.review_images for insert to authenticated
with check(exists(select 1 from public.reviews r where r.id=review_id and r.customer_id=auth.uid()));
grant select,insert on public.review_images to authenticated;
grant select on public.review_images to anon;

create or replace function public.create_store_order(p_items jsonb,p_customer_name text,p_customer_phone text,p_delivery_address text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_order public.orders%rowtype; v_item jsonb; v_product public.products%rowtype;
 v_qty integer; v_mrp numeric(12,2):=0; v_sp numeric(12,2):=0;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 if length(trim(coalesce(p_customer_name,'')))<2 then raise exception 'CUSTOMER_NAME_REQUIRED'; end if;
 if p_customer_phone !~ '^[6-9][0-9]{9}$' then raise exception 'VALID_INDIAN_PHONE_REQUIRED'; end if;
 if length(trim(coalesce(p_delivery_address,'')))<8 then raise exception 'DELIVERY_ADDRESS_REQUIRED'; end if;
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)=0 then raise exception 'CART_EMPTY'; end if;
 insert into public.orders(customer_id,customer_name,customer_phone,delivery_address)
 values(v_user,trim(p_customer_name),p_customer_phone,trim(p_delivery_address)) returning * into v_order;
 for v_item in select value from jsonb_array_elements(p_items) loop
  v_qty:=(v_item->>'quantity')::integer;
  if v_qty<1 or v_qty>50 then raise exception 'INVALID_QUANTITY'; end if;
  select * into v_product from public.products where id=v_item->>'product_id' and product_status='VERIFIED';
  if not found then raise exception 'PRODUCT_NOT_ORDERABLE: %',v_item->>'product_id'; end if;
  insert into public.order_items(order_id,product_id,product_name,pack_size,quantity,mrp_each,selling_each,image_url)
  values(v_order.id,v_product.id,v_product.name,v_product.pack_size,v_qty,v_product.mrp,v_product.selling_price,v_product.image_url);
  v_mrp:=v_mrp+v_product.mrp*v_qty; v_sp:=v_sp+coalesce(v_product.selling_price,v_product.mrp)*v_qty;
 end loop;
 update public.orders set mrp_total=v_mrp,selling_total=v_sp,updated_at=now() where id=v_order.id returning * into v_order;
 insert into public.order_updates(order_id,status,message,created_by) values(v_order.id,'ORDER_PLACED','Order request created.',v_user);
 return jsonb_build_object('id',v_order.id,'order_code',v_order.order_code,'mrp_total',v_order.mrp_total,'selling_total',v_order.selling_total);
end; $$;

create or replace function public.owner_update_store_order(p_order_id uuid,p_action text,p_eta_start timestamptz default null,p_eta_end timestamptz default null,p_message text default '')
returns public.orders language plpgsql security definer set search_path=public as $$
declare v_order public.orders%rowtype; v_next text;
begin
 if not public.is_store_owner() then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 select * into v_order from public.orders where id=p_order_id for update;
 if not found then raise exception 'ORDER_NOT_FOUND'; end if;
 case p_action
  when 'CONFIRM_AVAILABILITY' then
   update public.orders set availability_confirmed=true,owner_message=nullif(trim(p_message),''),updated_at=now()
   where id=p_order_id returning * into v_order; v_next:=v_order.status;
  when 'ACCEPT_ORDER' then
   if not v_order.availability_confirmed then raise exception 'CONFIRM_AVAILABILITY_FIRST'; end if;
   if v_order.status<>'ORDER_PLACED' then raise exception 'INVALID_ORDER_TRANSITION'; end if; v_next:='ORDER_ACCEPTED';
  when 'MARK_PACKED' then v_next:='PACKED';
  when 'MARK_SHIPPED' then v_next:='SHIPPED';
  when 'IN_TRANSIT' then v_next:='IN_TRANSIT';
  when 'OUT_FOR_DELIVERY' then v_next:='OUT_FOR_DELIVERY';
  when 'MARK_DELIVERED' then v_next:='DELIVERED';
  when 'DELIVERY_DELAYED' then
   if p_eta_start is null or p_eta_end is null or p_eta_end<p_eta_start then raise exception 'VALID_REVISED_ETA_REQUIRED'; end if;
   update public.orders set eta_start=p_eta_start,eta_end=p_eta_end,
    delay_notice=coalesce(nullif(trim(p_message),''),'Delivery schedule revised by the store.'),
    owner_message=nullif(trim(p_message),''),updated_at=now() where id=p_order_id returning * into v_order;
   insert into public.order_updates(order_id,status,message,eta_start,eta_end,created_by)
   values(p_order_id,'DELIVERY_DELAYED',coalesce(nullif(trim(p_message),''),'Delivery schedule revised.'),p_eta_start,p_eta_end,auth.uid());
   return v_order;
  else raise exception 'UNKNOWN_ORDER_ACTION';
 end case;
 if p_action<>'CONFIRM_AVAILABILITY' then
  if not ((v_order.status='ORDER_PLACED' and v_next='ORDER_ACCEPTED') or
    (v_order.status='ORDER_ACCEPTED' and v_next='PACKED') or
    (v_order.status='PACKED' and v_next='SHIPPED') or
    (v_order.status='SHIPPED' and v_next='IN_TRANSIT') or
    (v_order.status='IN_TRANSIT' and v_next='OUT_FOR_DELIVERY') or
    (v_order.status='OUT_FOR_DELIVERY' and v_next='DELIVERED')) then raise exception 'INVALID_ORDER_TRANSITION'; end if;
  update public.orders set status=v_next,eta_start=coalesce(p_eta_start,eta_start),eta_end=coalesce(p_eta_end,eta_end),
   owner_message=nullif(trim(p_message),''),updated_at=now() where id=p_order_id returning * into v_order;
 end if;
 insert into public.order_updates(order_id,status,message,eta_start,eta_end,created_by)
 values(p_order_id,v_next,coalesce(nullif(trim(p_message),''),replace(v_next,'_',' ')),v_order.eta_start,v_order.eta_end,auth.uid());
 return v_order;
end; $$;

create or replace function public.submit_store_review(p_order_id uuid,p_product_id text,p_rating smallint,p_quality_rating smallint,
 p_packaging_rating smallint,p_delivery_rating smallint,p_product_quality text,p_packaging_experience text,p_delivery_experience text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_review_id uuid;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if not exists(select 1 from public.orders o join public.order_items i on i.order_id=o.id
  where o.id=p_order_id and o.customer_id=auth.uid() and o.status='DELIVERED' and i.product_id=p_product_id) then
  raise exception 'VERIFIED_DELIVERED_PURCHASE_REQUIRED';
 end if;
 insert into public.reviews(order_id,customer_id,product_id,rating,quality_rating,packaging_rating,delivery_rating,
  product_quality,packaging_experience,delivery_experience)
 values(p_order_id,auth.uid(),p_product_id,p_rating,p_quality_rating,p_packaging_rating,p_delivery_rating,
  left(coalesce(p_product_quality,''),1500),left(coalesce(p_packaging_experience,''),1500),left(coalesce(p_delivery_experience,''),1500))
 returning id into v_review_id;
 return v_review_id;
end; $$;

create or replace function public.moderate_store_review(p_review_id uuid,p_publish boolean,p_note text default '')
returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.is_store_owner() then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 update public.reviews set is_published=p_publish,moderation_note=nullif(trim(p_note),'') where id=p_review_id;
 if not found then raise exception 'REVIEW_NOT_FOUND'; end if;
end; $$;
revoke all on function public.create_store_order(jsonb,text,text,text) from public;
revoke all on function public.owner_update_store_order(uuid,text,timestamptz,timestamptz,text) from public;
revoke all on function public.submit_store_review(uuid,text,smallint,smallint,smallint,smallint,text,text,text) from public;
revoke all on function public.moderate_store_review(uuid,boolean,text) from public;
grant execute on function public.create_store_order(jsonb,text,text,text) to authenticated;
grant execute on function public.owner_update_store_order(uuid,text,timestamptz,timestamptz,text) to authenticated;
grant execute on function public.submit_store_review(uuid,text,smallint,smallint,smallint,smallint,text,text,text) to authenticated;
grant execute on function public.moderate_store_review(uuid,boolean,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('review-photos','review-photos',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists review_photo_public_read on storage.objects;
create policy review_photo_public_read on storage.objects for select to anon,authenticated using(bucket_id='review-photos');
drop policy if exists review_photo_customer_upload on storage.objects;
create policy review_photo_customer_upload on storage.objects for insert to authenticated with check(
 bucket_id='review-photos' and (storage.foldername(name))[1]=auth.uid()::text and
 exists(select 1 from public.orders o where o.id::text=(storage.foldername(name))[2] and o.customer_id=auth.uid() and o.status='DELIVERED')
);
drop policy if exists review_photo_customer_delete on storage.objects;
create policy review_photo_customer_delete on storage.objects for delete to authenticated
using(bucket_id='review-photos' and (storage.foldername(name))[1]=auth.uid()::text);
do $$ begin alter publication supabase_realtime add table public.orders; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.order_updates; exception when duplicate_object then null; end $$;

-- After the owner creates an account, run this privileged statement in Supabase SQL Editor:
-- update public.profiles set role='owner' where id='OWNER_AUTH_USER_UUID';
-- Do not place a service-role key in NEXT_PUBLIC_* variables.
