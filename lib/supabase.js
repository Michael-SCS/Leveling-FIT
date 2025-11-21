import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REPLACE THESE WITH YOUR OWN SUPABASE CREDENTIALS ⚠️
const supabaseUrl = 'https://hoqqpygofpxpfxfwxhis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcXFweWdvZnB4cGZ4Znd4aGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjM3MDQsImV4cCI6MjA3OTIzOTcwNH0.43iCiTEWIbVCmZj6C-VMHKYB7kLAh_XJvQcssFXuBJo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
