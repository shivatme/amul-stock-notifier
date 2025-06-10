// scrape.js
const axios = require("axios");
const sendNotification = require("./notify");
const cron = require("node-cron");

const EXPO_PUSH_TOKEN = "ExponentPushToken[OvYe8dEqQiuAmqkKdOeI7K]";

async function isInStock() {
  try {
    const url =
      "https://shop.amul.com/api/1/entity/ms.products?fields[name]=1&fields[brand]=1&fields[categories]=1&fields[collections]=1&fields[alias]=1&fields[sku]=1&fields[price]=1&fields[compare_price]=1&fields[original_price]=1&fields[images]=1&fields[metafields]=1&fields[discounts]=1&fields[catalog_only]=1&fields[is_catalog]=1&fields[seller]=1&fields[available]=1&fields[inventory_quantity]=1&fields[net_quantity]=1&fields[num_reviews]=1&fields[avg_rating]=1&fields[inventory_low_stock_quantity]=1&fields[inventory_allow_out_of_stock]=1&fields[default_variant]=1&fields[variants]=1&fields[lp_seller_ids]=1&filters[0][field]=categories&filters[0][value][0]=protein&filters[0][operator]=in&filters[0][original]=1&facets=true&facetgroup=default_category_facet&limit=32&total=1&start=0&cdc=1m&substore=66506000c8f2d6e221b9193a"; // update this
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://shop.amul.com/",
        Origin: "https://shop.amul.com",
        "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        Cookie:
          "jsessionid=s%3APz2GgKCz07ewJlzFXKf%2ByAZK.SZeJ1rP2uVLXwwqP6xeA3E0G7psnNF27G2rqCbc%2BeO8; _fbp=fb.1.1749494953074.512323327958723390; _ga=GA1.1.1732502981.1749494954; __cf_bm=P49rpajeH_.CzxzR6YLsO4lIhX5azY1Cy2Yfu.KbF0I-1749534667-1.0.1.1-otP7zj_IWNFqnwMpFQn4OD1hSoUdII7cou7EGdd6zWvHhboBkcoARzUYydiXDbuqBK8Ju7L9tkQGz_OJkHBfcNVRlaX5qBrOsUTIOlJWZ9Y; _ga_E69VZ8HPCN=GS2.1.s1749534615$o5$g1$t1749534671$j4$l0$h1122879839",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
      },
    });
    if (res.data.data.length === 0) {
      console.log("⚠️ RATE LIMIT EXCEEDED");
      return;
    }
    const availableStock = res.data.data.filter((item) => item.available === 1);

    if (availableStock.length === 0) {
      console.log("❌   No stock available");
      return;
    } else {
      console.log(`✔️  In stock: ${availableStock.length}`);
    }

    const requiredItemsAvailable = ITEMS.filter((item) =>
      availableStock.find((stock) => stock.alias === item.alias)
    ).map((item) => item.alias);
    const count = requiredItemsAvailable.length;

    if (count > 0) {
      console.log(
        ` ✅  ${count} watchlist item(s) available:`,
        requiredItemsAvailable
      );
      await sendNotification(
        EXPO_PUSH_TOKEN,
        "📢 Amul Stock Update",
        `🎉 ${count} item(s) available:\n${requiredItemsAvailable.join(", ")}`
      );
      console.log("📨 Notification sent successfully!");
    } else {
      console.log("ℹ️  Nothing from watchlist");
    }
  } catch (err) {
    console.error("⚠️ Error:", err.message || err);
  }
}

isInStock();

cron.schedule("*/1   * * * *", () => {
  console.log("Checking stock at", new Date().toLocaleTimeString());
  isInStock();
});

