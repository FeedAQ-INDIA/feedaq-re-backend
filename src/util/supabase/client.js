import { createClient } from "@supabase/supabase-js";

const supabaserUrl = 'https://uaivdrttgkeqpewudcvy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaXZkcnR0Z2tlcXBld3VkY3Z5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2NTkzNywiZXhwIjoyMDY0MjQxOTM3fQ.7NdHWio7auKrM2Cl5-nsIN_31-0S6DOE8duLJETkEIc'
export const supabase= createClient(supabaserUrl, supabaseKey)