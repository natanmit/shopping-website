import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const favoriteAPI = createApi({
    reducerPath: "favoriteAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Favorites"],
    endpoints: (builder) => ({
        getFavorites: builder.query({
            query(args) {
                return {
                    url: `/favorites`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Favorites',
                            id,
                        })),
                        { type: 'Favorites', id: 'LIST' },
                    ]
                    : [{ type: 'Favorites', id: 'LIST' }],
            transformResponse: (results) =>
                results,
        }),

        deleteFavorite: builder.mutation({
            query(id) {
                return {
                    url: `/favorites/delete/${id}`,
                    method: 'Delete',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Favorites', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useDeleteFavoriteMutation,
} = favoriteAPI;
