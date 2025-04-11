import express from "express";
const router = express.Router();
import Recipe from "../collection-models/Recipe.js";
import Subscriber from "../collection-models/Subscriber.js";
import RecipeWriter from "../collection-models/RecipeWriter.js";
import multer from "multer";
import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs";
import Category from "../collection-models/Category.js";
import Admin from "../collection-models/Admin.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.FILE_PATH);
  },
  filename: function (req, file, cb) {
    const recipeId = new ObjectId().toString();
    const uniqueFileName = `${recipeId}_${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const { search, category_id, premium, sortBy } = req.query;
    console.log("Received query parameters:", { search, category_id, premium, sortBy }); // Debug log
    
    let query = {};
    
    // Build search query with improved matching
    if (search) {
      const searchTerm = search.trim();
      if (searchTerm.length > 0) {
        query.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ];
      }
    }
    
    // Add category filter if provided and not "all"
    if (category_id && category_id !== "all") {
      query.category_id = category_id;
    }
    
    // Add premium filter if provided
    if (premium) {
      if (premium.toLowerCase() === 'premium') {
        query.is_premium = true;
      } else if (premium.toLowerCase() === 'free') {
        query.is_premium = false;
      }
    }
    
    // Only return approved recipes
    query.approval_status = "approved";
    
    // Create sort object
    let sortObject = {};
    if (sortBy) {
      if (sortBy.toLowerCase() === 'views') {
        sortObject.num_of_views = -1;
      } else if (sortBy.toLowerCase() === 'date') {
        sortObject.creation_date = -1;
      } else {
        sortObject.title = 1;
      }
    } else {
      sortObject.title = 1;
    }
    
    console.log("Final query:", query); // Debug log
    console.log("Sort object:", sortObject); // Debug log
    
    const recipes = await Recipe.find(query).sort(sortObject);
    console.log("Found recipes:", recipes.length); // Debug log
    
    // Get additional details for each recipe
    const finalRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const recipeJson = recipe.toJSON();
        // Get category details
        if (recipeJson.category_id) {
          try {
            const category = await Category.findById(recipeJson.category_id);
            recipeJson.category = category ? category.toJSON() : null;
          } catch (err) {
            console.error("Error fetching category:", err);
          }
        }
        return recipeJson;
      })
    );
    
    res.json(finalRecipes);
  } catch (err) {
    console.error("Error in GET /recipes:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.get("/user/:writer_id", async (req, res) => {
  const writer_id = req.params.writer_id;
  try {
    const recipes = await Recipe.find({ writer_id });
    const finalRecipes = await Promise.all(
      recipes.map((recipe) => getAdditionalRecipeDetails(recipe.toJSON()))
    );
    res.json(finalRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/favorites/subscriber/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const subscriber = await Subscriber.findById(userId);
    if (!subscriber) {
      return res.status(404).json({ msg: "Subscriber not found" });
    }
    const favoriteRecipeIds = subscriber.favorites_list;
    const recipes = await Recipe.find({ _id: { $in: favoriteRecipeIds } });
    const finalRecipes = await Promise.all(
      recipes.map(getAdditionalRecipeDetails)
    );
    res.json(finalRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/favorites/recipe-writer/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const writer = await RecipeWriter.findById(userId);
    if (!writer) {
      return res.status(404).json({ msg: "Recipe writer not found" });
    }
    const favoriteRecipeIds = writer.favorites_list;
    const recipes = await Recipe.find({ _id: { $in: favoriteRecipeIds } });
    const finalRecipes = await Promise.all(
      recipes.map(getAdditionalRecipeDetails)
    );
    res.json(finalRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    const finalRecipe = await getAdditionalRecipeDetails(recipe.toJSON());
    res.json(finalRecipe);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const {
    title,
    description,
    ingredients,
    instructions,
    category_id,
    writer_id,
    is_premium,
    approval_status,
  } = req.body;
  try {
    const recipeId = new ObjectId().toString(); // Generate a unique ID for the recipe

    // Construct the unique file name
    const originalFileName = req.file.originalname;
    const uniqueFileName = `${recipeId}_${originalFileName}`;

    // Move the file to the final location with the unique name
    const finalPath = path.join(req.file.destination, uniqueFileName);
    fs.renameSync(req.file.path, finalPath);

    // Create and save the new recipe
    const newRecipe = new Recipe({
      _id: recipeId,
      title,
      description,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(instructions),
      recipe_image_url: uniqueFileName, // Save only the unique file name in the database
      category_id,
      writer_id,
      is_premium: is_premium,
      approval_status,
    });

    const recipe = await newRecipe.save();
    const finalRecipe = await getAdditionalRecipeDetails(recipe.toJSON());
    res.json(finalRecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const {
    title,
    description,
    ingredients,
    instructions,
    category_id,
    writer_id,
    is_premium,
    approval_status,
  } = req.body;

  try {
    const recipeId = req.params.id;

    const recipeFields = {};
    if (title) recipeFields.title = title;
    if (description) recipeFields.description = description;
    if (ingredients) recipeFields.ingredients = JSON.parse(ingredients);
    if (instructions) recipeFields.steps = JSON.parse(instructions);
    if (category_id) recipeFields.category_id = category_id;
    if (writer_id) recipeFields.writer_id = writer_id;
    if (is_premium) recipeFields.is_premium = is_premium;
    if (approval_status) recipeFields.approval_status = approval_status;

    if (req.file?.originalname) {
      const originalFileName = req.file.originalname;
      const uniqueFileName = `${recipeId}_${originalFileName}`;

      // Move the file to the final location with the unique name
      const finalPath = path.join(req.file.destination, uniqueFileName);
      fs.renameSync(req.file.path, finalPath);
      recipeFields.recipe_image_url = uniqueFileName;
    }

    let recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $set: recipeFields },
      { new: true }
    );
    const finalRecipe = await getAdditionalRecipeDetails(recipe.toJSON());
    res.json(finalRecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id/increment-views", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.body.userId;

    let recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Check if the user is already in the viewers list
    if (!recipe.viewers.includes(userId) && recipe.writer_id !== userId) {
      // Add user to viewers list and increment views_count

      // Find the recipe writer and admin
      let recipeWriter = await RecipeWriter.findById(recipe.writer_id);
      if (!recipeWriter) {
        recipeWriter = await Subscriber.findById(recipe.writer_id);
        if (recipeWriter)
          recipe.writer_name = `${recipeWriter.first_name} ${recipeWriter.last_name}`;
      }
      const admin = await Admin.findOne();

      if (recipeWriter && admin) {
        // Update compensation balance for recipe writer and admin
        recipeWriter.compensation_balance += 0.9;
        admin.amount += 0.1;
        recipe.viewers.push(userId);
        recipe.num_of_views = (recipe.num_of_views || 0) + 1;

        // Save updates
        await recipe.save();
        await recipeWriter.save();
        await admin.save();
      } else {
        return res.status(500).json({ msg: "Writer or Admin not found" });
      }
    }

    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    await Recipe.findByIdAndRemove(req.params.id);
    res.json({ msg: "Recipe removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const getAdditionalRecipeDetails = async (recipe) => {
  const category = await Category.findById(recipe.category_id);
  if (category) recipe.category_name = category.name;

  const writer = await RecipeWriter.findById(recipe.writer_id);
  if (writer) recipe.writer_name = `${writer.first_name} ${writer.last_name}`;

  if (!writer) {
    const subscriber = await Subscriber.findById(recipe.writer_id);
    if (subscriber)
      recipe.writer_name = `${subscriber.first_name} ${subscriber.last_name}`;
  }

  return recipe;
};

export default router;
