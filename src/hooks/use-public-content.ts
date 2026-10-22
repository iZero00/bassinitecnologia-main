import { useQuery } from "@tanstack/react-query";
import { publicEntries } from "@/lib/cms";
export function usePublicContent() { const query = useQuery({ queryKey: ["cms-public"], queryFn: publicEntries, staleTime: 60000, retry: 1 }); return { ...query, rows: query.data || [], settings: query.data?.find(r => r.resource === "settings")?.payload }; }
