import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import categoryReducer from './categorySlice';
// TODO: Re-enable other reducers after fixing localStorage issues
// import quizReducer from './quizSlice';
// import consultationReducer from './consultationSlice';
// import usersReducer from './usersSlice';
// import cmsReducer from './cmsSlice';
// import platformSettingsReducer from './platformSettingsSlice';
// import subcategoryReducer from './subcategorySlice';
// import productReducer from './productSlice';
// import subSubcategoryReducer from './subsubcategorySlice';
// import productSeoReducer from './productSeoSlice';
// import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    // TODO: Re-enable other reducers after fixing localStorage issues
    // users: usersReducer,
    // cms: cmsReducer,
    // quiz: quizReducer,
    // consultation: consultationReducer,
    // platformSettings: platformSettingsReducer,
    // subcategory: subcategoryReducer,
    // subsubcategory: subSubcategoryReducer,
    // products: productReducer,
    // productTags: productTagReducer,
    // productFurniture: productFurnitureReducer,
    // productSpecs: productSpecReducer,
    // productLogistics: productLogisticsReducer,
    // productSeo: productSeoReducer,
    // subscriptions: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;