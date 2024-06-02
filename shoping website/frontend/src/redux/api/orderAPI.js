import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const orderAPI = createApi({
    reducerPath: 'orderAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getMyOrders: builder.query({
            query() {
                return {
                    url: `/orders/myorders`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
            providesTags: (result, error, id) => {
                return [{ type: 'Orders', id }];
            },
            transformResponse: (results) =>
                results,
        }),
        getOrder: builder.query({
            query(id) {
                return {
                    url: `/orders/getOrder/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
        }),
    }),
});

export const {
    useGetMyOrdersQuery,
    useGetOrderQuery,
} = orderAPI;
