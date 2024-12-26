import { queryOptions } from "@tanstack/react-query";
import { PromiseAllObject } from "../../utils";
import { getUserFollowers, getUserFollowing, getUserLikes, getUserYeets } from "../../utils/api";

export const userQueryOptions = (user: string) =>
  queryOptions({
    queryKey: ['users', user, { type: 'profile' }],
    queryFn: () =>
      PromiseAllObject({
        yeets: getUserYeets(user),
        following: getUserFollowing(user),
        followers: getUserFollowers(user),
        likes: getUserLikes(user),
      }),
    staleTime: 1000 * 10,
  })
