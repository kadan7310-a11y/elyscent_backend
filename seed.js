const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    "name": "Velvet Iris",
    "family": "Floral",
    "category": "Women",
    "price": 89,
    "sizeMl": 50,
    "stock": 25,
    "featured": true,
    "notes": [
      "Iris",
      "Violet",
      "Sandalwood"
    ],
    "description": "Powdery iris over a soft sandalwood base. Quiet and close to the skin.",
    "image": "/products/velvet-iris.svg"
  },
  {
    "name": "Night Jasmine",
    "family": "Floral",
    "category": "Women",
    "price": 102,
    "sizeMl": 50,
    "stock": 18,
    "featured": false,
    "notes": [
      "Jasmine",
      "Tuberose",
      "Musk"
    ],
    "description": "Heady white florals that open slowly after dark.",
    "image": "/products/night-jasmine.svg"
  },
  {
    "name": "Peony Dusk",
    "family": "Floral",
    "category": "Women",
    "price": 78,
    "sizeMl": 50,
    "stock": 30,
    "featured": true,
    "notes": [
      "Peony",
      "Pink pepper",
      "Cedar"
    ],
    "description": "Fresh peony with a spark of pink pepper and a dry cedar finish.",
    "image": "/products/peony-dusk.svg"
  },
  {
    "name": "Rose Atelier",
    "family": "Floral",
    "category": "Unisex",
    "price": 96,
    "sizeMl": 50,
    "stock": 22,
    "featured": false,
    "notes": [
      "Damask rose",
      "Saffron",
      "Patchouli"
    ],
    "description": "Deep rose softened by saffron, grounded with patchouli.",
    "image": "/products/rose-atelier.svg"
  },
  {
    "name": "Salt & Cedar",
    "family": "Woody",
    "category": "Men",
    "price": 95,
    "sizeMl": 50,
    "stock": 30,
    "featured": true,
    "notes": [
      "Sea salt",
      "Cedar",
      "Vetiver"
    ],
    "description": "Dry cedar and vetiver with a clean mineral edge.",
    "image": "/products/salt-and-cedar.svg"
  },
  {
    "name": "Black Oud Smoke",
    "family": "Woody",
    "category": "Men",
    "price": 140,
    "sizeMl": 50,
    "stock": 10,
    "featured": false,
    "notes": [
      "Oud",
      "Smoke",
      "Leather"
    ],
    "description": "Smoked oud and leather. Bold and long lasting.",
    "image": "/products/black-oud-smoke.svg"
  },
  {
    "name": "Sandal Ridge",
    "family": "Woody",
    "category": "Unisex",
    "price": 110,
    "sizeMl": 50,
    "stock": 16,
    "featured": false,
    "notes": [
      "Sandalwood",
      "Cardamom",
      "Tonka"
    ],
    "description": "Creamy sandalwood lifted by warm cardamom.",
    "image": "/products/sandal-ridge.svg"
  },
  {
    "name": "Pine Hearth",
    "family": "Woody",
    "category": "Men",
    "price": 82,
    "sizeMl": 100,
    "stock": 28,
    "featured": false,
    "notes": [
      "Pine needle",
      "Fir balsam",
      "Smoke"
    ],
    "description": "A cold forest walk that ends beside a wood fire.",
    "image": "/products/pine-hearth.svg"
  },
  {
    "name": "Bergamot Hour",
    "family": "Citrus",
    "category": "Unisex",
    "price": 72,
    "sizeMl": 100,
    "stock": 40,
    "featured": true,
    "notes": [
      "Bergamot",
      "Neroli",
      "White musk"
    ],
    "description": "A bright citrus opening that settles into soft musk.",
    "image": "/products/bergamot-hour.svg"
  },
  {
    "name": "Yuzu Morning",
    "family": "Citrus",
    "category": "Unisex",
    "price": 68,
    "sizeMl": 100,
    "stock": 35,
    "featured": false,
    "notes": [
      "Yuzu",
      "Ginger",
      "Green tea"
    ],
    "description": "Sharp yuzu and ginger, clean as a first coffee.",
    "image": "/products/yuzu-morning.svg"
  },
  {
    "name": "Blood Orange",
    "family": "Citrus",
    "category": "Women",
    "price": 74,
    "sizeMl": 50,
    "stock": 26,
    "featured": false,
    "notes": [
      "Blood orange",
      "Mandarin",
      "Amber"
    ],
    "description": "Juicy red orange with a warm amber trail.",
    "image": "/products/blood-orange.svg"
  },
  {
    "name": "Verbena Tonic",
    "family": "Citrus",
    "category": "Men",
    "price": 66,
    "sizeMl": 100,
    "stock": 32,
    "featured": false,
    "notes": [
      "Lemon verbena",
      "Juniper",
      "Mint"
    ],
    "description": "Crisp verbena and juniper. Sharp, cool and easy to wear.",
    "image": "/products/verbena-tonic.svg"
  },
  {
    "name": "Ember Resin",
    "family": "Amber",
    "category": "Unisex",
    "price": 118,
    "sizeMl": 50,
    "stock": 15,
    "featured": true,
    "notes": [
      "Amber",
      "Labdanum",
      "Tonka"
    ],
    "description": "Warm resin and tonka. Heavy in the best way, made for cold evenings.",
    "image": "/products/ember-resin.svg"
  },
  {
    "name": "Golden Labdanum",
    "family": "Amber",
    "category": "Unisex",
    "price": 125,
    "sizeMl": 50,
    "stock": 12,
    "featured": false,
    "notes": [
      "Labdanum",
      "Benzoin",
      "Honey"
    ],
    "description": "Sticky golden resin with a thread of honey.",
    "image": "/products/golden-labdanum.svg"
  },
  {
    "name": "Saffron Amber",
    "family": "Amber",
    "category": "Women",
    "price": 108,
    "sizeMl": 50,
    "stock": 17,
    "featured": false,
    "notes": [
      "Saffron",
      "Amber",
      "Rose"
    ],
    "description": "Spiced saffron wrapped in smooth amber.",
    "image": "/products/saffron-amber.svg"
  },
  {
    "name": "Honey Smoke",
    "family": "Amber",
    "category": "Men",
    "price": 112,
    "sizeMl": 50,
    "stock": 14,
    "featured": false,
    "notes": [
      "Honey",
      "Tobacco leaf",
      "Incense"
    ],
    "description": "Dark honey and tobacco over drifting incense.",
    "image": "/products/honey-smoke.svg"
  },
  {
    "name": "Rain on Linen",
    "family": "Fresh",
    "category": "Unisex",
    "price": 64,
    "sizeMl": 100,
    "stock": 50,
    "featured": true,
    "notes": [
      "Green tea",
      "Linen accord",
      "Cypress"
    ],
    "description": "Crisp and airy, like laundry drying after a storm.",
    "image": "/products/rain-on-linen.svg"
  },
  {
    "name": "Sea Glass",
    "family": "Fresh",
    "category": "Unisex",
    "price": 70,
    "sizeMl": 100,
    "stock": 38,
    "featured": false,
    "notes": [
      "Sea spray",
      "Driftwood",
      "Sage"
    ],
    "description": "Salt air and pale driftwood on a cool shore.",
    "image": "/products/sea-glass.svg"
  },
  {
    "name": "Mint Garden",
    "family": "Fresh",
    "category": "Women",
    "price": 62,
    "sizeMl": 100,
    "stock": 36,
    "featured": false,
    "notes": [
      "Spearmint",
      "Cucumber",
      "White tea"
    ],
    "description": "Cool mint and cucumber from a garden after rain.",
    "image": "/products/mint-garden.svg"
  },
  {
    "name": "Alpine Air",
    "family": "Fresh",
    "category": "Men",
    "price": 76,
    "sizeMl": 100,
    "stock": 29,
    "featured": false,
    "notes": [
      "Pine mist",
      "Lavender",
      "Ozone"
    ],
    "description": "Thin mountain air with a hint of lavender.",
    "image": "/products/alpine-air.svg"
  },
  {
    "name": "Burnt Sugar",
    "family": "Gourmand",
    "category": "Women",
    "price": 84,
    "sizeMl": 50,
    "stock": 20,
    "featured": true,
    "notes": [
      "Caramel",
      "Vanilla",
      "Cacao"
    ],
    "description": "Caramelised sugar and cacao with a dry vanilla finish.",
    "image": "/products/burnt-sugar.svg"
  },
  {
    "name": "Fig & Cocoa",
    "family": "Gourmand",
    "category": "Unisex",
    "price": 92,
    "sizeMl": 50,
    "stock": 19,
    "featured": false,
    "notes": [
      "Fig",
      "Cocoa",
      "Almond milk"
    ],
    "description": "Ripe fig and bitter cocoa, soft like warm milk.",
    "image": "/products/fig-and-cocoa.svg"
  },
  {
    "name": "Praline Noir",
    "family": "Gourmand",
    "category": "Women",
    "price": 98,
    "sizeMl": 50,
    "stock": 13,
    "featured": false,
    "notes": [
      "Praline",
      "Coffee",
      "Benzoin"
    ],
    "description": "Roasted hazelnut praline over dark coffee.",
    "image": "/products/praline-noir.svg"
  },
  {
    "name": "Vanilla Smoke",
    "family": "Gourmand",
    "category": "Unisex",
    "price": 105,
    "sizeMl": 50,
    "stock": 15,
    "featured": false,
    "notes": [
      "Vanilla bean",
      "Smoked wood",
      "Rum"
    ],
    "description": "Dark vanilla, a little smoke and a splash of rum.",
    "image": "/products/vanilla-smoke.svg"
  }
];

async function run() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set. Copy .env.example to .env first.');
  await mongoose.connect(process.env.MONGO_URI);

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);

  const email = (process.env.ADMIN_EMAIL || 'admin@elyscents.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin12345';
  let admin = await User.findOne({ email });
  if (admin) {
    admin.role = 'admin';
    await admin.save();
  } else {
    admin = await User.create({ name: process.env.ADMIN_NAME || 'Elyscents Admin', email, password, role: 'admin' });
  }
  console.log(`Admin ready: ${email}`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
