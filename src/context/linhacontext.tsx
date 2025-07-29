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
  is_favorito?: boolean; 
};

export type PontoItinerario = {
  id: string;
  descricao: string;
  ordem: number;
  linha_id: string;
  created_at: string;
}

export type HorarioPonto = {
    id: string;
    horario_previsto: string;
    viagem_id: string;
    ponto_itinerario_id: string;
}

type HorarioUpsertData = Omit<HorarioPonto, 'id' | 'created_at'>;

type CreateLinhaData = {
  nome: string;
  numero: string;
  pontos: { descricao: string; ordem: number }[];
};

type UpdateLinhaData = {
  nome: string;
  numero: string;
}

type LinhaContextProps = {
  linhas: Linha[];
  pontos: PontoItinerario[];
  horarios: HorarioPonto[];
  isLoading: boolean;
  favoriteLinhas: Linha[];
  getLinhasDaEmpresa: () => Promise<void>;
  getLinhasByEmpresaId: (empresaId: string) => Promise<Linha[]>;
  getAllLinhas: () => Promise<Linha[]>;
  addLinha: (data: CreateLinhaData) => Promise<Linha | null>;
  updateLinha: (linhaId: string, data: UpdateLinhaData) => Promise<boolean>;
  deleteLinha: (linhaId: string) => Promise<boolean>;
  getPontosDaLinha: (linhaId: string) => Promise<void>;
  addPonto: (linhaId: string, descricao: string, ordem: number) => Promise<boolean>;
  deletePonto: (pontoId: string) => Promise<boolean>;
  getHorariosDaViagem: (viagemId: string) => Promise<void>;
  upsertAllHorarios: (horarios: HorarioUpsertData[]) => Promise<boolean>;
  getFavoriteLinhas: () => Promise<void>;
  toggleFavorito: (linhaId: string, isCurrentlyFavorito: boolean) => Promise<void>;
};

export const LinhaContext = createContext<LinhaContextProps>({} as LinhaContextProps);

