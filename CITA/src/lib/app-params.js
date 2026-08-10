const getLocalUser = () => ({
  id: process.env.NEXT_PUBLIC_LOCAL_USER_ID || 'local-dev-user',
  email: process.env.NEXT_PUBLIC_LOCAL_USER_EMAIL || 'admin@local.dev',
  full_name: process.env.NEXT_PUBLIC_LOCAL_USER_NAME || 'Local Admin',
  role: process.env.NEXT_PUBLIC_LOCAL_USER_ROLE || 'intake_admin',
});

export const appParams = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '',
  participantsTable: process.env.NEXT_PUBLIC_SUPABASE_PARTICIPANTS_TABLE || 'participants',
  usersTable: process.env.NEXT_PUBLIC_SUPABASE_USERS_TABLE || 'profiles',
  localBypassAuth:
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_LOCAL_BYPASS_AUTH !== 'false',
  authRedirectPath: process.env.NEXT_PUBLIC_AUTH_REDIRECT_PATH || '/login',
  localUser: getLocalUser(),
};
