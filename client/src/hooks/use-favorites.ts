import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFavorites() {
  return useQuery({
    queryKey: [api.favorites.list.path],
    queryFn: async () => {
      const res = await fetch(api.favorites.list.path);
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return api.favorites.list.responses[200].parse(await res.json());
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(api.favorites.toggle.path, {
        method: api.favorites.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.status === 401) throw new Error("Please login to save favorites");
      if (!res.ok) throw new Error("Failed to toggle favorite");
      return api.favorites.toggle.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.favorites.list.path] });
      toast({ 
        title: data.isFavorite ? "Added to favorites" : "Removed from favorites",
        variant: "default"
      });
    },
    onError: (err) => {
      toast({ 
        title: "Action failed", 
        description: err instanceof Error ? err.message : "Could not update favorites",
        variant: "destructive" 
      });
    }
  });
}