export const LinhaProvider = ({ children }: PropsWithChildren) => {
  const { profile, user } = useContext(AuthContext);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [favoriteLinhas, setFavoriteLinhas] = useState<Linha[]>([]);
  const [pontos, setPontos] = useState<PontoItinerario[]>([]);
  const [horarios, setHorarios] = useState<HorarioPonto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getLinhasDaEmpresa = useCallback(async () => {
    if (!profile?.empresa_id) {
        setLinhas([]);
        return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('linhas')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLinhas(data || []);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar as linhas da sua empresa.");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const getLinhasByEmpresaId = async (empresaId: string): Promise<Linha[]> => {
    try {
      const { data, error } = await supabase
        .from('linhas')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nome', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar as linhas desta empresa.");
      return [];
    }
  };

  const getAllLinhas = async (): Promise<Linha[]> => {
    try {
      const { data, error } = await supabase
        .from('linhas')
        .select('*')
        .order('nome', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar todas as linhas.");
      return [];
    }
  };

  const getFavoriteLinhas = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('linhas(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      const linhasFavoritas = data?.map(fav => fav.linhas) as unknown as Linha[] || [];
      setFavoriteLinhas(linhasFavoritas);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar suas linhas favoritas.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const toggleFavorito = async (linhaId: string, isCurrentlyFavorito: boolean) => {
    if (!user) return;
    try {
      if (isCurrentlyFavorito) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .match({ user_id: user.id, linha_id: linhaId });
        if (error) throw error;
        setFavoriteLinhas(prev => prev.filter(l => l.id !== linhaId));
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({ user_id: user.id, linha_id: linhaId });
        if (error) throw error;
        await getFavoriteLinhas();
      }
    } catch (error: any) {
      Alert.alert("Erro", `Não foi possível ${isCurrentlyFavorito ? 'remover' : 'adicionar'} o favorito.`);
    }
  };

  const addLinha = async (data: CreateLinhaData): Promise<Linha | null> => {
    if (!profile?.empresa_id) return null;
    setIsLoading(true);
    try {
        const { data: novaLinha, error: linhaError } = await supabase
            .from('linhas')
            .insert({ nome: data.nome, numero: data.numero, empresa_id: profile.empresa_id })
            .select().single();
        if (linhaError) throw linhaError;
        if (!novaLinha) throw new Error("Falha ao criar a linha.");
        const pontosParaInserir = data.pontos.map(ponto => ({ ...ponto, linha_id: novaLinha.id }));
        const { error: pontosError } = await supabase.from('pontos_itinerario').insert(pontosParaInserir);
        if (pontosError) throw pontosError;
        await getLinhasDaEmpresa();
        return novaLinha;
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível adicionar a nova linha e seus pontos.");
        return null;
    } finally {
        setIsLoading(false);
    }
  };

  const updateLinha = async (linhaId: string, data: UpdateLinhaData): Promise<boolean> => {
    setIsLoading(true);
    try {
        const { error } = await supabase.from('linhas').update(data).eq('id', linhaId);
        if (error) throw error;
        await getLinhasDaEmpresa();
        return true;
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível atualizar a linha.");
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const deleteLinha = async (linhaId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
        const { data: viagensParaDeletar, error: viagensError } = await supabase.from('viagens').select('id').eq('linha_id', linhaId);
        if (viagensError) throw viagensError;
        const idsDeViagens = viagensParaDeletar.map(v => v.id);
        if (idsDeViagens.length > 0) {
            await supabase.from('horarios_ponto').delete().in('viagem_id', idsDeViagens);
            await supabase.from('viagens').delete().in('id', idsDeViagens);
        }
        await supabase.from('pontos_itinerario').delete().eq('linha_id', linhaId);
        await supabase.from('linhas').delete().eq('id', linhaId);
        setLinhas(prev => prev.filter(l => l.id !== linhaId));
        return true;
    } catch(error: any) {
        Alert.alert("Erro", "Não foi possível deletar a linha e seus dados associados.");
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const getPontosDaLinha = async (linhaId: string) => {
    setIsLoading(true);
    setPontos([]);
    try {
      const { data, error } = await supabase.from('pontos_itinerario').select('*').eq('linha_id', linhaId).order('ordem', { ascending: true });
      if (error) throw error;
      setPontos(data || []);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar os pontos da linha.");
    } finally {
      setIsLoading(false);
    }
  };

  const addPonto = async (linhaId: string, descricao: string, ordem: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('pontos_itinerario').insert({ linha_id: linhaId, descricao, ordem }).select();
      if (error) throw error;
      if (data) setPontos(prevPontos => [...prevPontos, ...data].sort((a, b) => a.ordem - b.ordem));
      return true;
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível adicionar o ponto.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePonto = async (pontoId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await supabase.from('horarios_ponto').delete().eq('ponto_itinerario_id', pontoId);
      const { error } = await supabase.from('pontos_itinerario').delete().eq('id', pontoId);
      if (error) throw error;
      setPontos(prevPontos => prevPontos.filter(p => p.id !== pontoId));
      return true;
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível remover o ponto.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getHorariosDaViagem = async (viagemId: string) => {
    setIsLoading(true);
    try {
        const { data, error } = await supabase.from('horarios_ponto').select('*').eq('viagem_id', viagemId);
        if (error) throw error;
        setHorarios(data || []);
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar os horários.");
    } finally {
        setIsLoading(false);
    }
  };

  const upsertAllHorarios = async (horariosData: HorarioUpsertData[]): Promise<boolean> => {
    if (horariosData.length === 0) return true;
    setIsLoading(true);
    try {
        const { error } = await supabase
            .from('horarios_ponto')
            .upsert(horariosData, { onConflict: 'viagem_id, ponto_itinerario_id' });
        if (error) throw error;
        await getHorariosDaViagem(horariosData[0].viagem_id);
        return true;
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível salvar os horários.");
        return false;
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <LinhaContext.Provider value={{ 
      linhas, pontos, horarios, isLoading, 
      getLinhasDaEmpresa, addLinha, updateLinha, deleteLinha, 
      getPontosDaLinha, addPonto, deletePonto,
      getHorariosDaViagem, upsertAllHorarios,
      getLinhasByEmpresaId, getAllLinhas,
      favoriteLinhas, getFavoriteLinhas, toggleFavorito
    }}>
      {children}
    </LinhaContext.Provider>
  );
};