import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Linha } from '../../context/linhacontext';
import { ViagemContext, Viagem } from '../../context/viagemcontext';

type LinhaDetailRouteProp = RouteProp<{ LinhaDetail: { linha: Linha } }, 'LinhaDetail'>;

const LinhaDetailScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute<LinhaDetailRouteProp>();
    const { linha } = route.params;

    const { viagens, isLoading, getViagensDaLinha, deleteViagem } = useContext(ViagemContext);

    useFocusEffect(
      React.useCallback(() => {
        getViagensDaLinha(linha.id);
      }, [linha.id])
    );

    const handleCreateViagem = () => {
        navigation.navigate('ManageViagens', { linha });
    };

    const handleDeleteViagem = (viagem: Viagem) => {
        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja excluir a viagem "${viagem.descricao}" e todos os seus horários?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => deleteViagem(viagem.id) }
            ]
        );
    };

    const theme = { 
        gradientStart: '#041C32', gradientEnd: '#0D3B66', textPrimary: '#FFF', 
        textSecondary: '#CCC', buttonBackground: '#F9A826', red: '#D32F2F', buttonText: '#041C32'
    };

    const styles = StyleSheet.create({
        container: { flex: 1, paddingTop: 60 },
        header: { paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
        backButton: { marginRight: 15, padding: 5 },
        headerContent: { flex: 1 },
        title: { fontSize: 24, fontWeight: 'bold', color: theme.textPrimary },
        subtitle: { fontSize: 16, color: theme.textSecondary },
        actionsContainer: { paddingHorizontal: 20, marginBottom: 20 },
        actionButton: {
            backgroundColor: 'rgba(255,255,255,0.08)', padding: 15, borderRadius: 12,
            flexDirection: 'row', alignItems: 'center',
        },
        actionButtonText: { color: theme.textPrimary, fontSize: 16, marginLeft: 10 },
        listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, marginTop: 10 },
        listTitle: { fontSize: 20, fontWeight: 'bold', color: theme.textPrimary },
        addButton: { backgroundColor: theme.buttonBackground, padding: 8, borderRadius: 10 },
        viagemItem: {
            backgroundColor: 'rgba(255,255,255,0.08)', padding: 18, marginHorizontal: 20,
            borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10,
        },
        viagemText: { flex: 1, color: theme.textPrimary, fontSize: 16, marginLeft: 15 },
        deleteButton: { padding: 5 },
        emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
        emptyText: { color: theme.textSecondary, fontSize: 16, textAlign: 'center' },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    });

    return (
        <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{linha.nome}</Text>
                    <Text style={styles.subtitle}>Painel de Gestão da Linha</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ManageLinha', { linha })}>
                    <Ionicons name="create-outline" size={22} color={theme.buttonBackground} />
                    <Text style={styles.actionButtonText}>Editar Nome e Pontos de Parada</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Viagens</Text>
                <TouchableOpacity onPress={handleCreateViagem} style={styles.addButton}>
                    <Ionicons name="add" size={24} color={theme.buttonText} />
                </TouchableOpacity>
            </View>

            {isLoading ? <ActivityIndicator style={styles.loadingContainer} color="#FFF" size="large" /> : (
                <FlatList
                    data={viagens}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.viagemItem} onPress={() => navigation.navigate('ManageViagens', { linha, viagem: item })}>
                            <Ionicons name="time-outline" size={22} color={theme.textSecondary} />
                            <Text style={styles.viagemText}>{item.descricao}</Text>
                            <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleDeleteViagem(item); }} style={styles.deleteButton}>
                                <Ionicons name="trash-outline" size={22} color={theme.red} />
                            </TouchableOpacity>
                            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma viagem cadastrada.{"\n"}Clique em '+' para adicionar a primeira.</Text>
                        </View>
                    }
                />
            )}
        </LinearGradient>
    );
};

export default LinhaDetailScreen;