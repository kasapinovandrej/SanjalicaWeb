import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const createClient = () => createBrowserClient(supabaseUrl!, supabaseKey!);

const supabase = createClient();

export default supabase;
