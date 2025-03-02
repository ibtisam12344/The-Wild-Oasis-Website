import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { createCabin } from "../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import FormRow from "../../ui/FormRow";

function CreateCabinForm() {
  // this is coming from react-hook-form to manage form , it gives us a register and handleSubmit function
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  // we can get errors of the form by using formState
  //getValue function is for if we want to use form values in the form, it returns an object and then we get value by getValues().name
  //reset is used to reset all the values in the form
  //register is to register inputs into this hook , it is used like this in input fileds {...register("name of input field"<{for validation object})

  // whenever there is any mutation like update , delete or insert we use useMutation hook
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: createCabin,

    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      // reset();
    },

    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    // for image we just have to send only the image but the object is coming from an input file and length , we only need to send a file not a length

    const imageName = `${Math.random()}-${data.image[0].name}`.replaceAll(
      "/",
      ""
    );
    mutate({ ...data, image: data.image[0] });
  }

  function onError(errors) {
    // console.log(errors)
  }

  // if there is any field required is not fill then handle submit will call onError function
  return (
    <Form
      onSubmit={handleSubmit(
        (data) => onSubmit(data),
        //onSubmit , it can simply be called that
        (errors) => onError(errors)
        //onError
      )}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          disabled={isCreating}
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
            // similarly min value we can do max as well
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          disabled={isCreating}
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            // similarly min value we can do max as well
            min: {
              value: 1,
              message: "Capacity should be at least 1.",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          disabled={isCreating}
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Regular price should be at least 1.",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          disabled={isCreating}
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            // we can also specify a validate: function , our custom validation, like we want discount < regular price
            //validate : callback function, (our value of this input)=>logic || error messege
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          disabled={isCreating}
          type="number"
          id="description"
          defaultValue=""
          {...register("description", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          disabled={isCreating}
          id="image"
          accept="image/*"
          {...register("image", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button type="reset">Cancel</Button>
        <Button disabled={isCreating}>Add Cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
