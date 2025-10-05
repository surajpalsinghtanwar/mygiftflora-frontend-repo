import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import cmsReducer from './cmsSlice';
import platformSettingsReducer from './platformSettingsSlice';
import categoryReducer from './categorySlice';
import subcategoryReducer from './subcategorySlice';
import productReducer from './productSlice';
import subSubcategoryReducer from './subsubcategorySlice';
import productTagReducer from './productTagSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    cms: cmsReducer,
    platformSettings: platformSettingsReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
    subsubcategory: subSubcategoryReducer,
    products: productReducer,
    productTags: productTagReducer,
    subscriptions: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
