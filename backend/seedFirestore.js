const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

// Force Firestore to use the Emulator (hardcoded connection to localhost:8080)
console.log("Forcing connection to Firestore Emulator...");
db.settings({
  host: "localhost:8080",  // Firestore emulator host
  ssl: false               // Disable SSL as it's not needed for the emulator
});

console.log("Firestore initialized:", db); // Should confirm emulator is connected

const products = [
  {
    id: 1,
    title: "Spacious and Efficient Refrigerator",
    price: "$799.99",
    rating: "4.5",
    images: ["https://drive.google.com/uc?export=view&id=13gAKrGmtJaEGNwZW6sVJs2IiyeKDOdba"],
    description: "This refrigerator offers ample space...",
    category: "Appliances",
    tags: ["refrigerator", "appliances", "energy-efficient", "kitchen"],
    manufacturer: "Samsung",
  },
  {
    "id": 2,
    "title": "Sharp and Durable Kitchen Knife",
    "price": "$29.99",
    "rating": "4.7",
    "images": ["https://drive.google.com/uc?export=view&id=17dQNAr_gI1liRX52QJfFRFJMdofLI6Kd"],
    "description": "A must-have for every kitchen, this knife boasts a sharp, durable blade perfect for slicing, dicing, and chopping with precision and ease.",
    "category": "Kitchenware",
    "tags": ["knife", "kitchen", "sharp", "cutting", "cooking", "kitchenware"],
    "manufacturer": "Wusthof"
  },
  {
    "id": 3,
    "title": "Versatile and Powerful Mixer",
    "price": "$89.99",
    "rating": "4.6",
    "images": ["https://drive.google.com/uc?export=view&id=1x6V1wD49SGCESt0cm1jbzwFRfkIQaekE"],
    "description": "This versatile mixer can handle everything from kneading dough to whipping up meringue. With multiple speed settings and a powerful motor, it's a baker's dream.",
    "category": "Kitchenware",
    "tags": ["mixer", "baking", "cooking", "kitchenware", "kneading", "whisk"],
    "manufacturer": "KitchenAid"
  },
  {
    "id": 4,
    "title": "Essential and Practical Spatula Set",
    "price": "$19.99",
    "rating": "4.3",
    "images": ["https://drive.google.com/uc?export=view&id=1F3uZiouhvHMmiheVRnNBb3y8N7L9frdz"],
    "description": "A practical spatula set for every kitchen. Heat-resistant and easy to clean, these spatulas are perfect for flipping, stirring, and spreading.",
    "category": "Kitchenware",
    "tags": ["spatula", "kitchenware", "flipping", "cooking", "heat-resistant"],
    "manufacturer": "OXO"
  },
  {
    "id": 5,
    "title": "Precision and Stylish Cooking Stove",
    "price": "$499.99",
    "rating": "4.8",
    "images": ["https://drive.google.com/uc?export=view&id=13iFZMyW1UXltaa2GhyddJuDJOxmgqLks"],
    "description": "This stylish cooking stove offers precise temperature control and a sleek design, making it perfect for both professional chefs and home cooks.",
    "category": "Appliances",
    "tags": ["stove", "appliances", "cooking", "kitchen", "temperature control"],
    "manufacturer": "Bosch"
  },
  {
    "id": 6,
    "title": "Durable and Versatile Cooking Pot",
    "price": "$39.99",
    "rating": "4.4",
    "images": ["https://drive.google.com/uc?export=view&id=1ZmxSpWbTJBTKwKoQzcSjApWSVhVXL_FP"],
    "description": "This versatile pot is perfect for all your cooking needs, from soups to stews. It's durable, easy to clean, and compatible with all stovetops.",
    "category": "Kitchenware",
    "tags": ["pot", "cooking", "kitchenware", "soup", "stew", "durable"],
    "manufacturer": "Cuisinart"
  },
  {
    "id": 7,
    "title": "Nike Air Force 1 Classic Sneakers",
    "price": "$120.00",
    "rating": "4.9",
    "images": ["https://drive.google.com/uc?export=view&id=1_2nLru24NLK7wIKeH_giNwkyXJtRqhRF"],
    "description": "Originally released in 1982, the Nike Air Force 1 is a timeless sneaker featuring Nike's Air cushioning technology. Its clean design and durability make it a staple in both sports and streetwear.",
    "category": "Footwear",
    "tags": ["Nike", "sneakers", "Air Force 1", "basketball", "streetwear"],
    "manufacturer": "Nike"
  },
  {
    "id": 8,
    "title": "Adidas Low-Top Signature Sneakers",
    "price": "$85.00",
    "rating": "4.7",
    "images": ["https://drive.google.com/uc?export=view&id=1fBsz96zsACO-NrV-W4f8E1NEaXza-mZR"],
    "description": "Featuring Adidas' classic three stripes and a combination of synthetic leather and textile upper, these sneakers provide comfort and durability with a vintage aesthetic.",
    "category": "Footwear",
    "tags": ["Adidas", "sneakers", "low-top", "vintage", "comfort"],
    "manufacturer": "Adidas"
  },
  {
    "id": 9,
    "title": "New Balance 574 Suede Mesh Sneakers",
    "price": "$75.00",
    "rating": "4.6",
    "images": ["https://drive.google.com/uc?export=view&id=1H_hUjqAMDdfaLXDS5R79JtWtwqjxdVI-"],
    "description": "The New Balance 574 blends suede and mesh for durability and breathability. Its ENCAP midsole technology provides cushioning and support, making it a go-to sneaker for both style and comfort.",
    "category": "Footwear",
    "tags": ["New Balance", "sneakers", "574", "ENCAP", "comfort"],
    "manufacturer": "New Balance"
  },
  {
    "id": 10,
    "title": "Skechers Flex Advantage Walking Shoes",
    "price": "$60.00",
    "rating": "4.5",
    "images": ["https://drive.google.com/uc?export=view&id=1562P2CUkN2mdohAUgwUY5WnZW20iSETj"],
    "description": "The Skechers Flex Advantage features a flexible rubber outsole and shock absorption for a comfortable walking experience. Its casual style and comfort make it ideal for everyday wear.",
    "category": "Footwear",
    "tags": ["Skechers", "walking", "flexible", "comfortable", "casual"],
    "manufacturer": "Skechers"
  },
  {
    "id": 11,
    "title": "Carhartt Men's Rain Defender Loose Fit Heavyweight Sweatshirt",
    "price": "$59.99",
    "rating": "4.8",
    "images": ["https://drive.google.com/uc?export=view&id=1Cfpewv2AkguohXK6Dqvr6yyLxTHP4NK1"],
    "description": "The Carhartt Men's Rain Defender Loose Fit Heavyweight Sweatshirt is perfect for cold and wet weather. Featuring a durable, water-repellent finish and heavyweight cotton blend fabric, it keeps you warm and dry while ensuring comfort with a loose fit design.",
    "category": "Clothing",
    "tags": ["Carhartt", "sweatshirt", "rain defender", "heavyweight", "loose fit", "water-repellent"],
    "manufacturer": "Carhartt"
  },
  {
    "id": 12,
    "title": "Fruit of the Loom Men's Eversoft Fleece Sweatshirts, Moisture Wicking & Breathable, Crewneck Sweatshirt",
    "price": "$10.44",
    "rating": "4.6",
    "images": ["https://drive.google.com/uc?export=view&id=1VIX9LZT1-sZcH6br9wYqvDOR6rQQYXH4"],
    "description": "The Fruit of the Loom Men's Eversoft Fleece Sweatshirt is made from a soft and breathable fabric, featuring moisture-wicking properties to keep you dry and comfortable. Ideal for everyday wear, this crewneck sweatshirt offers excellent value and durability.",
    "category": "Clothing",
    "tags": ["Fruit of the Loom", "sweatshirt", "fleece", "moisture wicking", "breathable", "crewneck"],
    "manufacturer": "Fruit of the Loom"
  },
  {
    "id": 13,
    "title": "Hanes Men's Hoodie, EcoSmart Fleece Hoodie, Hooded Sweatshirt for Men",
    "price": "$14.66",
    "rating": "4.5",
    "images": ["https://drive.google.com/uc?export=view&id=1iI1Z2qEqTK1vjmcYcF3OssUkCA0e8XY4"],
    "description": "The Hanes Men's EcoSmart Fleece Hoodie is made with up to 5% recycled polyester from plastic bottles. This hooded sweatshirt is soft, comfortable, and eco-friendly, making it a great choice for casual wear while helping the environment.",
    "category": "Clothing",
    "tags": ["Hanes", "hoodie", "fleece", "EcoSmart", "recycled", "comfortable", "sustainable"],
    "manufacturer": "Hanes"
  },
  {
    "id": 14,
    "title": "Champion Men's Hoodie, Powerblend, Fleece Men's Hoodie",
    "price": "$35.98",
    "rating": "4.7",
    "images": ["https://drive.google.com/uc?export=view&id=1XE7B6yGOWM6BQDIIyZUV_247n5Mgn4c_"],
    "description": "The Champion Men's Powerblend Hoodie is a durable and comfortable fleece sweatshirt, designed with a blend of cotton and polyester for reduced pilling and shrinkage. Perfect for layering, this hoodie offers warmth and a classic fit.",
    "category": "Clothing",
    "tags": ["Champion", "hoodie", "Powerblend", "fleece", "comfortable", "classic fit", "durable"],
    "manufacturer": "Champion"
  }  
  // Add more products here
];

async function seedProducts() {
  const productsRef = db.collection("products");

  for (const product of products) {
    const docRef = productsRef.doc(product.id.toString());
    await docRef.set(product);
    console.log(`Added product with ID: ${product.id}`);
  }

  console.log("Finished seeding Firestore!");
}

seedProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding Firestore:", error);
    process.exit(1);
  });
