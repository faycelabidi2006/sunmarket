import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xhyisfvtfumqvddyvxrb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeWlzZnZ0ZnVtcXZkZHl2eHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzI4MjMsImV4cCI6MjA5NDMwODgyM30.8_dF2UocnNuJT-yIDO8ihi1gLFTQBxn0rrrnk3r-klY'
)