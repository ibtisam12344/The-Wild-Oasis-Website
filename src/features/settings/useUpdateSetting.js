import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";

export function useUpdateSetting() {
  // whenever there is any mutation like update , delete or insert we use useMutation hook
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateSetting } = useMutation({
    // we need to change it a little but because in react query we can only pass one element per muataionFn as it is same as above had been passed , so create arrow function below
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success("Setting successfully updated");
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },

    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateSetting };
}
