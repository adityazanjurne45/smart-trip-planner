import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdminRole() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) check(session.user.id);
      else { setIsAdmin(false); setLoading(false); }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) check(session.user.id);
      else { setIsAdmin(false); setLoading(false); }
    });

    async function check(uid: string) {
      const { data } = await supabase.rpc("has_role" as any, { _user_id: uid, _role: "admin" });
      setIsAdmin(data === true);
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
