import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { useLinhas } from '../../hooks/linha';
import { PontoItinerario } from '../../context/linhacontext';

type RotaCompletaItem = PontoItinerario & { horario_previsto?: string };

type DetalheViagemRouteProp = RouteProp<{ DetalheViagem: { viagemId: string; viagemDescricao: string, linhaId: string } }, 'DetalheViagem'>;

const DetalheViagemScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<DetalheViagemRouteProp>();
  const { viagemId, viagemDescricao, linhaId } = route.params;

  const { pontos, horarios, getPontosDaLinha, getHorariosDaViagem, isLoading } = useLinhas();
  const [rotaCompleta, setRotaCompleta] = useState<RotaCompletaItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        await Promise.all([
            getPontosDaLinha(linhaId),
            getHorariosDaViagem(viagemId)
        ]);
    };
    fetchData();
  }, [linhaId, viagemId]);

  useEffect(() => {
    if (pontos.length > 0 && horarios.length > 0) {
      const horariosMap = new Map(horarios.map(h => [h.ponto_itinerario_id, h.horario_previsto]));
      const rota = pontos.map(ponto => ({
        ...ponto,
        horario_previsto: horariosMap.get(ponto.id)?.substring(0, 5) || '--:--',
      }));
      setRotaCompleta(rota);
    } else if (pontos.length > 0) {
        const rota = pontos.map(ponto => ({...ponto, horario_previsto: '--:--'}));
        setRotaCompleta(rota);
    }
  }, [pontos, horarios]);

  const theme = {
    gradientStart: '#041C32',
    gradientEnd: '#0D3B66',
    textPrimary: '#FFF',
    textSecondary: '#CCC',
  };

  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15, padding: 5 },
    headerContent: { flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.textPrimary },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    pontoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      paddingVertical: 15,
    },
    timelineContainer: {
      width: 40,
      alignItems: 'center',
    },
    timelineLine: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.textPrimary,
      zIndex: 1,
    },
    pontoInfo: {
      flex: 1,
      marginLeft: 10,
    },
    pontoDescricao: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: 'bold',
    },
    horario: {
      fontSize: 20,
      color: theme.textPrimary,
      fontWeight: 'bold',
      width: 70,
      textAlign: 'right',
    },
  });

  if (isLoading && rotaCompleta.length === 0) {
    return (
      <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{viagemDescricao}</Text>
        </View>
      </View>
      <FlatList
        data={rotaCompleta}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.pontoItem}>
            <View style={styles.timelineContainer}>
              <View style={[styles.timelineLine, { top: index === 0 ? 25 : 0, bottom: index === rotaCompleta.length - 1 ? 25 : 0 }]} />
              <View style={styles.timelineDot} />
            </View>
            <View style={styles.pontoInfo}>
              <Text style={styles.pontoDescricao}>{item.descricao}</Text>
            </View>
            <Text style={styles.horario}>{item.horario_previsto}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      />
    </LinearGradient>
  );
};

export default DetalheViagemScreen;