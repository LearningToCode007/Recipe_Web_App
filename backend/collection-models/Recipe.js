import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true,
  },
  quantity: {
    type: mongoose.Schema.Types.Mixed, // Allows for both numeric and string values
    required: true,
  },
  measurement: {
    type: String,
    required: false,
  },
});

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [IngredientSchema],
      required: true,
    },
    steps: {
      type: [String],
      required: true,
    },
    writer_id: {
      type: String,
      ref: "RecipeWriter",
      required: true,
    },
    is_premium: {
      type: Boolean,
      required: true,
    },
    category_id: {
      type: String,
      ref: "Category",
      required: true,
    },
    approval_status: {
      type: String,
      required: true,
    },
    approval_date: {
      type: Date,
      required: false,
    },
    creation_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    recipe_image_url: {
      type: String,
      required: false,
    },
    num_of_views: {
      type: Number,
      required: false,
    },
    viewers: {
      type: [String],
      required: false,
    },
  },
  { collection: "recipes" }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;
