import axios from 'axios';

const BASE_URL = 'http://localhost:3002/api';

const testEndpoints = async () => {
  try {
    console.log('Testing API endpoints...\n');

    // Test Categories endpoint
    console.log('1. Testing Categories endpoint:');
    const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
    console.log('Categories:', categoriesResponse.data.length, 'items found');
    console.log('Sample category:', categoriesResponse.data[0]);
    console.log('\n-------------------\n');

    // Test Recipes endpoint
    console.log('2. Testing Recipes List endpoint:');
    const recipesResponse = await axios.get(`${BASE_URL}/recipes`);
    console.log('Recipes:', recipesResponse.data.length, 'items found');
    const sampleRecipeId = recipesResponse.data[0]._id;
    console.log('Sample recipe ID:', sampleRecipeId);
    console.log('\n-------------------\n');

    // Test Recipe Details endpoint
    console.log('3. Testing Recipe Details endpoint:');
    const recipeDetailsResponse = await axios.get(`${BASE_URL}/recipes/${sampleRecipeId}`);
    console.log('Recipe Details:', recipeDetailsResponse.data);
    console.log('\n-------------------\n');

    // Test Recipe Writers endpoint
    console.log('4. Testing Recipe Writers endpoint:');
    const writersResponse = await axios.get(`${BASE_URL}/recipe-writers`);
    console.log('Recipe Writers:', writersResponse.data.length, 'items found');
    console.log('Sample writer:', writersResponse.data[0]);
    console.log('\n-------------------\n');

  } catch (error) {
    console.error('Error testing endpoints:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

testEndpoints(); 