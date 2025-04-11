const PROD_BASE_API = import.meta.env.VITE_REACT_APP_PROD_BASE_API_URL;
const LOCALHOST_BASE_API = import.meta.env
  .VITE_REACT_APP_LOCALHOST_BASE_API_URL;
export const LoginUrl = `${PROD_BASE_API}/users/login`;
export const VerifyOtp = `${PROD_BASE_API}/users/verify-otp`;
export const RegisterUrl = `${PROD_BASE_API}/users/register`;
export const RecipeCreateUrl = `${PROD_BASE_API}/recipes/generate`;
export const RecipeDeleteUrl = `${PROD_BASE_API}/recipes/delete`;
export const GetUserRecipesUrl = `${PROD_BASE_API}/recipes/user`;
export const GetRecipeByID = `${PROD_BASE_API}/recipes/recipe`;
export const UserProfileUrl = `${PROD_BASE_API}/users/profile`;
export const UserDeleteUrl = `${PROD_BASE_API}/users/delete`;
export const AddToFavUrl = `${PROD_BASE_API}/fav/favorite`;
export const RemoveFavUrl = `${PROD_BASE_API}/fav/removeFav`;
export const GetFavUrl = `${PROD_BASE_API}/fav/userFav`;
export const GetAllRecipe = `${PROD_BASE_API}/recipes/all`;
export const LogoutUrl = `${PROD_BASE_API}/users/logout`;
export const ForgotPasswordUrl = `${PROD_BASE_API}/users/forgot-password`;
export const ResetPasswordWithOtpUrl = `${PROD_BASE_API}/users/reset-password-with-otp`;
