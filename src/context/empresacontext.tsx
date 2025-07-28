import React, { createContext, PropsWithChildren, useState, useCallback } from 'react';
import { supabase } from '../service/supabase';

export type Empresa = {
  id: string;
  nome: string;
  cnpj: string;
};

type EmpresaContextProps = {
  empresas: Empresa[];
  getEmpresas: () => Promise<void>;
  isLoading: boolean;
};

export const EmpresaContext = createContext<EmpresaContextProps>({} as EmpresaContextProps);

export const EmpresaProvider = ({ children }: PropsWithChildren) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getEmpresas = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('empresas').select('*');
      if (error) throw error;
      setEmpresas(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar empresas:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <EmpresaContext.Provider value={{ empresas, getEmpresas, isLoading }}>
      {children}
    </EmpresaContext.Provider>
  );
};