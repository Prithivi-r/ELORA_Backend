const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    _id: 1,
    name: "Radiance Vitamin C Serum",
    price: 2699,
    category: "Skincare",
    description: "Illuminating vitamin C serum for radiant, glowing skin",
    imageUrl: "./public/Radiance_vitamin .png",
    stock: 50,
    offer: 15,
    isActive: true
  },
  {
    _id: 2,
    name: "Rejuvenating Night Cream",
    price: 3299,
    category: "Skincare",
    description: "Rich night cream for deep hydration and repair",
    imageUrl: "./public/Rejuvenating_Night.png",
    stock: 30,
    offer: 0,
    isActive: true
  },
  {
    _id: 3,
    name: "Hydrating Face Mask",
    price: 2199,
    category: "Skincare",
    description: "Intensive hydrating mask for all skin types",
    imageUrl: "./public/Hydrating_Face_Mask.png",
    stock: 40,
    offer: 14,
    isActive: true
  },
  {
    _id: 4,
    name: "Gentle Cleansing Oil",
    price: 1599,
    category: "Skincare",
    description: "Luxurious cleansing oil for makeup removal",
    imageUrl: "./public/Cleansing_Oil.png",
    stock: 25,
    offer: 0,
    isActive: true
  },
  {
    _id: 5,
    name: "Anti-Aging Eye Cream",
    price: 3299,
    category: "Skincare",
    description: "Reduces fine lines and dark circles",
    imageUrl: "./public/Anti-Aging_Eye_Cream.png",
    stock: 20,
    offer: 15,
    isActive: true
  },
  {
    _id: 6,
    name: "Hyaluronic Acid Serum",
    price: 2999,
    category: "Skincare",
    description: "Intense hydration with hyaluronic acid",
    imageUrl: "./public/Hyaluronic_Acid_Serum.png",
    stock: 35,
    offer: 13,
    isActive: true
  },
  {
    _id: 7,
    name: "Golden Glow Foundation",
    price: 2599,
    category: "Makeup",
    description: "Full coverage foundation with golden undertones",
    imageUrl: "./public/Golden Glow Foundation.png",
    stock: 45,
    offer: 15,
    isActive: true
  },
  {
    _id: 8,
    name: "Velvet Matte Lipstick",
    price: 1299,
    category: "Makeup",
    description: "Long-lasting matte lipstick in luxury shades",
    imageUrl: "./public/Velvet Matte Lipstick.png",
    stock: 60,
    offer: 0,
    isActive: true
  },
  {
    _id: 9,
    name: "Diamond Eye Palette",
    price: 3399,
    category: "Makeup",
    description: "12-shade eyeshadow palette with shimmer and matte - Diamond Eye Collection",
    imageUrl: "./public/Eye Palette.png",
    stock: 25,
    offer: 15,
    isActive: true
  },
  {
    _id: 10,
    name: "Luxury Mascara",
    price: 1599,
    category: "Makeup",
    description: "Volumizing and lengthening mascara",
    imageUrl: "./public/Luxury Mascara.png",
    stock: 40,
    offer: 0,
    isActive: true
  },
  {
    _id: 11,
    name: "Contour & Highlight Kit",
    price: 2499,
    category: "Makeup",
    description: "Professional contouring and highlighting palette",
    imageUrl: "./public/Highlight Kit.png",
    stock: 30,
    offer: 0,
    isActive: true
  },
  {
    _id: 12,
    name: "Liquid Eyeliner",
    price: 1099,
    category: "Makeup",
    description: "Precision liquid eyeliner for perfect lines",
    imageUrl: "./public/Liquid Eyeliner.png",
    stock: 50,
    offer: 18,
    isActive: true
  },
  {
    _id: 13,
    name: "Midnight Rose Perfume",
    price: 4999,
    category: "Fragrance",
    description: "Elegant rose fragrance with woody undertones",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center",
    stock: 15,
    offer: 14,
    isActive: true
  },
  {
    _id: 14,
    name: "Ocean Breeze Eau de Toilette",
    price: 2999,
    category: "Fragrance",
    description: "Fresh aquatic fragrance for everyday wear",
    imageUrl: "./public/Aqua_Marine.png",
    stock: 20,
    offer: 0,
    isActive: true
  },
  {
    _id: 15,
    name: "Amber Woods Cologne",
    price: 3499,
    category: "Fragrance",
    description: "Warm woody fragrance with amber notes",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop&crop=center",
    stock: 12,
    offer: 0,
    isActive: true
  },
  {
    _id: 16,
    name: "Vanilla Orchid Perfume",
    price: 4299,
    category: "Fragrance",
    description: "Sweet vanilla and orchid blend",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop&crop=center",
    stock: 18,
    offer: 12,
    isActive: true
  },
  {
    _id: 17,
    name: "Citrus Burst EDT",
    price: 2299,
    category: "Fragrance",
    description: "Energizing citrus fragrance for day wear",
    imageUrl: "./public/Citrus_Splash.png",
    stock: 25,
    offer: 0,
    isActive: true
  },
  {
    _id: 18,
    name: "Oud Royal Perfume",
    price: 6999,
    category: "Fragrance",
    description: "Premium oud fragrance for special occasions",
    imageUrl: "./public/oud-royale.jpg.png",
    stock: 10,
    offer: 0,
    isActive: true
  },
  {
    _id: 19,
    name: "TOKYO TALKIES X rubans",
    price: 599,
    category: "Accessories",
    description: "PGold-Toned Contemporary Drop Earrings",
    imageUrl: "./public/TOKYO TALKIES.png",
    stock: 100,
    offer: 10,
    isActive: true
  },
  {
    _id: 20,
    name: "ToniQ",
    price: 599,
    category: "Accessories",
    description: "Gold-Plated Pearls Beaded Charm Bracelet",
    imageUrl: "./public/ToniQ.png",
    stock: 80,
    offer: 0,
    isActive: true
  },
  {
    _id: 21,
    name: "Gold Mirror",
    price: 899,
    category: "Accessories",
    description: "Elegant gold mirror with LED lights",
    imageUrl: "./public/Antique Vanity Mirror .png",
    stock: 15,
    offer: 15,
    isActive: true
  },
  {
    _id: 22,
    name: "Korean Style Pearl Metal Hair clips",
    price: 699,
    category: "Accessories",
    description: "Rhinestones Plastic Pearl Barrettes Flower Lock Pin Hair Accessories for Women and Girls",
    imageUrl: "./public/Hair clips.png",
    stock: 200,
    offer: 0,
    isActive: true
  },
  {
    _id: 23,
    name: "Cell Phone Strap",
    price: 299,
    category: "Accessories",
    description: "Rose quartz face roller for skincare massage",
    imageUrl: "./public/Phone Charm.png",
    stock: 150,
    offer: 14,
    isActive: true
  },
  {
    _id: 24,
    name: "Headband Hair JewelleryHeadband",
    price: 999,
    category: "Accessories",
    description: "Hollywood-style LED vanity mirror",
    imageUrl: "./public/Headband Hair.png",
    stock: 75,
    offer: 13,
    isActive: true
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();