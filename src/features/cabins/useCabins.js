import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    //querykey is just for indentification or it is just a name so we can call this data again by this name
    queryKey: ["cabins"],
    //queryFn is basically the function which ic responsible for fetching the data, the function we specify here needs to return a promise
    // example: queryFn: fetch("URL")
    queryFn: getCabins,
  });

  return { isLoading, cabins, error };
}
