// Supabase client placeholder - will be replaced by actual implementation
export const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string) => ({
          then: async () => ({ data: [], error: null })
        })
      }),
      order: (column: string) => ({
        then: async () => ({ data: [], error: null })
      }),
      then: async () => ({ data: [], error: null })
    }),
    insert: (data: any) => ({
      then: async () => ({ data: null, error: null })
    })
  }),
  functions: {
    invoke: async (name: string, options: any) => ({ data: null, error: null })
  }
};