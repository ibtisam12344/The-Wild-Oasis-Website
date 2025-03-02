import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://abpoowyhcrewackbsrvh.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicG9vd3loY3Jld2Fja2JzcnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDQ4MjcsImV4cCI6MjA0MzAyMDgyN30.AagSubfG57h630ZE5r5XgOM-Gl-VUj4jwM1p3x1K92M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
