import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Aceita tanto SUPABASE_SECRET_KEY quanto SUPABASE_KEY
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("As variáveis de ambiente SUPABASE_URL e SUPABASE_SECRET_KEY (ou SUPABASE_KEY) são obrigatórias.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);