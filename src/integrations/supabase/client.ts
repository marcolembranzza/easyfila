// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mclsaxppvuylyxxbmsvn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbHNheHBwdnV5bHl4eGJtc3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNjkyMjcsImV4cCI6MjA0Njg0NTIyN30.T4W4puHVY_gszZ6Yg7N5oTTkWOzHYu6Jre8q3cut6Ps";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);