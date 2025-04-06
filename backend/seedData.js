import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './collection-models/Category.js';
import Recipe from './collection-models/Recipe.js';
import RecipeWriter from './collection-models/RecipeWriter.js';
import Subscriber from './collection-models/Subscriber.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const seedCategories = async () => {
  const categories = [
    {
      name: 'Breakfast',
      description: 'Start your day right with these delicious breakfast recipes'
    },
    {
      name: 'Lunch',
      description: 'Perfect midday meals for any occasion'
    },
    {
      name: 'Dinner',
      description: 'Hearty and satisfying dinner recipes'
    },
    {
      name: 'Desserts',
      description: 'Sweet treats and desserts for any occasion'
    }
  ];

  try {
    await Category.deleteMany({});
    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories seeded successfully');
    return insertedCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

const seedRecipeWriters = async () => {
  const writers = [
    {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john@example.com',
      password: 'password123',
      phone_number: '1234567890',
      address: '123 Main St',
      city: 'Kansas City',
      state: 'MO',
      zipcode: '64106',
      dob: new Date('1990-01-01'),
      is_approved: true
    },
    {
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah@example.com',
      password: 'password123',
      phone_number: '0987654321',
      address: '456 Oak St',
      city: 'Kansas City',
      state: 'MO',
      zipcode: '64106',
      dob: new Date('1992-05-15'),
      is_approved: true
    }
  ];

  try {
    await RecipeWriter.deleteMany({});
    const insertedWriters = await RecipeWriter.insertMany(writers);
    console.log('Recipe writers seeded successfully');
    return insertedWriters;
  } catch (error) {
    console.error('Error seeding recipe writers:', error);
  }
};

const seedRecipes = async (categories, writers) => {
  const recipes = [
    {
      title: 'Classic Pancakes',
      description: 'Fluffy and delicious pancakes perfect for breakfast',
      ingredients: [
        { ingredient: 'All-purpose flour', quantity: 1.5, measurement: 'cups' },
        { ingredient: 'Baking powder', quantity: 3.5, measurement: 'teaspoons' },
        { ingredient: 'Salt', quantity: 0.25, measurement: 'teaspoon' },
        { ingredient: 'Sugar', quantity: 1, measurement: 'tablespoon' },
        { ingredient: 'Milk', quantity: 1.25, measurement: 'cups' },
        { ingredient: 'Egg', quantity: 1, measurement: 'whole' },
        { ingredient: 'Butter', quantity: 3, measurement: 'tablespoons' }
      ],
      steps: [
        'In a large bowl, sift together the flour, baking powder, salt and sugar.',
        'Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.',
        'Heat a lightly oiled griddle or frying pan over medium-high heat.',
        'Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake.',
        'Brown on both sides and serve hot.'
      ],
      writer_id: writers[0]._id,
      is_premium: false,
      category_id: categories[0]._id,
      approval_status: 'approved',
      approval_date: new Date(),
      creation_date: new Date(),
      num_of_views: 0
    },
    {
      title: 'Chocolate Cake',
      description: 'Rich and moist chocolate cake that will satisfy any sweet tooth',
      ingredients: [
        { ingredient: 'All-purpose flour', quantity: 2, measurement: 'cups' },
        { ingredient: 'Sugar', quantity: 2, measurement: 'cups' },
        { ingredient: 'Cocoa powder', quantity: 0.75, measurement: 'cup' },
        { ingredient: 'Baking powder', quantity: 2, measurement: 'teaspoons' },
        { ingredient: 'Baking soda', quantity: 1.5, measurement: 'teaspoons' },
        { ingredient: 'Salt', quantity: 1, measurement: 'teaspoon' },
        { ingredient: 'Eggs', quantity: 2, measurement: 'whole' },
        { ingredient: 'Milk', quantity: 1, measurement: 'cup' },
        { ingredient: 'Vegetable oil', quantity: 0.5, measurement: 'cup' },
        { ingredient: 'Vanilla extract', quantity: 2, measurement: 'teaspoons' }
      ],
      steps: [
        'Preheat oven to 350°F (175°C).',
        'Mix dry ingredients in a large bowl.',
        'Add wet ingredients and mix until well combined.',
        'Pour into a greased 9-inch cake pan.',
        'Bake for 30-35 minutes or until a toothpick comes out clean.',
        'Cool completely before frosting.'
      ],
      writer_id: writers[1]._id,
      is_premium: true,
      category_id: categories[3]._id,
      approval_status: 'approved',
      approval_date: new Date(),
      creation_date: new Date(),
      num_of_views: 0
    }
  ];

  try {
    await Recipe.deleteMany({});
    await Recipe.insertMany(recipes);
    console.log('Recipes seeded successfully');
  } catch (error) {
    console.error('Error seeding recipes:', error);
  }
};

const seedSubscribers = async () => {
  const subscribers = [
    {
      first_name: 'Bablu',
      last_name: 'User',
      email: 'bablu@gmail.com',
      password: 'bablu123',
      phone_number: '1234567890',
      city: 'Kansas City',
      state: 'MO',
      zipcode: '64106',
      dob: '1990-01-01',
      favorites_list: [],
      compensation_balance: 0
    }
  ];

  try {
    await Subscriber.deleteMany({});
    const insertedSubscribers = await Subscriber.insertMany(subscribers);
    console.log('Subscribers seeded successfully');
    return insertedSubscribers;
  } catch (error) {
    console.error('Error seeding subscribers:', error);
  }
};

const seedDatabase = async () => {
  await connectDB();
  const categories = await seedCategories();
  const writers = await seedRecipeWriters();
  await seedRecipes(categories, writers);
  await seedSubscribers();
  console.log('Database seeding completed!');
  process.exit();
};

seedDatabase(); 