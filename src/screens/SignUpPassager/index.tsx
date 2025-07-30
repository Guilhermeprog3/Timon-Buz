import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, ScrollView, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { z } from 'zod';
import theme from "../../colors/index"
const signUpSchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().trim().email("Por favor, insira um e-mail válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

const SignUpPassengerScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { signUpAsPassenger } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setFieldErrors({});
    setGlobalError('');

    try {
      signUpSchema.parse({ name, email, password });
      setIsLoading(true);
      await signUpAsPassenger(email, password, name);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach(issue => {
          const fieldName = issue.path[0];
          if (typeof fieldName === 'string') {
            errors[fieldName] = issue.message;
          }
        });
        setFieldErrors(errors);
      } else if (error instanceof Error) {
        setGlobalError(error.message || 'Erro ao criar conta.');
      } else {
        setGlobalError('Ocorreu um erro inesperado.');
      }
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    if (globalError) setGlobalError('');
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { 
      flexGrow: 1, 
      justifyContent: 'center', 
      paddingHorizontal: 32,
      paddingVertical: 40,
    },
    heading: {
      fontSize: 32,
      color: theme.textPrimary,
      marginBottom: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
    },
    inputGroup: { marginBottom: 20 },
    inputContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      height: 56, 
      borderWidth: 1, 
      borderRadius: 12, 
      paddingHorizontal: 16, 
      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    inputContainerError: { 
      borderColor: theme.red,
    },
    inputIcon: { 
      marginRight: 12,
    },
    input: { 
      flex: 1, 
      color: theme.textPrimary, 
      fontSize: 16,
    },
    showPasswordIcon: { 
      marginLeft: 12, 
      padding: 4,
    },
    errorText: { 
      color: theme.red, 
      fontSize: 13, 
      marginLeft: 4,
      marginTop: 6,
    },
    globalErrorText: { 
      color: theme.red, 
      fontSize: 14, 
      textAlign: 'center', 
      marginBottom: 20,
      fontWeight: 'bold',
    },
    button: { 
      height: 56, 
      backgroundColor: theme.buttonBackground, 
      borderRadius: 12, 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'row', 
      marginTop: 20,
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
      marginLeft: isLoading ? 12 : 0,
    },
    linkButton: { 
      paddingVertical: 12,
      marginTop: 20,
    },
    link: { 
      color: theme.textPrimary, 
      fontSize: 14, 
      textDecorationLine: 'underline', 
      textAlign: 'center',
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.heading}>Crie sua Conta</Text>
          <Text style={styles.subtitle}>É rápido e fácil</Text>

          {globalError ? <Text style={styles.globalErrorText}>{globalError}</Text> : null}

          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, fieldErrors.name && styles.inputContainerError]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Nome Completo" placeholderTextColor={theme.textSecondary} value={name} onChangeText={(text) => { setName(text); clearFieldError('name'); }}/>
            </View>
            {fieldErrors.name && <Text style={styles.errorText}>{fieldErrors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, fieldErrors.email && styles.inputContainerError]}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={theme.textSecondary} value={email} onChangeText={(text) => { setEmail(text); clearFieldError('email'); }} keyboardType="email-address" autoCapitalize="none" />
            </View>
            {fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, fieldErrors.password && styles.inputContainerError]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={theme.textSecondary} secureTextEntry={!showPassword} value={password} onChangeText={(text) => { setPassword(text); clearFieldError('password'); }} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordIcon}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading} activeOpacity={0.8}>
            {isLoading && <ActivityIndicator size="small" color={theme.buttonText} />}
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.link}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpPassengerScreen;