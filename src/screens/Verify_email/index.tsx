import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
import theme from "../../colors/index"

type VerifyEmailRouteProp = RouteProp<{ VerifyEmail: { email: string } }, 'VerifyEmail'>;

const VerifyEmailScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<VerifyEmailRouteProp>();
  const { resendConfirmationEmail } = useAuth();
  const { email } = route.params;

  const [isLoading, setIsLoading] = useState(false);


  const handleResend = async () => {
    setIsLoading(true);
    try {
      await resendConfirmationEmail(email);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível reenviar o e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1 
    },
    scrollContainer: { 
      flexGrow: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 32 
    },
    content: { 
      width: '100%', 
      alignItems: 'center' 
    },
    iconContainer: {
      width: 100, 
      height: 100, 
      borderRadius: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center', 
      alignItems: 'center',
      marginBottom: 30
    },
    heading: { fontSize: 28, 
      color: theme.textPrimary, 
      fontWeight: 'bold', 
      marginBottom: 16, 
      textAlign: 'center' 
    },
    subtitle: { 
      fontSize: 16, 
      color: theme.textSecondary, 
      textAlign: 'center', 
      lineHeight: 24, 
      marginBottom: 10 
    },
    emailText: { 
      fontSize: 16, 
      color: theme.textPrimary, 
      fontWeight: 'bold', 
      marginBottom: 30 
    },
    button: { width: '100%', 
      height: 52, 
      backgroundColor: theme.buttonBackground, 
      borderRadius: 8, 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'row', 
      marginTop: 20 
    },
    buttonText: { color: theme.buttonText, 
      fontSize: 16, 
      fontWeight: 'bold' 
    },
    resendButton: { 
      marginTop: 20
    },
    resendText: { color: theme.textPrimary, 
      fontSize: 14, 
      opacity: 0.8, 
      textDecorationLine: 'underline' 
    }
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-unread-outline" size={50} color={theme.buttonBackground} />
          </View>
          <Text style={styles.heading}>Confirme seu Cadastro</Text>
          <Text style={styles.subtitle}>Enviamos um link de confirmação para o seu e-mail:</Text>
          <Text style={styles.emailText}>{email}</Text>
          <Text style={styles.subtitle}>Por favor, clique no link para ativar sua conta e poder fazer login.</Text>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Voltar para o Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton} onPress={handleResend} disabled={isLoading}>
            {isLoading
              ? <ActivityIndicator color={theme.textPrimary} />
              : <Text style={styles.resendText}>Não recebeu? Reenviar e-mail</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default VerifyEmailScreen;