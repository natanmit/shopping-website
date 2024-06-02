import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { setCart } from './cartSlice';

export const cartAPI = createApi({
    reducerPath: 'cartAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Carts'],
    endpoints: (builder) => ({
        createCart: builder.mutation({
            query(cart) {
                return {
                    url: '/carts/create',
                    method: 'POST',
                    credentials: 'include',
                    body: cart,
                };
            },
            invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
            transformResponse: (result) => result,
            async onQueryStarted(_args, { dispatch }) {
                try {
                    await dispatch(cartAPI.endpoints.getMyCarts.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        getMyCarts: builder.query({
            query() {
                return {
                    url: `/carts/mycart`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
            providesTags: (result, error, id) => {
                return [{ type: 'Carts', id }];
            },
            transformResponse: (results) => results,
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCart(data));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        deleteCart: builder.mutation({
            query(id) {
                return {
                    url: `/carts/delete/${id}`,
                    method: 'Delete',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
        }),
        checkoutCart: builder.mutation({
            query(checkoutData) {
                return {
                    url: '/carts/checkout',
                    method: 'POST',
                    credentials: 'include',
                    body: checkoutData,
                };
            },
            invalidatesTags: [{ type: 'Carts', id: 'LIST' }],
            transformResponse: (result) =>
                result,
        }),
    }),
});

export const {
    useCreateCartMutation,
    useDeleteCartMutation,
    useGetMyCartsQuery,
    useCheckoutCartMutation,
} = cartAPI;
