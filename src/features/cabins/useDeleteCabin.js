import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  // use mutation is used to mutate the data with react query
  // it gives us isLoading state and mutate function which we can immidately get by destructring
  // mutate function can be used mutate(id) by passing a id or prop it will be go in mutateFn
  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    // mutationFn: (id) => deleteCabin(id),
    // this function return onSucces and Onerror as it is promise
    //same thing below as above
    mutationFn: deleteCabinApi,
    // so now data will be deleted but it will displayed unless we reload because data will not re-fetch automatically
    // so we need to tell that the previous cache is now invalid after sucessing of this mutation , data should be re fetched again
    // we need to tell that this query client is invalid now , and we will specify the querykey to only that will be refetched
    // to select queryclient we use useQueryClient hook and invalid it by using queryClient.invalidateQueries({tell here which query shluld be invalidate by telling the name with the querykey like cabin which we specified})
    // onSuccess: function
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    // this error is coming from an deleteCabin promise
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
