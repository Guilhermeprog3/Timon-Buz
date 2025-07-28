import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';
import { supabase } from '../service/supabase';
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  name: string;
  role: 'passageiro' | 'motorista' | 'admin';
  empresa_id: string | null;
};

export type CompanySignUpData = {
  companyName: string;
  cnpj: string;
  adminName: string;
  email: string;
  password: string;
};

type AuthContextProps = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUpAsPassenger: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  signUpAsCompanyAdmin: (companyData: CompanySignUpData) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      }
      setIsLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
         const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.session) throw new Error("Login falhou, tente novamente.");
  };

  const signUpAsPassenger = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  };

  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw new Error(error.message);
  };

  const signUpAsCompanyAdmin = async (companyData: CompanySignUpData) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: companyData.email,
      password: companyData.password,
      options: { data: { name: companyData.adminName } }
    });

    if (signUpError) throw new Error(signUpError.message);
    if (!signUpData.user) throw new Error("Não foi possível criar o usuário administrador.");

    const { data: company, error: companyError } = await supabase
      .from('empresas')
      .insert({ nome: companyData.companyName, cnpj: companyData.cnpj })
      .select()
      .single();

    if (companyError) {
      await supabase.auth.admin.deleteUser(signUpData.user.id);
      throw new Error("Não foi possível criar a empresa: " + companyError.message);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin', empresa_id: company.id })
      .eq('id', signUpData.user.id);
    
    if (updateError) {
      await supabase.auth.admin.deleteUser(signUpData.user.id);
      await supabase.from('empresas').delete().eq('id', company.id);
      throw new Error("Não foi possível definir o usuário como admin: " + updateError.message);
    }
  };

  const deleteUserAccount = async () => {
    const { error: functionError } = await supabase.functions.invoke('delete-user');
    if (functionError) {
      throw new Error(functionError.message);
    }
    await supabase.auth.signOut();
  };


  return (
    <AuthContext.Provider value={{ 
        user, 
        profile, 
        session, 
        isLoading, 
        login, 
        logout, 
        resendConfirmationEmail, 
        signUpAsPassenger, 
        signUpAsCompanyAdmin, 
        deleteUserAccount 
    }}>
      {children}
    </AuthContext.Provider>
  );
};