import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Products"],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query(args) {
                return {
                    url: `/products`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result?.products
                    ? [
                        ...result.products.map(({ id }) => ({
                            type: 'Products',
                            id,
                        })),
                        { type: 'Products', id: 'LIST' },
                    ]
                    : [{ type: 'Products', id: 'LIST' }],
            transformResponse: (results) =>
                results,
        }),
        createProduct: builder.mutation({
            query(product) {
                return {
                    url: '/products/create',
                    method: 'POST',
                    credentials: 'include',
                    body: product,
                };
            },
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
            transformResponse: (result) =>
                result,
        }),
        updateProduct: builder.mutation(
            {
                query({ id, product }) {
                    return {
                        url: `/products/update/${id}`,
                        method: 'PUT',
                        credentials: 'include',
                        body: product,
                    };
                },
                invalidatesTags: (result, _error, { id }) =>
                    result
                        ? [
                            { type: 'Products', id },
                            { type: 'Products', id: 'LIST' },
                        ]
                        : [{ type: 'Products', id: 'LIST' }],
                transformResponse: (response) =>
                    response,
            }
        ),
        manageFavourite: builder.mutation({
            query(favourite) {
                return {
                    url: `/products/favorite`,
                    method: 'POST',
                    credentials: 'include',
                    body: favourite,
                };
            },
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
            transformResponse: (result) =>
                result,
        }),
        getProduct: builder.query({
            query(id) {
                return {
                    url: `/products/getProduct/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Products', id }],
        }),
        deleteProduct: builder.mutation({
            query(id) {
                return {
                    url: `/products/delete/${id}`,
                    method: 'Delete',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
        }),
        uploadProductImg: builder.mutation({
            query: (uploadProductImageRequest) => {
                var formData = new FormData();
                formData.append('productImg', uploadProductImageRequest.productFile);
                return {
                    url: '/products/upload/productImg',
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                };
            },
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
            transformResponse(result) {
                return result;
            },
        })
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImgMutation,
    useManageFavouriteMutation,
} = productAPI;
