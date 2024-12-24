import { useQuery } from "@tanstack/react-query";
import { getMe } from "../utils/api";

export const useMe = () => {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: Infinity,
  });

  if (!query.data) {
    return null;
  }

  return query.data;
};
