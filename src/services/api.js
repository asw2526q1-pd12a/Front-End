import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const userJson = localStorage.getItem('user'); // Or however you store your user
  if (userJson) {
    const user = JSON.parse(userJson);
    if (user.api_key) {
      config.headers['X-Api-Key'] = user.api_key;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper to set API Key
export const setApiKey = (key) => {
  if (key) {
    api.defaults.headers.common["x-api-key"] = key;
  } else {
    delete api.defaults.headers.common["x-api-key"];
  }
};

// --- SEARCH ---
export const search = (q, sort = "top", page = 1, perPage = 10) => {
  return api.get("/api/v1/search", {
    params: { q, sort, page, per_page: perPage },
  });
};

// --- USERS ---
export const getCurrentUser = () => api.get("/api/v1/users/me");

export const updateCurrentUser = (formData) => {
  return api.put("/api/v1/users/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCurrentUser = () => api.delete("/api/v1/users/me");

export const getUserById = (id) => api.get(`/api/v1/users/${id}`);

export const getUserPosts = (id, sort = "new") => {
  return api.get(`/api/v1/users/${id}/posts`, { params: { sort } });
};

export const getUserComments = (id, sort = "new") => {
  return api.get(`/api/v1/users/${id}/comments`, { params: { sort } });
};

export const getCurrentUserPosts = (sort = "new") => {
  return api.get("/api/v1/users/me/posts", { params: { sort } });
};

export const getCurrentUserComments = (sort = "new") => {
  return api.get("/api/v1/users/me/comments", { params: { sort } });
};

export const getCurrentUserSavedPosts = (sort = "new") => {
  return api.get("/api/v1/users/me/saved_posts", { params: { sort } });
};

export const getCurrentUserSavedComments = (sort = "new") => {
  return api.get("/api/v1/users/me/saved_comments", { params: { sort } });
};

// --- COMMUNITIES ---
export const getCommunities = (filter) => {
  const params = filter ? { filter } : {};
  return api.get("/api/v1/communities", { params });
};

export const createCommunity = (formData) => {
  return api.post("/api/v1/communities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getCommunity = (name) => api.get(`/api/v1/communities/${name}`);

export const subscribeCommunity = (name) =>
  api.post(`/api/v1/communities/${name}/subscribe`);

export const unsubscribeCommunity = (name) =>
  api.delete(`/api/v1/communities/${name}/unsubscribe`);

// --- POSTS ---
export const getPosts = (params) => {
  return api.get("/api/v1/posts", { params });
};

export const createPost = (formData) => {
  return api.post("/api/v1/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getPost = (id) => api.get(`/api/v1/posts/${id}`);

export const updatePost = (id, formData) => {
  return api.patch(`/api/v1/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePost = (id) => api.delete(`/api/v1/posts/${id}`);

export const upvotePost = (id) => api.post(`/api/v1/posts/${id}/upvote`);

export const downvotePost = (id) => api.post(`/api/v1/posts/${id}/downvote`);

export const getSubscribedPosts = (sort = "new") => {
  return api.get("/api/v1/posts/subscribed", { params: { sort } });
};

export const savePost = (id) => api.post(`/api/v1/posts/${id}/save`);

export const unsavePost = (id) => api.delete(`/api/v1/posts/${id}/save`);

// --- COMMENTS ---
export const getComments = (sort = "new") => {
  return api.get("/api/v1/comments", { params: { sort } });
};

export const getPostComments = (postId, sort = "top") => {
  return api.get(`/api/v1/posts/${postId}/comments`, { params: { sort } });
};

export const createComment = (postId, data) => {
  // data should be { comment: { content: '...', parent_id: ... } }
  return api.post(`/api/v1/posts/${postId}/comments`, data);
};

export const getComment = (id) => api.get(`/api/v1/comments/${id}`);

export const updateComment = (id, data) => {
  // data should be { comment: { content: '...' } }
  return api.patch(`/api/v1/comments/${id}`, data);
};

export const deleteComment = (id) => api.delete(`/api/v1/comments/${id}`);

export const upvoteComment = (id) => api.post(`/api/v1/comments/${id}/upvote`);

export const downvoteComment = (id) =>
  api.post(`/api/v1/comments/${id}/downvote`);

export const getSubscribedComments = (sort = "new") => {
  return api.get("/api/v1/comments/subscribed", { params: { sort } });
};

export const saveComment = (id) => api.post(`/api/v1/comments/${id}/save`);

export const unsaveComment = (id) => api.delete(`/api/v1/comments/${id}/save`);

export { API_BASE_URL };
export default api;
