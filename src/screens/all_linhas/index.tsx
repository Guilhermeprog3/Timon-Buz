import React, { useEffect, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Linha, LinhaContext } from '../../context/linhacontext';

const AllLinhasScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { getAllLinhas, favoriteLinhas, getFavoriteLinhas, toggleFavorito, isLoading: contextIsLoading } = useContext(LinhaContext);

  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [filteredLinhas, setFilteredLinhas] = useState<Linha[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchAllData = async () => {
        setIsLoading(true);
        await Promise.all([
            getAllLinhas().then(setLinhas),
            getFavoriteLinhas()
        ]);
        setIsLoading(false);
      };
      
      fetchAllData();
    }, [])
  );

  useEffect(() => {
    const favoriteIds = new Set(favoriteLinhas.map(l => l.id));
    const combinedLinhas = linhas.map(linha => ({
      ...linha,
      is_favorito: favoriteIds.has(linha.id),
    }));

    if (submittedQuery.trim() === '') {
      setFilteredLinhas(combinedLinhas);
    } else {
      const lowercasedQuery = submittedQuery.toLowerCase();
      const filtered = combinedLinhas.filter(linha =>
        linha.nome.toLowerCase().includes(lowercasedQuery) ||
        linha.numero.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredLinhas(filtered);
    }
  }, [linhas, favoriteLinhas, submittedQuery]);

  const handleSearchSubmit = () => setSubmittedQuery(searchQuery);
  const handleClearSearch = () => {
    setSearchQuery('');
    setSubmittedQuery('');
  };

  const handleToggleFavorito = async (linha: Linha) => {
    await toggleFavorito(linha.id, !!linha.is_favorito);
  };

  const theme = {
    gradientStart: '#041C32',
    gradientEnd: '#0D3B66',
    textPrimary: '#FFF',
    textSecondary: '#CCC',
    buttonBackground: '#F9A826',
    red: '#D32F2F'
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      paddingTop: 60 
    },
    header: { 
      paddingHorizontal: 20, 
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
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    item: {
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: 'rgba(255,255,255,0.08)',
      paddingVertical: 18, 
      paddingLeft: 18, 
      paddingRight: 12, 
      borderRadius: 12, 
      marginBottom: 12, 
      marginHorizontal: 20,
    },
    itemTextContainer: { 
      flex: 1, 
      marginLeft: 15 
    },
    itemTitle: { 
      color: theme.textPrimary, 
      fontSize: 18, 
      fontWeight: 'bold' 
    },
    itemSubtitle: { 
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
    favoriteButton: { 
      padding: 10, 
      marginLeft: 5 },
  });
  const currentIsLoading = isLoading || contextIsLoading;
    function fetchAllData(): void {
        throw new Error('Function not implemented.');
    }
  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todas as Linhas</Text>
        <Text style={styles.subtitle}>Veja todas as linhas e pontos de parada da sua cidade</Text>
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
      {currentIsLoading && filteredLinhas.length === 0 ? (
         <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.textPrimary} /></View>
      ) : (
        <FlatList
            data={filteredLinhas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.item}
                onPress={() => navigation.navigate('ViagensDaLinha', { linhaId: item.id, linhaNome: item.nome })}
            >
                <Ionicons name="bus-outline" size={28} color={theme.buttonBackground} />
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{item.nome}</Text>
                    <Text style={styles.itemSubtitle}>Número: {item.numero}</Text>
                </View>
                <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleFavorito(item)}>
                    <Ionicons 
                        name={item.is_favorito ? "heart" : "heart-outline"} 
                        size={26} 
                        color={item.is_favorito ? theme.red : theme.textSecondary} 
                    />
                </TouchableOpacity>
            </TouchableOpacity>
            )}
            ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma linha encontrada.</Text>
            </View>
            }
            refreshControl={
            <RefreshControl refreshing={currentIsLoading} onRefresh={fetchAllData} tintColor={theme.textPrimary} />
            }
            contentContainerStyle={{ paddingBottom: 180 }}
            keyboardShouldPersistTaps="handled"
        />
      )}
    </LinearGradient>
  );
};

export default AllLinhasScreen;