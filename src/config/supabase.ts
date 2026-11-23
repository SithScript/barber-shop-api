import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY)!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "As variáveis de ambiente SUPABASE_URL e SUPABASE_SECRET_KEY (ou SUPABASE_KEY) são obrigatórias.",
    );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
export default supabase;
