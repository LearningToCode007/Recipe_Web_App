import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './collection-models/Recipe.js';
import Category from './collection-models/Category.js';
import RecipeWriter from './collection-models/RecipeWriter.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Check Categories
    const categories = await Category.find();
    console.log('\nCategories:', categories.length);
    categories.forEach(cat => console.log(cat.name));

    // Check Recipe Writers
    const writers = await RecipeWriter.find();
    console.log('\nRecipe Writers:', writers.length);
    writers.forEach(writer => console.log(writer.first_name, writer.last_name));

    // Check Recipes
    const recipes = await Recipe.find();
    console.log('\nRecipes:', recipes.length);
    recipes.forEach(recipe => console.log(recipe.title));

    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

connectDB(); 