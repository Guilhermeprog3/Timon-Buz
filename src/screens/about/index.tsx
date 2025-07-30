import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import theme from "../../colors/index"

const AboutScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const appVersion = "1.0.0";

  const openPortfolio = () => {
    Linking.openURL("https://guilhermeriosdev.vercel.app");
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.gradientStart,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    appSection: {
      alignItems: "center",
      marginBottom: 30,
    },
    logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    appName: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 4,
    },
    tagline: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 8,
    },
    version: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      paddingBottom: 8,
    },
    paragraph: {
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 22,
      marginBottom: 12,
    },
    creatorSection: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    creatorAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    creatorInfo: {
      flex: 1,
    },
    creatorName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 4,
    },
    creatorRole: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    featureIcon: {
      marginRight: 12,
      width: 24,
      alignItems: "center",
    },
    featureText: {
      fontSize: 15,
      color: theme.textPrimary,
      flex: 1,
    },
    contactButton: {
      backgroundColor: theme.buttonBackground,
      borderRadius: 8,
      padding: 14,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    contactButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "500",
      marginLeft: 8,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sobre</Text>
                </View>

                <View style={styles.appSection}>
                <View style={styles.logoContainer}>
                    <Ionicons name="bus-outline" size={64} color={theme.iconColor} />
                </View>
                <Text style={styles.appName}>Timon Buz</Text>
                <Text style={styles.tagline}>Seu guia de transporte público em Timon</Text>
                <Text style={styles.version}>Versão {appVersion}</Text>
                </View>

                <View style={styles.creatorSection}>
                <View style={styles.creatorAvatar}>
                    <Ionicons name="person" size={32} color={theme.textSecondary} />
                </View>
                <View style={styles.creatorInfo}>
                    <Text style={styles.creatorName}>Guilherme Silva Rios</Text>
                    <Text style={styles.creatorRole}>Desenvolvedor & Criador</Text>
                </View>
                </View>

                <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
                <Text style={styles.paragraph}>
                    O Timon Buz é uma plataforma de divulgação de linhas de transporte público, projetada para ajudar os cidadãos a se locomoverem pela cidade com mais facilidade.
                </Text>
                <Text style={styles.paragraph}>
                    Nosso objetivo é centralizar as informações sobre as rotas, paradas e horários das viagens, tornando o planejamento de seus trajetos mais simples e eficiente.
                </Text>
                </View>

                <View style={styles.section}>
                <Text style={styles.sectionTitle}>Principais Funcionalidades</Text>

                <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                    <Ionicons name="business-outline" size={20} color={theme.iconColor} />
                    </View>
                    <Text style={styles.featureText}>Visualização de empresas de ônibus</Text>
                </View>

                <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                    <Ionicons name="map-outline" size={20} color={theme.iconColor} />
                    </View>
                    <Text style={styles.featureText}>Consulta de todas as linhas e suas rotas</Text>
                </View>

                <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                    <Ionicons name="time-outline" size={20} color={theme.iconColor} />
                    </View>
                    <Text style={styles.featureText}>Verificação dos horários de cada viagem</Text>
                </View>

                <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                    <Ionicons name="heart-outline" size={20} color={theme.iconColor} />
                    </View>
                    <Text style={styles.featureText}>Salve suas linhas favoritas para acesso rápido</Text>
                </View>
                </View>

                <TouchableOpacity style={styles.contactButton} onPress={openPortfolio}>
                <Ionicons name="globe-outline" size={20} color={theme.buttonText} />
                <Text style={styles.contactButtonText}>Ver Portfólio</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    </LinearGradient>
  )
}

export default AboutScreen;