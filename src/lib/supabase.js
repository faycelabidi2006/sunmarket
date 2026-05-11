import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      'https://tysnbikyhznxzbdaaxsq.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c25iaWt5aHpueHpiZGFheHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NDgxNTcsImV4cCI6MjA5MzQyNDE1N30.jpnJtpVTkUZm2fymGFTFzrIOOhTYl56ish_ps4tHiTA'
    )
  }
  return supabaseInstance
})()