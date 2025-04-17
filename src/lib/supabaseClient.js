// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient('https://cmakuvkjxknwhonfqbit.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtYWt1dmtqeGtud2hvbmZxYml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTU4NDUsImV4cCI6MjA1ODU3MTg0NX0.BYCf-Yw6vNH1hfQqLOLoeFfDHxRlbhEGGHKhvx2UXz4');