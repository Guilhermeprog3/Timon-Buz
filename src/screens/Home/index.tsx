import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { EmpresaContext } from '../../context/empresacontext';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Empresa } from '../../context/empresacontext';
import theme from "../../colors/index"
const HomeScreen = () => {
  const { empresas, getEmpresas, isLoading } = useContext(EmpresaContext);
  const navigation = useNavigation<NavigationProp<any>>();

  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    getEmpresas();
  }, []);

  useEffect(() => {
    if (submittedQuery.trim() === '') {
      setFilteredEmpresas(empresas);
    } else {
      const filtered = empresas.filter(empresa =>
        empresa.nome.toLowerCase().includes(submittedQuery.toLowerCase())
      );
      setFilteredEmpresas(filtered);
    }
  }, [empresas, submittedQuery]);

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSubmittedQuery('');
  };



  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      paddingHorizontal: 20, 
      paddingTop: 60 
    },
    header: { 
      marginBottom: 20 
    },
    title: { 
      fontSize: 28, 
      fontWeight: 'bold', 
      color: theme.textPrimary 
    },
    subtitle: { 
      fontSize: 16, 
      color: theme.textSecondary, 
      marginTop: 4 
    },
    itemContainer: { 
        padding: 20, 
        backgroundColor: theme.primaryLight, 
        borderRadius: 10, 
        marginBottom: 15,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    itemText: { 
      fontSize: 18, 
      color: theme.textPrimary, 
      flex: 1 
    },
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
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
      marginLeft: 10 
    },
    clearSearchButton: { 
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
  });

  if (isLoading && !empresas.length) {
    return (
      <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Empresas de Ônibus</Text>
        <Text style={styles.subtitle}>Veja as empresas de transporte público presentes na sua cidade</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar empresa..."
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
        data={filteredEmpresas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => navigation.navigate('LinhasPorEmpresa', { empresaId: item.id, empresaNome: item.nome })}
          >
            <Text style={styles.itemText} numberOfLines={1}>{item.nome}</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma empresa encontrada.</Text>
            </View>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      />
    </LinearGradient>
  );
};

export default HomeScreen;