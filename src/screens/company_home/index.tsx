import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLinhas } from '../../hooks/linha';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const CompanyHomeScreen = () => {
  const { linhas, isLoading, getLinhasDaEmpresa } = useLinhas();
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    getLinhasDaEmpresa();
  }, []);

  const theme = { 
    gradientStart: '#041C32', gradientEnd: '#0D3B66', textPrimary: '#FFF', 
    textSecondary: '#CCC', buttonBackground: '#F9A826' 
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.textPrimary },
    subtitle: { fontSize: 16, color: theme.textSecondary },
    content: { flex: 1, paddingHorizontal: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    linhaItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.08)', 
        padding: 18, 
        borderRadius: 12, 
        marginBottom: 12 
    },
    linhaTextContainer: { flex: 1, marginLeft: 15 },
    linhaNome: { color: theme.textPrimary, fontSize: 18, fontWeight: 'bold' },
    linhaNumero: { color: theme.textSecondary, fontSize: 14 },
    listHeader: {
        color: theme.textPrimary,
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 15
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: theme.textSecondary,
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 24,
    }
  });

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
        <Ionicons name="bus-outline" size={50} color={theme.textSecondary} />
        <Text style={styles.emptyText}>Nenhuma linha cadastrada ainda.{"\n"}Adicione sua primeira linha.</Text>
    </View>
  );

  if (isLoading && !linhas.length) {
    return (
      <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel da Empresa</Text>
        <Text style={styles.subtitle}>Gerencie suas linhas e viagens</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={linhas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.linhaItem} onPress={() => {}}>
              <Ionicons name="bus-outline" size={28} color={theme.buttonBackground} />
              <View style={styles.linhaTextContainer}>
                <Text style={styles.linhaNome}>{item.nome}</Text>
                <Text style={styles.linhaNumero}>Número: {item.numero}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          ListHeaderComponent={<Text style={styles.listHeader}>Minhas Linhas</Text>}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
                refreshing={isLoading}
                onRefresh={getLinhasDaEmpresa}
                tintColor={theme.textPrimary}
            />
          }
        />
      </View>
    </LinearGradient>
  );
};

export default CompanyHomeScreen;