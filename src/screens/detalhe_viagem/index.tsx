import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { useLinhas } from '../../hooks/linha';
import { PontoItinerario } from '../../context/linhacontext';

type RotaCompletaItem = PontoItinerario & { horario_previsto?: string };

type DetalheViagemRouteProp = RouteProp<{ DetalheViagem: { viagemId: string; viagemDescricao: string, linhaId: string, diasSemana: string[] | null } }, 'DetalheViagem'>;

const formatarDiasSemana = (dias: string[] | null): string => {
    if (!dias || dias.length === 0) return 'Dias não informados';
    const DIAS_MAP: { [key: string]: string } = {
        seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta',
        sex: 'Sexta', sab: 'Sábado', dom: 'Domingo'
    };
    if (dias.length === 7) return 'Todos os dias';
    if (dias.length === 5 && ['seg', 'ter', 'qua', 'qui', 'sex'].every(d => dias.includes(d))) return 'Segunda a Sexta';
    if (dias.length === 2 && ['sab', 'dom'].every(d => dias.includes(d))) return 'Fim de Semana';
    
    return dias.map(d => DIAS_MAP[d] || d).join(', ');
};

const DetalheViagemScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<DetalheViagemRouteProp>();
  const { viagemId, viagemDescricao, linhaId, diasSemana } = route.params;

  const { pontos, horarios, getPontosDaLinha, getHorariosDaViagem, isLoading } = useLinhas();
  const [rotaCompleta, setRotaCompleta] = React.useState<RotaCompletaItem[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
        await Promise.all([
            getPontosDaLinha(linhaId),
            getHorariosDaViagem(viagemId)
        ]);
    };
    fetchData();
  }, [linhaId, viagemId]);

  React.useEffect(() => {
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
    buttonBackground: '#F9A826',
    red: '#E57373',
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      paddingTop: 60 },
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
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    infoSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoIcon: {
        marginRight: 15,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '600',
    },
    description: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 22,
    },
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
    warningContainer: {
      backgroundColor: 'rgba(227, 88, 88, 0.1)',
      borderRadius: 12,
      padding: 15,
      marginHorizontal: 20,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(227, 88, 88, 0.3)',
    },
    warningIcon: {
      marginRight: 12,
    },
    warningText: {
      color: theme.red,
      fontSize: 14,
      lineHeight: 20,
      flex: 1,
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

      <View style={styles.infoSection}>
          <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={24} color={theme.buttonBackground} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Dias de Funcionamento</Text>
                  <Text style={styles.infoValue}>{formatarDiasSemana(diasSemana)}</Text>
              </View>
          </View>
           <View style={[styles.infoRow, { marginBottom: 0 }]}>
              <Ionicons name="information-circle-outline" size={24} color={theme.buttonBackground} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Itinerário</Text>
                  <Text style={styles.description}>Acompanhe abaixo a ordem das paradas e o horário previsto de passagem do ônibus.</Text>
              </View>
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
        ListFooterComponent={
            <View style={styles.warningContainer}>
                <Ionicons name="warning-outline" size={22} color={theme.red} style={styles.warningIcon} />
                <Text style={styles.warningText}>
                    Atenção: os horários são previsões e podem sofrer alterações ou atrasos.
                </Text>
            </View>
        }
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
      />
    </LinearGradient>
  );
};

export default DetalheViagemScreen;