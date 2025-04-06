import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./app/layout/HomePage";
import Layout from "./app/layout/Layout";
import AccessDenied from "./app/login/AccessDenied";
import Logout from "./app/login/Logout";
import NotFound from "./app/login/NotFound";
import SubscriberLogin from "./app/subscriber/SubscriberLogin";
import { AuthProvider } from "./context/AuthContext";
import SubscriberRegister from "./app/subscriber/SubscriberRegister";
import RecipeList from "./app/home/RecipeList";
import RecipeDetails from "./app/home/RecipeDetails";
import BuyPremium from "./app/home/BuyPremium";
import FavoriteRecipes from "./app/subscriber/FavoriteRecipes";
import PremiumDetails from "./app/subscriber/PremiumDetails";
import RecipeWriterLogin from "./app/recipe-writer/RecipeWriterLogin";
import MyRecipeList from "./app/recipe-writer/MyRecipeList";
import RecipeCreate from "./app/recipe-writer/RecipeCreate";
import RecipeUpdate from "./app/recipe-writer/RecipeUpdate";
import AdminLogin from "./app/admin/AdminLogin";
import AdminRecipes from "./app/admin/AdminRecipes";
import AdminRecipeWriters from "./app/admin/AdminRecipeWriters";
import AdminSubscribers from "./app/admin/AdminSubscribers";
import AdminRecipeWriterRecipes from "./app/admin/AdminRecipeWriterRecipes";
import RecipeWriterRegister from "./app/recipe-writer/RecipeWriterRegister";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route
              exact
              path="/subscriber/login"
              element={<SubscriberLogin />}
            />
            <Route exact path="/login" element={<SubscriberLogin />} />
            <Route
              exact
              path="/subscriber/register"
              element={<SubscriberRegister />}
            />
            <Route exact path="/register" element={<SubscriberRegister />} />
            <Route exact path="/search-recipes" element={<RecipeList />} />
            <Route
              exact
              path="/recipes/:recipeId/details"
              element={<RecipeDetails />}
            />
            <Route exact path="/recipes/buy-premium" element={<BuyPremium />} />

            {/* subscirber urls */}
            <Route
              exact
              path="/subscriber/favorite-recipes"
              element={<FavoriteRecipes />}
            />
            <Route exact path="/premium-details" element={<PremiumDetails />} />

            {/* Recipe writers urls */}
            <Route
              exact
              path="/recipe-writer/login"
              element={<RecipeWriterLogin />}
            />
            <Route
              exact
              path="/recipe-writer/register"
              element={<RecipeWriterRegister />}
            />
            <Route
              exact
              path="/recipe-writer/favorite-recipes"
              element={<FavoriteRecipes />}
            />
            <Route
              exact
              path="/recipe-writer/my-recipes"
              element={<MyRecipeList />}
            />
            <Route
              exact
              path="/recipe-writer/my-recipes/create"
              element={<RecipeCreate />}
            />
            <Route
              exact
              path="/recipe-writer/my-recipes/:recipeId/edit"
              element={<RecipeUpdate />}
            />

            {/* Admin Urls */}
            <Route exact path="/admin/login" element={<AdminLogin />} />
            <Route exact path="/admin/recipes" element={<AdminRecipes />} />
            <Route
              exact
              path="/admin/recipe-writers"
              element={<AdminRecipeWriters />}
            />
            <Route
              exact
              path="/admin/recipe-writers/:writerId/view-recipes"
              element={<AdminRecipeWriterRecipes />}
            />
            <Route
              exact
              path="/admin/subscribers"
              element={<AdminSubscribers />}
            />

            <Route exact path="/logout" element={<Logout />} />
            <Route exact path="/access-denied" element={<AccessDenied />} />
            <Route exact path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
