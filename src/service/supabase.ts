import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjxdhbwroewmhtstwrkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqeGRoYndyb2V3bWh0c3R3cmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2OTQ3OTIsImV4cCI6MjA2ODI3MDc5Mn0.M-u58kIisiQI39tZlwkWC3umJqO9im4CoyqjXNLyKhw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});