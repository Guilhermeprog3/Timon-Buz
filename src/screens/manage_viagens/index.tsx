import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Linha } from '../../context/linhacontext';
import { Viagem, ViagemContext } from '../../context/viagemcontext';
import { useLinhas } from '../../hooks/linha';

type ManageViagensRouteProp = RouteProp<{ ManageViagens: { linha: Linha, viagem?: Viagem } }, 'ManageViagens'>;

const ManageViagensScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute<ManageViagensRouteProp>();
    
    const isEditing = !!route.params.viagem;
    const { linha, viagem } = route.params;

    const { updateViagem, addViagemWithHorarios } = useContext(ViagemContext);
    const { 
        pontos, horarios, getPontosDaLinha, getHorariosDaViagem, 
        upsertAllHorarios, isLoading 
    } = useLinhas();

    const [descricaoViagem, setDescricaoViagem] = useState(viagem?.descricao || '');
    const [horariosInput, setHorariosInput] = useState<Record<string, string>>({});
    
    useEffect(() => {
        getPontosDaLinha(linha.id);
        if (isEditing && viagem) {
            getHorariosDaViagem(viagem.id);
        }
    }, [linha.id, viagem, isEditing]);

    useEffect(() => {
        if (horarios.length > 0 && isEditing) {
            const initialHorarios: Record<string, string> = {};
            horarios.forEach(h => {
                if(h.ponto_itinerario_id) {
                    initialHorarios[h.ponto_itinerario_id] = h.horario_previsto.substring(0, 5);
                }
            });
            setHorariosInput(initialHorarios);
        }
    }, [horarios, isEditing]);

    const validateInputs = () => {
        if (descricaoViagem.trim().length < 3) {
            Alert.alert("Atenção", "A descrição da viagem deve ter pelo menos 3 caracteres.");
            return false;
        }

        if (Object.keys(horariosInput).length < pontos.length) {
            Alert.alert("Atenção", "Você deve definir o horário para todos os pontos de parada antes de salvar.");
            return false;
        }

        for (const ponto of pontos) {
            const time = horariosInput[ponto.id];
            const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
            if (!time || !timeRegex.test(time)) {
                Alert.alert("Erro de Formato", `Horário inválido para o ponto "${ponto.descricao}". Use o formato HH:mm.`);
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        Keyboard.dismiss();
        if (!validateInputs()) return;

        const horariosParaSalvar = pontos.map(ponto => ({
            ponto_itinerario_id: ponto.id,
            horario_previsto: `${horariosInput[ponto.id]}:00`,
            viagem_id: viagem?.id || ''
        }));

        let success = false;
        if (isEditing && viagem) {
            await updateViagem(viagem.id, descricaoViagem.trim());
            success = await upsertAllHorarios(horariosParaSalvar);
            if(success) Alert.alert("Sucesso", "Viagem atualizada com sucesso!");

        } else {
            success = await addViagemWithHorarios(linha.id, descricaoViagem.trim(), horariosParaSalvar);
            if(success) Alert.alert("Sucesso", "Viagem criada com sucesso!");
        }

        if (success) {
            navigation.goBack();
        }
    };

    const theme = { 
        gradientStart: '#041C32', gradientEnd: '#0D3B66', textPrimary: '#FFF', 
        textSecondary: '#CCC', buttonBackground: '#F9A826', buttonText: '#041C32'
    };

    const styles = StyleSheet.create({
        container: { flex: 1, paddingTop: 60 },
        header: { paddingHorizontal: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
        backButton: { marginRight: 15, padding: 5 },
        headerContent: { flex: 1 },
        title: { fontSize: 24, fontWeight: 'bold', color: theme.textPrimary },
        subtitle: { fontSize: 16, color: theme.textSecondary },
        section: { paddingHorizontal: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 20 },
        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 15, paddingHorizontal: 20 },
        input: {
            backgroundColor: 'rgba(255,255,255,0.08)', height: 50, borderRadius: 8,
            paddingHorizontal: 15, color: theme.textPrimary, fontSize: 16, marginBottom: 10,
        },
        pontoItem: {
            backgroundColor: 'rgba(255,255,255,0.08)', padding: 15, borderRadius: 12,
            marginBottom: 10, marginHorizontal: 20,
        },
        pontoDescricao: { flex: 1, color: theme.textPrimary, fontSize: 16, marginRight: 10 },
        horarioContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
        horarioInput: {
            flex: 1, color: theme.textPrimary, backgroundColor: 'rgba(0,0,0,0.2)',
            height: 44, borderRadius: 8, textAlign: 'center', fontSize: 18,
        },
        fullSaveButton: {
            height: 50, backgroundColor: theme.buttonBackground, borderRadius: 8,
            alignItems: 'center', justifyContent: 'center', flexDirection: 'row', margin: 20
        },
        buttonText: { color: theme.buttonText, fontSize: 16, fontWeight: 'bold' },
    });

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{isEditing ? 'Editar Viagem' : 'Nova Viagem'}</Text>
                    <Text style={styles.subtitle}>Linha: {linha.nome}</Text>
                </View>
            </View>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descrição da Viagem</Text>
                    <TextInput
                        style={[styles.input, { marginHorizontal: 20 }]}
                        placeholder="Ex: Dias Úteis - Manhã"
                        placeholderTextColor={theme.textSecondary}
                        value={descricaoViagem}
                        onChangeText={setDescricaoViagem}
                    />
                </View>
                
                <Text style={styles.sectionTitle}>Horários por Ponto</Text>
                {isLoading && pontos.length === 0 ? <ActivityIndicator color="#FFF" /> : (
                    pontos.map(item => (
                        <View key={item.id} style={styles.pontoItem}>
                            <Text style={styles.pontoDescricao}>{item.ordem}. {item.descricao}</Text>
                            <View style={styles.horarioContainer}>
                                <TextInput
                                    style={styles.horarioInput}
                                    placeholder="HH:mm"
                                    placeholderTextColor={theme.textSecondary}
                                    maxLength={5}
                                    keyboardType="numeric"
                                    value={horariosInput[item.id] || ''}
                                    onChangeText={(text) => {
                                        let newText = text;
                                        if (text.length === 2 && !horariosInput[item.id]?.includes(':')) {
                                            newText = text + ':';
                                        }
                                        setHorariosInput(prev => ({ ...prev, [item.id]: newText }))
                                    }}
                                />
                            </View>
                        </View>
                    ))
                )}
                
                <TouchableOpacity style={styles.fullSaveButton} onPress={handleSave} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color={theme.buttonText} /> : <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Criar Viagem'}</Text>}
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default ManageViagensScreen;