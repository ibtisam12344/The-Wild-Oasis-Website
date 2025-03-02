import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";

import toast from "react-hot-toast";

export function useEditCabin() {
  // whenever there is any mutation like update , delete or insert we use useMutation hook
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: editCabin } = useMutation({
    // we need to change it a little but because in react query we can only pass one element per muataionFn as it is same as above had been passed , so create arrow function below
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),

    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },

    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editCabin };
}
