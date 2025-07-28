import React, { useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Linha, LinhaContext } from '../../context/linhacontext';

const FavoritosScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { favoriteLinhas, getFavoriteLinhas, isLoading, toggleFavorito } = useContext(LinhaContext);

  useFocusEffect(
    useCallback(() => {
      getFavoriteLinhas();
    }, [])
  );

  const theme = {
    gradientStart: '#041C32',
    gradientEnd: '#0D3B66',
    textPrimary: '#FFF',
    textSecondary: '#CCC',
    buttonBackground: '#F9A826',
    red: '#D32F2F'
  };

  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.textPrimary },
    subtitle: { fontSize: 16, color: theme.textSecondary, marginTop: 4 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    item: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)',
      paddingVertical: 18, paddingLeft: 18, paddingRight: 12, borderRadius: 12,
      marginBottom: 12, marginHorizontal: 20,
    },
    itemTextContainer: { flex: 1, marginLeft: 15 },
    itemTitle: { color: theme.textPrimary, fontSize: 18, fontWeight: 'bold' },
    itemSubtitle: { color: theme.textSecondary, fontSize: 14 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { color: theme.textSecondary, fontSize: 16, textAlign: 'center', lineHeight: 24 },
    favoriteButton: { padding: 10, marginLeft: 5 },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Linhas Favoritas</Text>
        <Text style={styles.subtitle}>Seus atalhos para as linhas mais usadas</Text>
      </View>

      {isLoading && favoriteLinhas.length === 0 ? (
         <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.textPrimary} /></View>
      ) : (
        <FlatList
            data={favoriteLinhas}
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
                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorito(item.id, true)}>
                    <Ionicons name="heart" size={26} color={theme.red} />
                </TouchableOpacity>
            </TouchableOpacity>
            )}
            ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={50} color={theme.textSecondary} />
                <Text style={styles.emptyText}>Você ainda não favoritou nenhuma linha.{"\n"}Procure uma linha e toque no coração.</Text>
            </View>
            }
            refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getFavoriteLinhas} tintColor={theme.textPrimary} />
            }
            contentContainerStyle={{ paddingBottom: 180 }}
        />
      )}
    </LinearGradient>
  );
};

export default FavoritosScreen;