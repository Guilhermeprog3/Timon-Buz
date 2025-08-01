import React, { createContext, PropsWithChildren, useState, useCallback } from 'react';
import { supabase } from '../service/supabase';
import { Alert } from 'react-native';

export type Viagem = {
  id: string;
  descricao: string;
  linha_id: string;
  created_at: string;
  dias_semana: string[] | null;
};

type HorarioParaSalvar = {
    ponto_itinerario_id: string;
    horario_previsto: string;
}

type ViagemContextProps = {
  viagens: Viagem[];
  isLoading: boolean;
  getViagensDaLinha: (linhaId: string) => Promise<void>;
  addViagemWithHorarios: (linhaId: string, descricao: string, horarios: HorarioParaSalvar[], diasSemana: string[]) => Promise<boolean>;
  updateViagem: (viagemId: string, descricao: string, diasSemana: string[]) => Promise<boolean>;
  deleteViagem: (viagemId: string) => Promise<boolean>;
};

export const ViagemContext = createContext<ViagemContextProps>({} as ViagemContextProps);

export const ViagemProvider = ({ children }: PropsWithChildren) => {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getViagensDaLinha = useCallback(async (linhaId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('viagens')
        .select('*')
        .eq('linha_id', linhaId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setViagens(data || []);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar as viagens desta linha.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const addViagemWithHorarios = async (linhaId: string, descricao: string, horarios: HorarioParaSalvar[], diasSemana: string[]): Promise<boolean> => {
      setIsLoading(true);
      try {
          const { data: novaViagem, error: viagemError } = await supabase
              .from('viagens')
              .insert({ linha_id: linhaId, descricao, dias_semana: diasSemana })
              .select()
              .single();

          if (viagemError) throw viagemError;
          if (!novaViagem) throw new Error("Falha ao criar a viagem.");

          const horariosParaInserir = horarios.map(h => ({
              ...h,
              viagem_id: novaViagem.id,
          }));

          const { error: horariosError } = await supabase.from('horarios_ponto').insert(horariosParaInserir);

          if (horariosError) {
              await supabase.from('viagens').delete().eq('id', novaViagem.id);
              throw horariosError;
          }
          await getViagensDaLinha(linhaId);
          return true;
      } catch (error: any) {
          Alert.alert("Erro", "Não foi possível salvar a nova viagem e seus horários.");
          return false;
      } finally {
          setIsLoading(false);
      }
  };

  const updateViagem = async (viagemId: string, descricao: string, diasSemana: string[]): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('viagens')
            .update({ descricao, dias_semana: diasSemana })
            .eq('id', viagemId);
        
        if (error) throw error;
        setViagens(prev => prev.map(v => v.id === viagemId ? { ...v, descricao, dias_semana: diasSemana } : v));
        return true;
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível atualizar a viagem.");
        return false;
    }
  };

  const deleteViagem = async (viagemId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
        await supabase.from('horarios_ponto').delete().eq('viagem_id', viagemId);
        const { error } = await supabase.from('viagens').delete().eq('id', viagemId);
        
        if (error) throw error;
        setViagens(prev => prev.filter(v => v.id !== viagemId));
        return true;
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível deletar a viagem.");
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <ViagemContext.Provider value={{ viagens, isLoading, getViagensDaLinha, addViagemWithHorarios, updateViagem, deleteViagem }}>
      {children}
    </ViagemContext.Provider>
  );
};