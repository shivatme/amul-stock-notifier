// scrape.js
const axios = require("axios");
const sendNotification = require("./notify");
const cron = require("node-cron");

const EXPO_PUSH_TOKEN = "ExponentPushToken[GM_qLwO2OpX7wK-sub2g1q]";

async function isInStock() {
  try {
    const url =
      "https://shop.amul.com/api/1/entity/ms.products?fields[name]=1&fields[brand]=1&fields[categories]=1&fields[collections]=1&fields[alias]=1&fields[sku]=1&fields[price]=1&fields[compare_price]=1&fields[original_price]=1&fields[images]=1&fields[metafields]=1&fields[discounts]=1&fields[catalog_only]=1&fields[is_catalog]=1&fields[seller]=1&fields[available]=1&fields[inventory_quantity]=1&fields[net_quantity]=1&fields[num_reviews]=1&fields[avg_rating]=1&fields[inventory_low_stock_quantity]=1&fields[inventory_allow_out_of_stock]=1&fields[default_variant]=1&fields[variants]=1&fields[lp_seller_ids]=1&filters[0][field]=categories&filters[0][value][0]=protein&filters[0][operator]=in&filters[0][original]=1&facets=true&facetgroup=default_category_facet&limit=32&total=1&start=0"; // update this
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://shop.amul.com/",
        Origin: "https://shop.amul.com",
        "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        Cookie:
          "jsessionid=s%3Ag7iG8X4DK1jlK1Y7g1YhXGxa.X85HstgKfsdFZS2Ur8rcKslM989RW44EOaAFaDTZxmY; __cf_bm=WU.k1vzmXxhwyZsqBd7Y3Iabz90t9PSc5mzH9Gq7Qc8-1754341350-1.0.1.1-0GIyHq.VLopuHbxtyk5RDmKXBxstsNitXDtPQUtiMwFhIqbQZqi75eiNZ2yP4o.WT5aSVKNqWuoKWBLtrz6wiLlJcZ25zn1_ivB6iAWdIBs; _fbp=fb.1.1754341352147.671654181438430902; _ga=GA1.1.116848621.1754341352; _ga_E69VZ8HPCN=GS2.1.s1754341352$o1$g1$t1754341740$j60$l0$h850697161",
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
  // { alias: "amul-kool-protein-milkshake-or-kesar-180-ml-or-pack-of-30" },
  { alias: "amul-high-protein-rose-lassi-200-ml-or-pack-of-30" },
  { alias: "amul-high-protein-buttermilk-200-ml-or-pack-of-30" },
  { alias: "amul-high-protein-plain-lassi-200-ml-or-pack-of-30" },
];
