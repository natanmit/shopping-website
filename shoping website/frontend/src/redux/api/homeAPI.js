import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/api`;

export const homeAPI = createApi({
    reducerPath: 'homeAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl
    }),
    endpoints: (builder) => ({
        getHomeProducts: builder.query({
            query(args) {
                return {
                    url: `/products/getHome`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result.products
                    ? [
                        ...result.products.map(({ id }) => ({
                            type: 'Home',
                            id,
                        })),
                        { type: 'Home', id: 'LIST' },
                    ]
                    : [{ type: 'Home', id: 'LIST' }],
            transformResponse: (results) =>
                results,
        }),
        getSearchProduct: builder.mutation({
            query(search) {
                return {
                    url: '/products/search',
                    method: 'POST',
                    credentials: 'include',
                    body: search,
                };
            },
            invalidatesTags: [{ type: 'Home', id: 'LIST' }],
            transformResponse: (result) =>
                result,
        }),
    }),
});

export const {
    useGetHomeProductsQuery,
    useGetSearchProductMutation,
} = homeAPI;
