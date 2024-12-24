import { BASE_URL } from "./constants";

export const getApiUrl = (path: string) => `${BASE_URL}${path}`;

export const getRequest = async <T extends Record<string, any>>(
  url: string
): Promise<T> => {
  const response = await fetch(getApiUrl(url));
  return response.json();
};

export const postRequest = async <T extends Record<string, any>>(
  url: string,
  data: Record<string, any>
): Promise<T> => {
  const response = await fetch(getApiUrl(url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export type YeetT = {
  yeet_id: number;
  date: number;
  content: string;
  author: string;
  reply_to?: number;
};

export const getAllYeets = async () =>
  getRequest<{ response: number[] }>("/yee/yeets/all");
export const getYeet = async (yeet_id: number) =>
  getRequest<{ response: YeetT }>(`/yee/yeets/${yeet_id}`);
export const getYeetLikes = async (yeet_id: number) =>
  getRequest<{ response: string[] }>(`/yee/yeets/${yeet_id}/likes`);
export const getYeetReplies = async (yeet_id: number) =>
  getRequest<{ response: number[] }>(`/yee/yeets/${yeet_id}/replies`);
export const createYeet = async (
  data: Omit<YeetT, "yeet_id" | "date" | "author">
) => postRequest<Record<never, any>>("/yee/yeets/add", data);
export const removeYeet = async (yeet_id: number) =>
  postRequest<Record<never, any>>(`/yee/yeets/remove`, { yeet_id });

export const getAllUsers = async () =>
  getRequest<{ response: string[] }>("/yee/users/all");
export const getUserYeets = async (author: string) =>
  getRequest<{ response: number[] }>(`/yee/users/${author}/yeets`);
export const getUserFollowing = async (author: string) =>
  getRequest<{ response: string[] }>(`/yee/users/${author}/following`);
export const getUserFollowers = async (author: string) =>
  getRequest<{ response: string[] }>(`/yee/users/${author}/followers`);
export const getUserLikes = async (author: string) =>
  getRequest<{ response: number[] }>(`/yee/users/${author}/likes`);

export const createLike = async (yeet_id: number) =>
  postRequest<Record<never, any>>(`/yee/likes/add`, { yeet_id });
export const removeLike = async (yeet_id: number) =>
  postRequest<Record<never, any>>(`/yee/likes/remove`, { yeet_id });

export const followUser = async (username: string) =>
  postRequest<Record<never, any>>(`/yee/follows/add`, { username });
export const unfollowUser = async (username: string) =>
  postRequest<Record<never, any>>(`/yee/follows/remove`, { username });

export const getMe = async () => getRequest<{ username: string }>("/me");
