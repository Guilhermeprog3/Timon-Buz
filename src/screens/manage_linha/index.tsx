import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity,ActivityIndicator, Keyboard, ScrollView, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { z } from 'zod';
import { useLinhas } from '../../hooks/linha';
import { Linha, PontoItinerario } from '../../context/linhacontext';
import { Ionicons } from '@expo/vector-icons';
import theme from "../../colors/index"

const linhaSchema = z.object({
  nome: z.string().trim().min(3, "O nome da linha deve ter pelo menos 3 caracteres."),
  numero: z.string().trim().min(1, "O número da linha é obrigatório."),
});

type ManageLinhaRouteProp = RouteProp<{ ManageLinha: { linha?: Linha } }, 'ManageLinha'>;
type PontoLocal = Omit<PontoItinerario, 'id' | 'linha_id' | 'created_at'>;

const ManageLinhaScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<ManageLinhaRouteProp>();
  const { 
      addLinha, updateLinha, isLoading, 
      pontos: pontosDoContexto, getPontosDaLinha, addPonto, deletePonto 
  } = useLinhas();
  
  const [currentLinha, setCurrentLinha] = useState<Linha | undefined>(route.params?.linha);
  const isEditing = !!currentLinha;

  const [nome, setNome] = useState(currentLinha?.nome || '');
  const [numero, setNumero] = useState(currentLinha?.numero || '');
  const [descricaoPonto, setDescricaoPonto] = useState('');
  const [pontosLocais, setPontosLocais] = useState<PontoLocal[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (isEditing && currentLinha) {
      getPontosDaLinha(currentLinha.id);
    }
  }, [isEditing, currentLinha]);

  useEffect(() => {
    if (isEditing) {
      setPontosLocais(pontosDoContexto);
    }
  }, [pontosDoContexto, isEditing]);

  const handleSaveLinha = async () => {
    Keyboard.dismiss();
    setFieldErrors({});

    try {
      linhaSchema.parse({ nome, numero });
      
      if (pontosLocais.length < 2) {
          Alert.alert("Atenção", "Uma linha deve ter pelo menos 2 pontos de parada.");
          return;
      }
      
      const success = await addLinha({ nome, numero, pontos: pontosLocais });
      if (success) {
        navigation.goBack();
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = zErrorToMap(error);
        setFieldErrors(errors);
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    }
  };
  
  const handleUpdateLinha = async () => {
      await updateLinha(currentLinha!.id, { nome, numero });
  };

  const handleAddPontoLocal = () => {
    if (descricaoPonto.trim().length < 3) {
        Alert.alert("Atenção", "A descrição do ponto deve ter pelo menos 3 caracteres.");
        return;
    }
    
    if (isEditing && currentLinha) {
        const proximaOrdem = pontosLocais.length > 0 ? Math.max(...pontosLocais.map(p => p.ordem)) + 1 : 1;
        addPonto(currentLinha.id, descricaoPonto.trim(), proximaOrdem);
    } else {
        setPontosLocais(prev => [...prev, { descricao: descricaoPonto.trim(), ordem: prev.length + 1 }]);
    }
    setDescricaoPonto('');
    Keyboard.dismiss();
  };

  const handleDeletePontoLocal = (ponto: PontoLocal) => {
    if (isEditing && 'id' in ponto) {
        // @ts-ignore
        deletePonto(ponto.id);
    } else {
        setPontosLocais(prev => prev.filter(p => p.descricao !== ponto.descricao).map((p, index) => ({ ...p, ordem: index + 1 })));
    }
  };

  const zErrorToMap = (error: z.ZodError): Record<string, string> => {
      const errors: Record<string, string> = {};
      error.issues.forEach(issue => {
        const fieldName = issue.path[0];
        if (typeof fieldName === 'string') {
          errors[fieldName] = issue.message;
        }
      });
      return errors;
  }
  

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      paddingTop: 60 
    },
    header: { 
      paddingHorizontal: 20, 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 20 
    },
    backButton: { 
      marginRight: 15, 
      padding: 5 
    },
    title: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      color: theme.textPrimary 
    },
    section: { 
      paddingHorizontal: 20,
      marginBottom: 20, 
      borderBottomWidth: 1, 
      borderBottomColor: 'rgba(255,255,255,0.1)', 
      paddingBottom: 20 
    },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: theme.textPrimary, 
      marginBottom: 15 
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)', 
        height: 50, 
        borderRadius: 8,
        paddingHorizontal: 15, 
        color: theme.textPrimary, 
        fontSize: 16, 
        marginBottom: 10,
    },
    button: {
        height: 50, 
        backgroundColor: theme.buttonBackground, 
        borderRadius: 8,
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'row',
    },
    buttonDisabled: { 
      backgroundColor: '#A9A9A9' 
    },
    buttonText: { 
      color: theme.buttonText, 
      fontSize: 16, 
      fontWeight: 'bold' 
    },
    errorText: { 
      color: theme.red, 
      fontSize: 13, 
      marginTop: -5, 
      marginBottom: 10, 
      marginLeft: 4 
    },
    pontoItem: {
        backgroundColor: 'rgba(255,255,255,0.05)', 
        padding: 15, borderRadius: 8,
        flexDirection: 'row', 
        alignItems: 'center', 
        marginHorizontal: 20, 
        marginBottom: 10,
    },
    pontoText: { flex: 1, color: theme.textPrimary, fontSize: 16 },
  });

  const renderHeader = () => (
    <>
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Dados da Linha</Text>
          <TextInput style={styles.input} placeholder="Nome da Linha" placeholderTextColor={theme.textSecondary} value={nome} onChangeText={setNome} />
          {fieldErrors.nome && <Text style={styles.errorText}>{fieldErrors.nome}</Text>}
          <TextInput style={styles.input} placeholder="Número da Linha" placeholderTextColor={theme.textSecondary} value={numero} onChangeText={setNumero} keyboardType="numeric" />
          {fieldErrors.numero && <Text style={styles.errorText}>{fieldErrors.numero}</Text>}
          {isEditing && (
               <TouchableOpacity style={styles.button} onPress={handleUpdateLinha} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color={theme.buttonText} /> : <Text style={styles.buttonText}>Atualizar Dados</Text>}
              </TouchableOpacity>
          )}
      </View>

      <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Pontos de Parada</Text>
          <TextInput style={styles.input} placeholder="Descrição do Ponto (Ex: Praça Central)" placeholderTextColor={theme.textSecondary} value={descricaoPonto} onChangeText={setDescricaoPonto} />
          <TouchableOpacity style={styles.button} onPress={handleAddPontoLocal} disabled={isLoading}>
              <Text style={styles.buttonText}>Adicionar Ponto</Text>
          </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Pontos Cadastrados</Text>
    </>
  );

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Editar Linha' : 'Nova Linha'}</Text>
      </View>

      <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
      >
          {renderHeader()}
          
          {pontosLocais.map((item, index) => (
              <View key={(item as any).id || item.descricao + index} style={styles.pontoItem}>
                  <Text style={styles.pontoText}>{item.ordem}. {item.descricao}</Text>
                  <TouchableOpacity onPress={() => handleDeletePontoLocal(item)}>
                      <Ionicons name="trash-outline" size={22} color={theme.red} />
                  </TouchableOpacity>
              </View>
          ))}
          
          {!isEditing ? (
              <View style={{ padding: 20 }}>
                    <TouchableOpacity 
                      style={[styles.button, pontosLocais.length < 2 && styles.buttonDisabled]} 
                      onPress={handleSaveLinha} 
                      disabled={isLoading || pontosLocais.length < 2}
                    >
                      {isLoading ? <ActivityIndicator color={theme.buttonText} /> : <Text style={styles.buttonText}>Salvar Linha Completa</Text>}
                  </TouchableOpacity>
              </View>
          ) : null}
      </ScrollView>
    </LinearGradient>
  );
};

export default ManageLinhaScreen;