import React, { createContext, PropsWithChildren, useState, useCallback, useContext } from 'react';
import { supabase } from '../service/supabase';
import { AuthContext } from './authcontext';
import { Alert } from 'react-native';

export type Linha = {
  id: string;
  nome: string;
  numero: string;
  empresa_id: string;
  created_at: string;
};

type CreateLinhaData = {
  nome: string;
  numero: string;
};

type LinhaContextProps = {
  linhas: Linha[];
  isLoading: boolean;
  getLinhasDaEmpresa: () => Promise<void>;
  addLinha: (data: CreateLinhaData) => Promise<boolean>;
  deleteLinha: (linhaId: string) => Promise<boolean>;
};

export const LinhaContext = createContext<LinhaContextProps>({} as LinhaContextProps);

export const LinhaProvider = ({ children }: PropsWithChildren) => {
  const { profile } = useContext(AuthContext);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getLinhasDaEmpresa = useCallback(async () => {
    if (!profile?.empresa_id) {
        console.log("Usuário não é de uma empresa ou não está logado.");
        setLinhas([]);
        return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('linhas')
        .select('*')
        .eq('empresa_id', profile.empresa_id);

      if (error) throw error;
      setLinhas(data || []);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar as linhas da sua empresa.");
      console.error("Erro ao buscar linhas:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const addLinha = async (data: CreateLinhaData): Promise<boolean> => {
    if (!profile?.empresa_id) {
      Alert.alert("Erro", "Você precisa ser administrador de uma empresa para criar linhas.");
      return false;
    }
    
    setIsLoading(true);
    try {
        const { error } = await supabase.from('linhas').insert({
            nome: data.nome,
            numero: data.numero,
            empresa_id: profile.empresa_id,
        });

        if (error) throw error;

        await getLinhasDaEmpresa();
        return true;
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível adicionar a nova linha.");
        console.error("Erro ao adicionar linha:", error.message);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const deleteLinha = async (linhaId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
        const { error } = await supabase
            .from('linhas')
            .delete()
            .eq('id', linhaId);

        if (error) throw error;
        
        setLinhas(prevLinhas => prevLinhas.filter(linha => linha.id !== linhaId));
        return true;
    } catch(error: any) {
        Alert.alert("Erro", "Não foi possível deletar a linha.");
        console.error("Erro ao deletar linha:", error.message);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <LinhaContext.Provider value={{ linhas, isLoading, getLinhasDaEmpresa, addLinha, deleteLinha }}>
      {children}
    </LinhaContext.Provider>
  );
};