const ITEMS = [
  // {
  //   _id: "680a09192d0f920024bfeb8a",
  //   seller: "65000c5ebad4464748bf1d15",
  //   alias: "amul-kool-protein-milkshake-or-kesar-180-ml-or-pack-of-8",
  //   collections: ["power-of-protein"],
  //   categories: ["protein"],
  //   name: "Amul Kool Protein Milkshake | Kesar, 180 mL | Pack of 8",
  //   price: 320,
  //   compare_price: 320,
  //   brand: "Amul",
  //   sku: "DBDCP42_02",
  //   sort_order: 0,
  //   available: 1,
  //   variants: [],
  //   default_variant: null,
  //   avg_rating: 5,
  //   num_reviews: 5,
  //   inventory_quantity: 207,
  //   list_price: 320,
  //   our_price: 320,
  //   original_price: 320,
  //   discounts_total: 0,
  //   discounts_percentage: "0.000",
  //   discount_total: 0,
  //   entity_type: "ms.products",
  //   inventory_management: "automatic",
  //   inventory_low_stock_quantity: 5,
  //   linked_product_id: "680a25b1d8bcb2002487e76b",
  //   seller_id: "65000c5ebad4464748bf1d15",
  //   inventory_management_level: "product",
  // },
  {
    _id: "651d0a21e8ac81a61d2d1a74",
    seller: "65000c5ebad4464748bf1d15",
    alias: "amul-high-protein-rose-lassi-200-ml-or-pack-of-30",

    collections: ["power-of-protein"],
    categories: ["protein"],
    name: "Amul High Protein Rose Lassi, 200 mL | Pack of 30",
    price: 750,
    brand: "Amul",
    sku: "LASCP40_30",
    compare_price: 750,
    available: 0,
    variants: [],
    sort_order: 0,
    default_variant: null,
    inventory_quantity: 8,
    avg_rating: 5,
    num_reviews: 76,
    lp_seller_ids: [
      "639c3fc69d3a6d5dc06e7c8c",
      "6500035ebad4464748bd557c",
      "65029e95cb56f4267893d3fe",
      "673335e1f21cf10036a4bb67",
      "64906fdd2bf6788c51a2464b",
      "64d1fa12834e0d6822b788c2",
      "6502a0fd073283e338deaa22",
      "6502b9417dac6a12a03efa74",
      "650006e7bad4464748be31d4",
      "65000c5ebad4464748bf1d15",
      "6500299751e16335cb316786",
    ],
    inventory_low_stock_quantity: 10,
    list_price: 750,
    our_price: 750,
    original_price: 750,
    discounts_total: 0,
    discounts_percentage: "0.000",
    discount_total: 0,
    entity_type: "ms.products",
    inventory_management: "automatic",
    linked_product_id: "67f5d8fb2a7058002b3b82cb",
    seller_id: "65000c5ebad4464748bf1d15",
    inventory_management_level: "product",
  },
  // {
  //   _id: "63410e732677af79f687339b",
  //   seller: "65000c5ebad4464748bf1d15",
  //   alias: "amul-high-protein-buttermilk-200-ml-or-pack-of-30",

  //   collections: ["power-of-protein"],
  //   categories: ["protein"],

  //   name: "Amul High Protein Buttermilk, 200 mL | Pack of 30",
  //   price: 750,
  //   compare_price: 750,
  //   sku: "BTMCP11_30",
  //   available: 0,
  //   variants: [],
  //   sort_order: 0,
  //   default_variant: null,
  //   inventory_quantity: 6,
  //   avg_rating: 4.8,
  //   num_reviews: 55,
  //   brand: "Amul",
  //   inventory_low_stock_quantity: 10,
  //   lp_seller_ids: [
  //     "639c3fc69d3a6d5dc06e7c8c",
  //     "6500035ebad4464748bd557c",
  //     "65029e95cb56f4267893d3fe",
  //     "673335e1f21cf10036a4bb67",
  //     "64906fdd2bf6788c51a2464b",
  //     "64d1fa12834e0d6822b788c2",
  //     "6502a0fd073283e338deaa22",
  //     "6502b9417dac6a12a03efa74",
  //     "650006e7bad4464748be31d4",
  //     "65000c5ebad4464748bf1d15",
  //     "6500299751e16335cb316786",
  //   ],
  //   list_price: 750,
  //   our_price: 750,
  //   original_price: 750,
  //   discounts_total: 0,
  //   discounts_percentage: "0.000",
  //   discount_total: 0,
  //   entity_type: "ms.products",
  //   inventory_management: "automatic",
  //   linked_product_id: "67f5d8fb4c49070024c4d17d",
  //   seller_id: "65000c5ebad4464748bf1d15",
  //   inventory_management_level: "product",
  // },
  {
    _id: "66bcad006760c5002bc81922",
    seller: "65000c5ebad4464748bf1d15",
    alias: "amul-high-protein-plain-lassi-200-ml-or-pack-of-30",

    collections: ["power-of-protein"],
    categories: ["protein"],
    name: "Amul High Protein Plain Lassi, 200 mL | Pack of 30",
    price: 750,
    brand: "Amul",
    sku: "LASCP61_30",
    compare_price: 750,
    available: 0,
    variants: [],
    sort_order: 0,
    default_variant: null,
    inventory_quantity: 0,
    lp_seller_ids: [
      "639c3fc69d3a6d5dc06e7c8c",
      "6500035ebad4464748bd557c",
      "65029e95cb56f4267893d3fe",
      "673335e1f21cf10036a4bb67",
      "64906fdd2bf6788c51a2464b",
      "64d1fa12834e0d6822b788c2",
      "6502a0fd073283e338deaa22",
      "6502b9417dac6a12a03efa74",
      "650006e7bad4464748be31d4",
      "65000c5ebad4464748bf1d15",
      "6500299751e16335cb316786",
    ],
    inventory_low_stock_quantity: 10,
    avg_rating: 5,
    num_reviews: 21,
    list_price: 750,
    our_price: 750,
    original_price: 750,
    discounts_total: 0,
    discounts_percentage: "0.000",
    discount_total: 0,
    entity_type: "ms.products",
    inventory_management: "automatic",
    linked_product_id: "67f5d8f6b86a51002b143375",
    seller_id: "65000c5ebad4464748bf1d15",
    inventory_management_level: "product",
  },
];
