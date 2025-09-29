// Mock Supabase client - temporary replacement during migration
export const supabase = {
  from: (table: string) => ({
    select: (fields?: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          order: (column: string, options?: any) => Promise.resolve({ data: [], error: null })
        }),
        single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
      }),
      order: (column: string, options?: any) => ({
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null })
      }),
      single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null })
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => ({ 
      data: { subscription: { unsubscribe: () => {} } } 
    }),
    signUp: (credentials: any) => Promise.resolve({ data: null, error: null }),
    signInWithPassword: (credentials: any) => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: null, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } }),
      remove: (paths: string[]) => Promise.resolve({ error: null })
    })
  },
  rpc: (name: string, params?: any) => Promise.resolve({ data: null, error: null })
};