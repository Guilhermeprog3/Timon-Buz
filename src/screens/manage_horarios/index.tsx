import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Linha } from '../../context/linhacontext';
import { Viagem } from '../../context/viagemcontext';
import { useLinhas } from '../../hooks/linha';

type ManageHorariosRouteProp = RouteProp<{ ManageHorarios: { linha: Linha, viagem: Viagem } }, 'ManageHorarios'>;

const ManageHorariosScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute<ManageHorariosRouteProp>();
    const { linha, viagem } = route.params;

    const { pontos, horarios, getPontosDaLinha, getHorariosDaViagem, upsertHorario, isLoading } = useLinhas();

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

    const theme = { 
        gradientStart: '#041C32', gradientEnd: '#0D3B66', textPrimary: '#FFF', 
        textSecondary: '#CCC', buttonBackground: '#F9A826', buttonText: '#041C32'
    };

    const styles = StyleSheet.create({
        container: { flex: 1, paddingTop: 60 },
        header: { paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
        backButton: { marginRight: 15, padding: 5 },
        headerContent: { flex: 1 },
        title: { fontSize: 24, fontWeight: 'bold', color: theme.textPrimary },
        subtitle: { fontSize: 16, color: theme.textSecondary },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        pontoItem: {
            backgroundColor: 'rgba(255,255,255,0.08)', padding: 15, borderRadius: 12,
            marginBottom: 10, flexDirection: 'row', alignItems: 'center',
        },
        pontoDescricao: { flex: 1, color: theme.textPrimary, fontSize: 16, marginRight: 10 },
        horarioInput: {
            color: theme.textPrimary, backgroundColor: 'rgba(0,0,0,0.2)', width: 70,
            height: 40, borderRadius: 8, textAlign: 'center', fontSize: 16, marginHorizontal: 10,
        },
        saveButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: theme.buttonBackground },
    });

    if (isLoading && pontos.length === 0) {
        return (
            <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.textPrimary} />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{viagem.descricao}</Text>
                    <Text style={styles.subtitle}>Linha: {linha.nome}</Text>
                </View>
            </View>

            <FlatList
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                data={pontos}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<Text style={{ color: theme.textSecondary, marginBottom: 10, paddingHorizontal: 5 }}>Defina os horários para cada ponto de parada desta viagem.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.pontoItem}>
                        <Text style={styles.pontoDescricao}>{item.ordem}. {item.descricao}</Text>
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
                )}
            />
        </LinearGradient>
    );
};

export default ManageHorariosScreen;