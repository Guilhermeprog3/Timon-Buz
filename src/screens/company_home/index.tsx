import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLinhas } from '../../hooks/linha';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Linha } from '../../context/linhacontext';
import theme from "../../colors/index"

const CompanyHomeScreen = () => {
  const { linhas, isLoading, getLinhasDaEmpresa } = useLinhas();
  const navigation = useNavigation<NavigationProp<any>>();

  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [filteredLinhas, setFilteredLinhas] = useState<Linha[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      getLinhasDaEmpresa();
    }, [])
  );

  useEffect(() => {
    if (submittedQuery.trim() === '') {
      setFilteredLinhas(linhas);
    } else {
      const filtered = linhas.filter(linha =>
        linha.nome.toLowerCase().includes(submittedQuery.toLowerCase())
      );
      setFilteredLinhas(filtered);
    }
  }, [linhas, submittedQuery]);

  const handleNavigateToDetail = (linha: Linha) => {
    navigation.navigate('LinhaDetail', { linha });
  };
  
  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSubmittedQuery('');
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    listTitle: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: '600',
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
    },
    fab: {
      position: 'absolute',
      bottom: 100,
      right: 25,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.buttonBackground,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 12,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    searchInput: {
      flex: 1,
      height: 50,
      color: theme.textPrimary,
      fontSize: 16,
      marginLeft: 10,
    },
    clearSearchButton: {
      padding: 5,
    }
  });

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bus-outline" size={50} color={theme.textSecondary} />
      <Text style={styles.emptyText}>{linhas.length === 0 ? "Nenhuma linha cadastrada ainda.\nClique no '+' para adicionar sua primeira linha." : "Nenhuma linha encontrada para sua busca."}</Text>
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
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={22} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar linha por nome..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearSearchButton}>
              <Ionicons name="close-circle" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredLinhas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.linhaItem} onPress={() => handleNavigateToDetail(item)}>
              <Ionicons name="bus-outline" size={28} color={theme.buttonBackground} />
              <View style={styles.linhaTextContainer}>
                <Text style={styles.linhaNome}>{item.nome}</Text>
                <Text style={styles.linhaNumero}>Número: {item.numero}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Minhas Linhas</Text>
            </View>
          }
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                handleClearSearch();
                getLinhasDaEmpresa();
              }}
              tintColor={theme.textPrimary}
            />
          }
          contentContainerStyle={{ paddingBottom: 160 }}
          keyboardShouldPersistTaps="handled"
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ManageLinha')} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color={theme.buttonText} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CompanyHomeScreen;