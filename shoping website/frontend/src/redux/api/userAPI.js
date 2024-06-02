import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { removeToken, removeUserData, setUserData } from '../../utils/Utils';
import { logout, setUser } from './userSlice';

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        updateUser: builder.mutation(
            {
                query(user) {
                    return {
                        url: `/users/update/profile`,
                        method: 'PUT',
                        credentials: 'include',
                        body: user,
                    };
                },
                invalidatesTags: (result, _error, { id }) =>
                    result
                        ? [
                            { type: 'Users', id },
                            { type: 'Users', id: 'LIST' },
                        ]
                        : [{ type: 'Users', id: 'LIST' }],
                transformResponse: (response) =>
                    response,
            }
        ),

        deleteUser: builder.mutation({
            query(id) {
                return {
                    url: `/users/delete/${id}`,
                    method: 'Delete',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    removeToken();
                    removeUserData();
                    dispatch(logout());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        uploadProfileImg: builder.mutation({
            query: (avatarFile) => {
                var formData = new FormData();
                formData.append('avatarFile', avatarFile);
                return {
                    url: '/users/upload/avatarFile',
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            transformResponse(result) {
                return result;
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const response = await queryFulfilled;
                    setUserData(JSON.stringify(response.data.updateAvatar));
                    dispatch(setUser(response.data.updateAvatar));
                } catch (error) {
                    console.log(error);
                }
            }
        })

    }),
});

export const {
    useDeleteUserMutation,
    useUpdateUserMutation,
    useUploadProfileImgMutation,
} = userAPI;
