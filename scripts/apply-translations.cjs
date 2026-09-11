#!/usr/bin/env node
const { Client } = require('pg');

const seedProducts = [
  {
    name: "shoes",
    description: "shoes",
    translations: { en: { name: "shoes", description: "shoes" }, ar: { name: "أحذية", description: "أحذية مريحة وعالية الجودة" } }
  },
  {
    name: "Comfortable Woman shoe",
    description: "Chic & Comfortable Woman shoe with Black color",
    translations: { en: { name: "Comfortable Woman shoe", description: "Chic & Comfortable Woman shoe with Black color" }, ar: { name: "حذاء نسائي مريح", description: "حذاء نسائي أنيق ومريح باللون الأسود" } }
  },
  {
    name: "Shoe women's ",
    description: "Shoe women's with Black color",
    translations: { en: { name: "Shoe women's ", description: "Shoe women's with Black color" }, ar: { name: "حذاء نسائي", description: "حذاء نسائي باللون الأسود" } }
  },
  {
    name: "Slipper High-quality ",
    description: "High Quality Slipper with Blue color.",
    translations: { en: { name: "Slipper High-quality ", description: "High Quality Slipper with Blue color." }, ar: { name: "شبشب عالي الجودة", description: "شبشب عالي الجودة باللون الأزرق" } }
  },
  {
    name: "Slipper  Women's High-quality ",
    description: "Chic Slipper  Women's High-quality ",
    translations: { en: { name: "Slipper  Women's High-quality ", description: "Chic Slipper  Women's High-quality " }, ar: { name: "شبشب نسائي عالي الجودة", description: "شبشب نسائي أنيق وعالي الجودة" } }
  },
  {
    name: "Slipper High-quality ",
    description: "High Quality Slipper with Black color.",
    translations: { en: { name: "Slipper High-quality ", description: "High Quality Slipper with Black color." }, ar: { name: "شبشب عالي الجودة", description: "شبشب عالي الجودة باللون الأسود" } }
  },
  {
    name: "Medical Women shoes",
    description: "High Quality Medical Women shoes with All Colors.",
    translations: { en: { name: "Medical Women shoes", description: "High Quality Medical Women shoes with All Colors." }, ar: { name: "أحذية طبية نسائية", description: "أحذية طبية نسائية عالية الجودة بعدة ألوان" } }
  },
  {
    name: "Slipper High-quality Women's ",
    description: "Slipper High-quality Women's with black color",
    translations: { en: { name: "Slipper High-quality Women's ", description: "Slipper High-quality Women's with black color" }, ar: { name: "شبشب نسائي عالي الجودة", description: "شبشب نسائي عالي الجودة باللون الأسود" } }
  }
];

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    let updated = 0;
    for (const p of seedProducts) {
      const res = await client.query('SELECT id, translations FROM products WHERE name = $1 LIMIT 1', [p.name]);
      if (res.rows.length === 0) {
        console.log('No product found for:', p.name);
        continue;
      }
      const id = res.rows[0].id;
      await client.query('UPDATE products SET translations = $1 WHERE id = $2', [p.translations, id]);
      console.log('Updated translations for:', p.name, 'id:', id);
      updated++;
    }
    console.log('Total products updated:', updated);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error applying translations:', err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
})();
