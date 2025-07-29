import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Viagem, ViagemContext } from '../../context/viagemcontext';

type ViagensDaLinhaRouteProp = RouteProp<{ ViagensDaLinha: { linhaId: string; linhaNome: string } }, 'ViagensDaLinha'>;

const formatarDiasSemana = (dias: string[] | null): string => {
    if (!dias || dias.length === 0) return 'Dias não informados';
    const DIAS_MAP: { [key: string]: string } = {
        seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui',
        sex: 'Sex', sab: 'Sáb', dom: 'Dom'
    };
    if (dias.length === 7) return 'Todos os dias';
    if (dias.length === 5 && ['seg', 'ter', 'qua', 'qui', 'sex'].every(d => dias.includes(d))) return 'Segunda a Sexta';
    if (dias.length === 2 && ['sab', 'dom'].every(d => dias.includes(d))) return 'Fim de Semana';
    
    return dias.map(d => DIAS_MAP[d] || d).join(', ');
};

const ViagensDaLinhaScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<ViagensDaLinhaRouteProp>();
  const { linhaId, linhaNome } = route.params;

  const { viagens, getViagensDaLinha, isLoading } = useContext(ViagemContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [filteredViagens, setFilteredViagens] = useState<Viagem[]>([]);

  const fetchViagens = () => {
    getViagensDaLinha(linhaId);
  };

  useEffect(() => {
    fetchViagens();
  }, [linhaId]);

  useEffect(() => {
    if (submittedQuery.trim() === '') {
      setFilteredViagens(viagens);
    } else {
      const filtered = viagens.filter(viagem =>
        viagem.descricao.toLowerCase().includes(submittedQuery.toLowerCase())
      );
      setFilteredViagens(filtered);
    }
  }, [viagens, submittedQuery]);

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSubmittedQuery('');
  };

  const theme = {
    gradientStart: '#041C32',
    gradientEnd: '#0D3B66',
    textPrimary: '#FFF',
    textSecondary: '#CCC',
    buttonBackground: '#F9A826',
  };

  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15, padding: 5 },
    headerContent: { flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.textPrimary },
    subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: 4 },
    description: {
      fontSize: 15,
      color: theme.textSecondary,
      paddingHorizontal: 20,
      marginBottom: 20,
      lineHeight: 22,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    item: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)',
      padding: 18, borderRadius: 12, marginBottom: 12, marginHorizontal: 20,
    },
    itemTextContainer: { flex: 1, marginLeft: 15 },
    itemTitle: { color: theme.textPrimary, fontSize: 18 },
    itemSubtitle: { color: theme.textSecondary, fontSize: 14, marginTop: 4 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { color: theme.textSecondary, fontSize: 16, textAlign: 'center' },
    searchContainer: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 12, paddingHorizontal: 15, marginHorizontal: 20, marginBottom: 20,
    },
    searchInput: { flex: 1, height: 50, color: theme.textPrimary, fontSize: 16, marginLeft: 10 },
    clearSearchButton: { padding: 5 },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{linhaNome}</Text>
          <Text style={styles.subtitle}>Selecione a viagem</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Visualize as viagens programadas para esta linha e seus respectivos dias de funcionamento.
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por descrição..."
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
        data={filteredViagens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => navigation.navigate('DetalheViagem', { 
                viagemId: item.id, 
                viagemDescricao: item.descricao,
                linhaId: linhaId,
                diasSemana: item.dias_semana
            })}
          >
            <Ionicons name="time-outline" size={28} color={theme.buttonBackground} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>{item.descricao}</Text>
              <Text style={styles.itemSubtitle}>{formatarDiasSemana(item.dias_semana)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma viagem encontrada.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchViagens} tintColor={theme.textPrimary} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      />
    </LinearGradient>
  );
};

export default ViagensDaLinhaScreen;