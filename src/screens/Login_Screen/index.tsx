import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { login } = useAuth();

  const theme = { 
    gradientstartlogin: '#0D3B66', gradientendlogin: '#041C32', textPrimary: '#FFF',
    textSecondary: '#CCC', buttonBackground: '#F9A826', buttonText: '#041C32', red: '#D32F2F' 
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }
    try {
      Keyboard.dismiss();
      setErrorMessage('');
      setIsLoading(true);
      await login(email, password);
    } catch (error: any) {
      setErrorMessage(error.message || 'Credenciais inválidas. Tente novamente.');
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
      paddingHorizontal: 32 
    },
    headerContainer: { 
      alignItems: 'center', 
      marginBottom: 48 
    },
    heading: { 
      fontSize: 32, 
      color: theme.textPrimary, 
      marginBottom: 12, 
      fontWeight: 'bold' 
    },
    subtitle: { 
      fontSize: 16, 
      color: theme.textSecondary, 
      textAlign: 'center' 
    },
    inputContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      width: '100%', 
      height: 56, 
      borderWidth: 1, 
      borderRadius: 12, 
      paddingHorizontal: 16, 
      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
      borderColor: 'rgba(255, 255, 255, 0.2)', 
      marginBottom: 20 
    },
    inputIcon: { 
      marginRight: 12 
    },
    input: { 
      flex: 1, 
      color: theme.textPrimary, 
      fontSize: 16 
    },
    showPasswordIcon: { 
      marginLeft: 12, 
      padding: 4 
    },
    errorText: { 
      color: theme.red, 
      fontSize: 14, 
      textAlign: 'center', 
      marginBottom: 20,
      fontWeight: 'bold'
    },
    button: { 
      width: '100%', 
      height: 56, 
      backgroundColor: theme.buttonBackground,
      borderRadius: 12, 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'row', 
      marginTop: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    buttonText: { 
      color: theme.buttonText, 
      fontSize: 16, 
      fontWeight: 'bold', 
      marginLeft: isLoading ? 12 : 0 
    },
    linksContainer: { 
      alignItems: 'center', 
      marginTop: 24 
    },
    linkButton: { 
      paddingVertical: 12 
    },
    link: { 
      color: theme.textPrimary, 
      fontSize: 14, 
      textDecorationLine: 'underline' 
    },
  });

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Bem-vindo de Volta!</Text>
            <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={theme.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={theme.textSecondary} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordIcon}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading} activeOpacity={0.8}>
            {isLoading && <ActivityIndicator size="small" color={theme.buttonText} />}
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default LoginScreen;