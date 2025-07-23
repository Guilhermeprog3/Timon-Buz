import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { EmpresaContext } from '../../context/empresacontext';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const { empresas, getEmpresas, isLoading } = useContext(EmpresaContext);
  const theme = { gradientStart: '#0D3B66', gradientEnd: '#041C32', textPrimary: '#FFF', textSecondary: '#CCC', primaryLight: 'rgba(255,255,255,0.1)' };

  useEffect(() => {
    getEmpresas();
  }, []);

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 20 },
    itemContainer: { padding: 20, backgroundColor: theme.primaryLight, borderRadius: 10, marginBottom: 15 },
    itemText: { fontSize: 18, color: theme.textPrimary },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  });

  if (isLoading) {
    return (
      <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <Text style={styles.title}>Empresas de Ônibus</Text>
      <FlatList
        data={empresas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

export default HomeScreen;