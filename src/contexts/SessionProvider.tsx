import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
};

type SessionContextType = {
  session: Session | null;
  profile: Profile | null;
  organization: Organization | null;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  profile: null,
  organization: null,
  isLoading: true,
});

const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }

  return profileData;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    fetchInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      getProfile(session.user.id)
        .then(profileData => setProfile(profileData))
        .catch(e => {
          console.error("Falha ao carregar perfil:", e);
          setProfile(null);
        });

      // Buscar organização do usuário
      const fetchOrganization = async () => {
        try {
          const { data: orgMember, error: memberError } = await supabase
            .from('organization_members')
            .select('organizations(id, name, slug)')
            .eq('user_id', session.user.id)
            .single();

          if (memberError && memberError.code !== 'PGRST116') {
            console.error("Erro ao buscar organização:", memberError);
            return;
          }

          // Corrigindo o acesso aos dados da organização
          if (orgMember?.organizations) {
            // Acessando o primeiro elemento do array organizations
            const orgData = Array.isArray(orgMember.organizations) 
              ? orgMember.organizations[0] 
              : orgMember.organizations;
              
            if (orgData) {
              setOrganization({
                id: orgData.id,
                name: orgData.name,
                slug: orgData.slug
              });
            }
          }
        } catch (error) {
          console.error("Erro ao buscar organização:", error);
        }
      };

      fetchOrganization();
    } else {
      setProfile(null);
      setOrganization(null);
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, profile, organization, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);