import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Linha, LinhaContext } from '../../context/linhacontext';
import theme from "../../colors/index"

type LinhasPorEmpresaRouteProp = RouteProp<{ LinhasPorEmpresa: { empresaId: string; empresaNome: string } }, 'LinhasPorEmpresa'>;

const LinhasPorEmpresaScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<LinhasPorEmpresaRouteProp>();
  const { empresaId, empresaNome } = route.params;

  const { getLinhasByEmpresaId } = useContext(LinhaContext);

  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [filteredLinhas, setFilteredLinhas] = useState<Linha[]>([]);

  const fetchLinhas = async () => {
    setIsLoading(true);
    try {
      const data = await getLinhasByEmpresaId(empresaId);
      setLinhas(data);
    } catch (error) {
        console.error("Erro ao buscar linhas por empresa:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinhas();
  }, [empresaId]);

  useEffect(() => {
    if (submittedQuery.trim() === '') {
      setFilteredLinhas(linhas);
    } else {
      const filtered = linhas.filter(linha =>
        linha.nome.toLowerCase().includes(submittedQuery.toLowerCase()) ||
        linha.numero.toLowerCase().includes(submittedQuery.toLowerCase())
      );
      setFilteredLinhas(filtered);
    }
  }, [linhas, submittedQuery]);

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
      paddingTop: 60 
    },
    header: { 
      paddingHorizontal: 20, 
      marginBottom: 10, 
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
      color: theme.textSecondary, 
      marginBottom: 10 
    },
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    linhaItem: {
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: 'rgba(255,255,255,0.08)',
      padding: 18, 
      borderRadius: 12, 
      marginBottom: 12, 
      marginHorizontal: 20,
    },
    linhaTextContainer: { 
      flex: 1, 
      marginLeft: 15 
    },
    linhaNome: { 
      color: theme.textPrimary, 
      fontSize: 18, 
      fontWeight: 'bold' 
    },
    linhaNumero: { 
      color: theme.textSecondary, 
      fontSize: 14 
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
    searchContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 12, 
      paddingHorizontal: 15, 
      marginHorizontal: 20, 
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
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{empresaNome}</Text>
          <Text style={styles.subtitle}>Linhas disponíveis</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por nome ou número..."
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
          <TouchableOpacity 
            style={styles.linhaItem}
            onPress={() => navigation.navigate('ViagensDaLinha', { linhaId: item.id, linhaNome: item.nome })}
          >
            <Ionicons name="bus-outline" size={28} color={theme.buttonBackground} />
            <View style={styles.linhaTextContainer}>
              <Text style={styles.linhaNome}>{item.nome}</Text>
              <Text style={styles.linhaNumero}>Número: {item.numero}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma linha encontrada.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchLinhas} tintColor={theme.textPrimary} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      />
    </LinearGradient>
  );
};

export default LinhasPorEmpresaScreen;