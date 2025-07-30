import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Linha } from '../../context/linhacontext';
import { ViagemContext, Viagem } from '../../context/viagemcontext';
import theme from "../../colors/index"

type LinhaDetailRouteProp = RouteProp<{ LinhaDetail: { linha: Linha } }, 'LinhaDetail'>;

const LinhaDetailScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute<LinhaDetailRouteProp>();
    const { linha } = route.params;

    const { viagens, isLoading, getViagensDaLinha, deleteViagem } = useContext(ViagemContext);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [viagemToDelete, setViagemToDelete] = useState<Viagem | null>(null);

    useFocusEffect(
      React.useCallback(() => {
        getViagensDaLinha(linha.id);
      }, [linha.id])
    );

    const handleCreateViagem = () => {
        navigation.navigate('ManageViagens', { linha });
    };

    const handleDeleteConfirmation = (viagem: Viagem) => {
        setViagemToDelete(viagem);
        setDeleteModalVisible(true);
    };

    const handleDeleteViagem = () => {
        if (viagemToDelete) {
            deleteViagem(viagemToDelete.id);
            setDeleteModalVisible(false);
            setViagemToDelete(null);
        }
    };

    const styles = StyleSheet.create({
        container: { 
            flex: 1, 
            paddingTop: 60 
        },
        header: { 
            paddingHorizontal: 20, 
            marginBottom: 20, 
            flexDirection: 'row', 
            alignItems: 'center' 
        },
        backButton: { 
            marginRight: 15, 
            padding: 5 
        },
        headerContent: { 
            flex: 1 
        },
        title: { 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: theme.textPrimary 
        },
        subtitle: { 
            fontSize: 16, 
            color: theme.textSecondary 
        },
        actionsContainer: { 
            paddingHorizontal: 20, 
            marginBottom: 20 
        },
        actionButton: {
            backgroundColor: 'rgba(255,255,255,0.08)',
            padding: 15, 
            borderRadius: 12,
            flexDirection: 'row', 
            alignItems: 'center',
        },
        actionButtonText: { 
            color: theme.textPrimary, 
            fontSize: 16, 
            marginLeft: 10 
        },
        listHeader: { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 20, 
            marginBottom: 15, 
            marginTop: 10 
        },
        listTitle: { 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: theme.textPrimary 
        },
        addButton: { 
            backgroundColor: theme.buttonBackground, 
            padding: 8, 
            borderRadius: 10 
        },
        viagemItem: {
            backgroundColor: 'rgba(255,255,255,0.08)', 
            padding: 18, 
            marginHorizontal: 20,
            borderRadius: 12, 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 10,
        },
        viagemText: { 
            flex: 1, 
            color: theme.textPrimary, 
            fontSize: 16, 
            marginLeft: 15 
        },
        deleteButton: { 
            padding: 5 
        },
        emptyContainer: { 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: 50 
        },
        emptyText: { 
            color: theme.textSecondary, 
            fontSize: 16, 
            textAlign: 'center' 
        },
        loadingContainer: { 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        modalOverlay: { 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0, 0, 0, 0.7)' 
        },
        modalContainer: { 
           width: '85%', 
           backgroundColor: theme.gradientEnd,
           borderRadius: 20, 
           padding: 24, 
           alignItems: 'center', 
           shadowColor: '#000', 
           shadowOffset: { width: 0, height: 4 }, 
           shadowOpacity: 0.3, 
           shadowRadius: 5, 
           elevation: 8 
        },
        modalTitle: { 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: theme.textPrimary, 
          marginBottom: 8, 
          textAlign: 'center' 
        },
        modalMessage: { 
          fontSize: 16, 
          color: theme.textSecondary, 
          textAlign: 'center', 
          marginBottom: 24, 
          lineHeight: 22 
        },
        modalButtonContainer: { 
          flexDirection: 'row', 
          width: '100%', 
          justifyContent: 'space-between' 
        },
        modalButton: { 
          flex: 1, 
          paddingVertical: 14, 
          borderRadius: 12, 
          alignItems: 'center', 
          justifyContent: 'center' 
        },
        cancelButton: { 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          marginRight: 8 
        },
        confirmButton: { 
          backgroundColor: theme.red,
           marginLeft: 8 
        },
        modalButtonText: { 
          fontSize: 16, 
          fontWeight: 'bold', 
          color: '#FFF' 
        },
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
                            <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleDeleteConfirmation(item); }} style={styles.deleteButton}>
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

            <Modal animationType="fade" transparent={true} visible={isDeleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setDeleteModalVisible(false)}>
                    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                        <Text style={styles.modalMessage}>Tem certeza que deseja excluir a viagem "{viagemToDelete?.descricao}" e todos os seus horários?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setDeleteModalVisible(false)} activeOpacity={0.8}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleDeleteViagem} activeOpacity={0.8}>
                                <Text style={styles.modalButtonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </LinearGradient>
    );
};

export default LinhaDetailScreen;