//assets/js/products.js
const manualProductData = {
  "Classic Pizzas": [
    {
      name: "Classic Margherita",
      price: "9.99",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "A classic margherita pizza with tomato sauce and fresh mozzarella.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Tomato Sauce, Mozzarella Cheese, Basil, Olive Oil",
      sugar: "2.1",
      protein: "9.0",
      fat: "7.5",
      calories: "620"
    },
    {
      name: "Pepperoni Classic",
      price: "11.99",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Crispy pepperoni on a cheesy classic pizza base.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Tomato Sauce, Mozzarella Cheese, Basil, Pepperoni",
      sugar: "1.7",
      protein: "11.2",
      fat: "8.9",
      calories: "700"
    },
    {
      name: "Four Cheese Delight",
      price: "12.49",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Cheddar, mozzarella, parmesan, and gorgonzola on a cheesy crust.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Cheddar, Mozzarella, Parmesan, Gorgonzola",
      sugar: "1.9",
      protein: "10.7",
      fat: "9.3",
      calories: "680"
    }
  ],
  "Specialty Pizzas": [
    {
      name: "BBQ Chicken Special",
      price: "13.49",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Barbecue chicken pizza with tangy BBQ sauce and onions.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "BBQ Sauce, Chicken, Onions, Mozzarella",
      sugar: "3.1",
      protein: "14.5",
      fat: "9.1",
      calories: "730"
    },
    {
      name: "Buffalo Heat",
      price: "12.99",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Spicy buffalo chicken pizza with blue cheese dressing.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Buffalo Chicken, Blue Cheese, Mozzarella",
      sugar: "2.7",
      protein: "13.0",
      fat: "10.0",
      calories: "750"
    },
    {
      name: "Truffle Mushroom Pizza",
      price: "14.49",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Earthy mushrooms with truffle oil and mozzarella.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Mushrooms, Truffle Oil, Mozzarella",
      sugar: "2.0",
      protein: "10.2",
      fat: "8.5",
      calories: "680"
    },
  ],
  "Veggie Pizzas": [
    {
      name: "Garden Veggie",
      price: "11.49",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Loaded with bell peppers, onions, mushrooms, and olives.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Bell Peppers, Onions, Mushrooms, Olives, Tomato Sauce",
      sugar: "2.6",
      protein: "9.1",
      fat: "7.3",
      calories: "640"
    },
    {
      name: "Spinach Alfredo",
      price: "12.29",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Creamy Alfredo with spinach and mozzarella.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Spinach, Alfredo Sauce, Mozzarella",
      sugar: "1.9",
      protein: "10.6",
      fat: "8.4",
      calories: "690"
    },
    {
      name: "Veggie Supreme",
      price: "12.99",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "The ultimate vegetarian pizza experience.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Mushrooms, Bell Peppers, Onions, Olives",
      sugar: "2.4",
      protein: "10.3",
      fat: "7.7",
      calories: "660"
    }
  ],
  "Meat Lovers": [
    {
      name: "Ham & Pineapple Meat Pizza",
      price: "13.29",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Savory ham paired with sweet pineapple chunks.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Ham, pineapple, mozzarella",
      sugar: "3.2",
      protein: "13.7",
      fat: "9.8",
      calories: "750"
    },
    {
      name: "Spicy Meatball Pizza",
      price: "13.89",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Meatballs and chili peppers with marinara sauce.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Meatballs, chili, marinara, mozzarella",
      sugar: "2.1",
      protein: "16.0",
      fat: "11.2",
      calories: "790"
    },
    {
      name: "Turkey Sausage Pizza",
      price: "13.69",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Healthier take with turkey sausage and mozzarella.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Turkey sausage, cheese, tomato sauce",
      sugar: "2.0",
      protein: "14.5",
      fat: "9.9",
      calories: "740"
    }
  ],
  "Calzones & Stromboli": [
    {
      name: "Buffalo Chicken Calzone",
      price: "11.99",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Spicy buffalo chicken wrapped in cheesy dough.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Buffalo chicken, blue cheese, mozzarella",
      sugar: "1.7",
      protein: "13.2",
      fat: "9.9",
      calories: "720"
    },
    {
      name: "Cheesy Stromboli",
      price: "11.49",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "Four cheeses and herbs baked in a roll.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "Cheddar, mozzarella, parmesan, herbs",
      sugar: "1.6",
      protein: "10.4",
      fat: "9.1",
      calories: "710"
    },
    {
      name: "BBQ Stromboli",
      price: "12.49",
      sizes: {
        Small: 8.99,
        Medium: 10.99,
        Large: 12.99
      },
      description: "BBQ chicken, onions, and cheese in rolled dough.",
      image: "https://www.gozney.com/cdn/shop/files/Caprese_Pizza_Feng_Chen_leopardcrust_-_Large_f0796fcd-05f1-4c1e-9341-fb6012fe7907.png?v=1730478267&width=1500",
      ingredients: "BBQ chicken, mozzarella, onions",
      sugar: "2.3",
      protein: "14.1",
      fat: "10.0",
      calories: "740"
    } 
  ],
  "Sides": [
  {
    name: "Garlic Bread",
    price: "4.99",
    description: "Toasted bread with garlic butter and herbs.",
    image: "https://www.thevegspace.co.uk/wp-content/uploads/2018/06/FV-Insta-3.jpg",
    ingredients: "Bread, garlic, butter, parsley",
    sugar: "1.0",
    protein: "3.5",
    fat: "8.0",
    calories: "250"
  },
  {
    name: "Fries",
    price: "3.99",
    description: "Crispy golden fries with a sprinkle of salt.",
    image: "https://www.budgetbytes.com/wp-content/uploads/2023/12/air-fryer-french-fries-horizontal-hero-web-ready-1.jpg",
    ingredients: "Potatoes, salt, vegetable oil",
    sugar: "0.5",
    protein: "2.0",
    fat: "10.0",
    calories: "300"
  },
  {
    name: "Salad",
    price: "5.49",
    description: "Fresh mixed greens with tomatoes and dressing.",
    image: "https://theplantbasedschool.com/wp-content/uploads/2022/07/Simple-salad-1-2.jpg",
    ingredients: "Lettuce, tomatoes, cucumbers, dressing",
    sugar: "2.0",
    protein: "1.5",
    fat: "3.0",
    calories: "150"
  }
],
"Drinks": [
  {
    name: "Coke",
    price: "2.49",
    description: "Refreshing cola served chilled.",
    image: "https://theheavenlycoffeecompany.co.uk/cdn/shop/products/CDTJCCC_PXYCx_pJU.jpg?v=1706114823",
    ingredients: "Carbonated water, sugar, caffeine",
    sugar: "39.0",
    protein: "0.0",
    fat: "0.0",
    calories: "140"
  },
  {
    name: "Sprite",
    price: "2.49",
    description: "Crisp lemon-lime soda.",
    image: "https://americanfizz.co.uk/media/catalog/product/cache/6b10d57cd8d541100491edcb64c52781/s/p/sprite-lemon-lime-12fl-oz-355ml.png",
    ingredients: "Carbonated water, sugar, citric acid",
    sugar: "38.0",
    protein: "0.0",
    fat: "0.0",
    calories: "140"
  },
  {
    name: "Iced Tea",
    price: "2.99",
    description: "Chilled black tea with a hint of lemon.",
    image: "https://cdn.mafrservices.com/sys-master-root/ha3/h45/13861871910942/646039_main.jpg",
    ingredients: "Black tea, water, lemon extract",
    sugar: "20.0",
    protein: "0.0",
    fat: "0.0",
    calories: "80"
  }
],
"Toppings": [
  {
    name: "Cheese",
    price: "0.99",
    description: "Extra mozzarella cheese topping.",
    image: "https://example.com/images/cheese.jpg",
    sugar: "0.0",
    protein: "7.0",
    fat: "9.0",
    calories: "110"
  },
  {
    name: "Jalapeños",
    price: "0.75",
    description: "Spicy jalapeño peppers.",
    image: "https://example.com/images/jalapenos.jpg",
    sugar: "0.5",
    protein: "0.5",
    fat: "0.2",
    calories: "10"
  },
  {
    name: "Olives",
    price: "0.80",
    description: "Black olives topping.",
    image: "https://example.com/images/olives.jpg",
    sugar: "0.0",
    protein: "0.3",
    fat: "4.5",
    calories: "40"
  },
  {
    name: "Ham",
    price: "1.20",
    description: "Smoked ham slices.",
    image: "https://example.com/images/ham.jpg",
    sugar: "0.0",
    protein: "10.0",
    fat: "5.0",
    calories: "80"
  },
  {
    name: "Pineapple",
    price: "0.90",
    description: "Sweet pineapple chunks.",
    image: "https://example.com/images/pineapple.jpg",
    sugar: "13.0",
    protein: "0.5",
    fat: "0.1",
    calories: "50"
  },
  {
    name: "Mushrooms",
    price: "0.85",
    description: "Fresh sliced mushrooms.",
    image: "https://example.com/images/mushrooms.jpg",
    sugar: "0.5",
    protein: "2.0",
    fat: "0.1",
    calories: "20"
  },
  {
    name: "Onions",
    price: "0.70",
    description: "Crisp onion slices.",
    image: "https://example.com/images/onions.jpg",
    sugar: "4.0",
    protein: "1.0",
    fat: "0.0",
    calories: "40"
  },
  {
    name: "Peppers",
    price: "0.80",
    description: "Colorful bell peppers.",
    image: "https://example.com/images/peppers.jpg",
    sugar: "3.0",
    protein: "1.0",
    fat: "0.1",
    calories: "30"
  },
  {
    name: "Spinach",
    price: "0.85",
    description: "Fresh spinach leaves.",
    image: "https://example.com/images/spinach.jpg",
    sugar: "0.4",
    protein: "2.9",
    fat: "0.4",
    calories: "23"
  },
  {
    name: "Basil",
    price: "0.60",
    description: "Aromatic basil leaves.",
    image: "https://example.com/images/basil.jpg",
    sugar: "0.1",
    protein: "1.6",
    fat: "0.6",
    calories: "22"
  },
  {
    name: "Garlic",
    price: "0.65",
    description: "Fresh minced garlic.",
    image: "https://example.com/images/garlic.jpg",
    sugar: "0.0",
    protein: "1.8",
    fat: "0.1",
    calories: "30"
  },
  {
    name: "Chicken",
    price: "1.50",
    description: "Grilled chicken pieces.",
    image: "https://example.com/images/chicken.jpg",
    sugar: "0.0",
    protein: "25.0",
    fat: "3.0",
    calories: "140"
  },
  {
    name: "Sausage",
    price: "1.40",
    description: "Spicy sausage slices.",
    image: "https://example.com/images/sausage.jpg",
    sugar: "0.0",
    protein: "15.0",
    fat: "12.0",
    calories: "200"
  },
  {
    name: "Pepperoni",
    price: "1.45",
    description: "Classic pepperoni slices.",
    image: "https://example.com/images/pepperoni.jpg",
    sugar: "0.0",
    protein: "14.0",
    fat: "13.0",
    calories: "210"
  },
  {
    name: "Bacon",
    price: "1.60",
    description: "Smoky crispy bacon.",
    image: "https://example.com/images/bacon.jpg",
    sugar: "0.0",
    protein: "12.0",
    fat: "15.0",
    calories: "230"
  },
  {
    name: "Tomatoes",
    price: "0.75",
    description: "Fresh sliced tomatoes.",
    image: "https://example.com/images/tomatoes.jpg",
    sugar: "2.5",
    protein: "1.0",
    fat: "0.2",
    calories: "25"
  }
],
};