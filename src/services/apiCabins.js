import toast from "react-hot-toast";
import supabase, { supabaseUrl } from "./supabase";

//the below is promise and to we us ethen to the promise for the data
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // replacing / to "" , otherwise supabase will / take this as a new folder
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //1. CREATE/EDIT cabin

  let query = supabase.from("cabins");

  //A) CREATE cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  //B) EDIT cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  // insert() will not immidately return the element which was inserted but many times we need that to return the element so in these cases we use insert() aga iskay .select().single() to return newly created object/element and .single() is for single row or element;

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  //2. upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images") // bucket name
    .upload(imageName, newCabin.image); // (image name, actual image that user uploads)

  // 3. delete the cabin and image from the bucket if there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data[0]?.id);

    toast.dismiss();

    console.error(storageError.message);
    throw new Error(
      "Cabin image could not be upload and cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  toast.loading("Deleting...");
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  toast.dismiss();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
