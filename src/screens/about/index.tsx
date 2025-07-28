import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AboutScreen = () => {
  const navigation = useNavigation();
  const theme = {
    gradientStart: '#041C32',
    gradientEnd: '#0D3B66',
    textPrimary: '#FFF',
    textSecondary: '#CCC',
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { paddingTop: 60, paddingHorizontal: 20 },
    header: { marginBottom: 30, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15, padding: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.textPrimary },
    section: { marginBottom: 25 },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 24,
    },
    creatorText: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 24,
      fontStyle: 'italic',
    }
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Sobre o Timon Buz</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nosso Propósito</Text>
          <Text style={styles.paragraph}>
            O Timon Buz foi criado com o objetivo de facilitar a vida dos usuários de transporte público na cidade de Timon. Nossa missão é fornecer informações precisas e em tempo real sobre as linhas, rotas e horários dos ônibus, tornando suas viagens mais previsíveis e tranquilas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Criador</Text>
          <Text style={styles.creatorText}>
            Este aplicativo foi desenvolvido com dedicação por Guilherme prog3.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AboutScreen;