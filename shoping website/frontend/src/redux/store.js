import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import userReducer from './api/userSlice';
import cartReducer from './api/cartSlice';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';
import { productAPI } from './api/productAPI';
import { homeAPI } from './api/homeAPI';
import { cartAPI } from './api/cartAPI';
import { orderAPI } from './api/orderAPI';
import { userAPI } from './api/userAPI';
import { favoriteAPI } from './api/favoriteAPI';

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [getMeAPI.reducerPath]: getMeAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [cartAPI.reducerPath]: cartAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [homeAPI.reducerPath]: homeAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [favoriteAPI.reducerPath]: favoriteAPI.reducer,
    userState: userReducer,
    cartState: cartReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        authAPI.middleware,
        getMeAPI.middleware,
        userAPI.middleware,
        productAPI.middleware,
        homeAPI.middleware,
        cartAPI.middleware,
        orderAPI.middleware,
        favoriteAPI.middleware,
    ])
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;