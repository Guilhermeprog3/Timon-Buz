import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Linha } from '../../context/linhacontext';
import { Viagem, ViagemContext } from '../../context/viagemcontext';
import { useLinhas } from '../../hooks/linha';

type ManageViagemRouteProp = RouteProp<{ ManageViagem: { linha: Linha, viagem: Viagem } }, 'ManageViagem'>;

const ManageViagemScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute<ManageViagemRouteProp>();
    const { linha, viagem } = route.params;

    const { updateViagem } = useContext(ViagemContext);
    const { 
        pontos, horarios, getPontosDaLinha, getHorariosDaViagem, 
        upsertHorario, isLoading 
    } = useLinhas();

    const [descricaoViagem, setDescricaoViagem] = useState(viagem.descricao);
    const [horariosInput, setHorariosInput] = useState<Record<string, string>>({});
    const [savingHorario, setSavingHorario] = useState<Record<string, boolean>>({});

    useEffect(() => {
        getPontosDaLinha(linha.id);
        getHorariosDaViagem(viagem.id);
    }, [linha.id, viagem.id]);

    useEffect(() => {
        if (horarios.length > 0) {
            const initialHorarios: Record<string, string> = {};
            horarios.forEach(h => {
                if(h.ponto_itinerario_id) {
                    initialHorarios[h.ponto_itinerario_id] = h.horario_previsto.substring(0, 5);
                }
            });
            setHorariosInput(initialHorarios);
        }
    }, [horarios]);

    const handleSaveHorario = async (pontoId: string) => {
        const time = horariosInput[pontoId];
        const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
        
        if (!time || !timeRegex.test(time)) {
            Alert.alert("Erro", "Insira um horário válido no formato HH:mm (ex: 08:30).");
            return;
        }

        Keyboard.dismiss();
        setSavingHorario(prev => ({ ...prev, [pontoId]: true }));
        
        await upsertHorario({
            viagem_id: viagem.id,
            ponto_itinerario_id: pontoId,
            horario_previsto: `${time}:00`
        });
        
        setSavingHorario(prev => ({ ...prev, [pontoId]: false }));
    };
    
    const handleUpdateViagemDescricao = () => {
        if (descricaoViagem.trim().length < 3) {
            Alert.alert("Erro", "A descrição da viagem deve ter pelo menos 3 caracteres.");
            return;
        }
        updateViagem(viagem.id, descricaoViagem.trim());
        Keyboard.dismiss();
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
        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 15 },
        input: {
            backgroundColor: 'rgba(255,255,255,0.08)', height: 50, borderRadius: 8,
            paddingHorizontal: 15, color: theme.textPrimary, fontSize: 16, marginBottom: 10,
        },
        pontoItem: {
            backgroundColor: 'rgba(255,255,255,0.08)', padding: 15, borderRadius: 12,
            marginBottom: 10,
        },
        pontoDescricao: { flex: 1, color: theme.textPrimary, fontSize: 16, marginRight: 10 },
        horarioContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
        horarioInput: {
            flex: 1, color: theme.textPrimary, backgroundColor: 'rgba(0,0,0,0.2)',
            height: 44, borderRadius: 8, textAlign: 'center', fontSize: 18, marginRight: 10,
        },
        saveButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: theme.buttonBackground },
    });

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Editar Viagem</Text>
                    <Text style={styles.subtitle}>Linha: {linha.nome}</Text>
                </View>
            </View>

            <FlatList
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Descrição da Viagem</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Dias Úteis - Manhã"
                            placeholderTextColor={theme.textSecondary}
                            value={descricaoViagem}
                            onChangeText={setDescricaoViagem}
                            onBlur={handleUpdateViagemDescricao}
                        />
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
                data={pontos}
                keyExtractor={(item) => item.id}
                ListFooterComponent={
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={styles.sectionTitle}>Definir Horários da Viagem</Text>
                        {isLoading && <ActivityIndicator color="#FFF" />}
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.pontoItem, { marginHorizontal: 20 }]}>
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
                            <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveHorario(item.id)}>
                               {savingHorario[item.id] ? <ActivityIndicator size="small" color={theme.buttonText} /> : <Ionicons name="checkmark" size={24} color={theme.buttonText} />}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </LinearGradient>
    );
};

export default ManageViagemScreen;