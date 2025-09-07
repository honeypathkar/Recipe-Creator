const PROD_BASE_API = import.meta.env.VITE_REACT_APP_PROD_BASE_API_URL;
// const LOCALHOST_BASE_API = import.meta.env
//   .VITE_REACT_APP_LOCALHOST_BASE_API_URL;
// Ensure base includes the server's prefix
const API_BASE = `${PROD_BASE_API}`;
export const LoginUrl = `${API_BASE}/users/login`;
export const VerifyOtp = `${API_BASE}/users/verifyOtp`;
export const RegisterUrl = `${API_BASE}/users/register`;
export const RecipeCreateUrl = `${API_BASE}/recipes/generate`;
export const RecipeDeleteUrl = `${API_BASE}/recipes/delete`;
export const GetUserRecipesUrl = `${API_BASE}/recipes/user`;
export const GetRecipeByID = `${API_BASE}/recipes/recipe`;
export const UserProfileUrl = `${API_BASE}/users/profile`;
export const UserDeleteUrl = `${API_BASE}/users/delete`;
export const AddToFavUrl = `${API_BASE}/fav/favorite`;
export const RemoveFavUrl = `${API_BASE}/fav/removeFav`;
export const GetFavUrl = `${API_BASE}/fav/userFav`;
export const GetAllRecipe = `${API_BASE}/recipes/all`;
export const LogoutUrl = `${API_BASE}/users/logout`;
export const ForgotPasswordUrl = `${API_BASE}/users/forgot-password`;
export const ResetPasswordWithOtpUrl = `${API_BASE}/users/reset-password-with-otp`;
export const SendOtp = `${API_BASE}/users/sendOtp`;
export const VerifyAccount = `${API_BASE}/users/verifyAccount`;
