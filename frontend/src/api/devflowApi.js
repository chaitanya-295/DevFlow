import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const devflowApi = createApi({
  reducerPath: 'devflowApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || localStorage.getItem('devflow_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Projects', 'Issues', 'Metrics', 'User', 'Teams', 'Releases'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Projects
    getProjects: builder.query({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Projects'],
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Projects', 'Metrics'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects', 'Metrics'],
    }),

    // Issues
    getIssues: builder.query({
      query: (params) => ({
        url: '/issues',
        params,
      }),
      providesTags: ['Issues'],
    }),
    createIssue: builder.mutation({
      query: (issue) => ({
        url: '/issues',
        method: 'POST',
        body: issue,
      }),
      invalidatesTags: ['Issues', 'Metrics'],
    }),
    updateIssueStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/issues/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Issues', 'Metrics'],
    }),
    deleteIssue: builder.mutation({
      query: (id) => ({
        url: `/issues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Issues', 'Metrics'],
    }),

    // Teams
    getTeams: builder.query({
      query: () => '/teams',
      providesTags: ['Teams'],
    }),
    createTeam: builder.mutation({
      query: (team) => ({
        url: '/teams',
        method: 'POST',
        body: team,
      }),
      invalidatesTags: ['Teams'],
    }),

    // Releases
    getReleases: builder.query({
      query: (params) => ({
        url: '/releases',
        params,
      }),
      providesTags: ['Releases'],
    }),
    createRelease: builder.mutation({
      query: (release) => ({
        url: '/releases',
        method: 'POST',
        body: release,
      }),
      invalidatesTags: ['Releases'],
    }),
    deleteRelease: builder.mutation({
      query: (id) => ({
        url: `/releases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Releases'],
    }),

    // Users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, ...profile }) => ({
        url: `/users/${id}/profile`,
        method: 'PATCH',
        body: profile,
      }),
      invalidatesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Analytics
    getDashboardMetrics: builder.query({
      query: () => '/analytics/overview',
      providesTags: ['Metrics'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetIssuesQuery,
  useCreateIssueMutation,
  useUpdateIssueStatusMutation,
  useDeleteIssueMutation,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetReleasesQuery,
  useCreateReleaseMutation,
  useDeleteReleaseMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserProfileMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetDashboardMetricsQuery,
} = devflowApi;
