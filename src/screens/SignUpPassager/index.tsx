import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, ScrollView, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().trim().email("Por favor, insira um e-mail válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

const SignUpPassengerScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { signUpAsPassenger } = useAuth();
  const theme = {
    gradientstartlogin: '#0D3B66', gradientendlogin: '#041C32', textPrimary: '#FFF',
    textSecondary: '#CCC', buttonBackground: '#F9A826', buttonText: '#041C32', red: '#D32F2F'
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setFieldErrors({});
    setGlobalError('');

    try {
      signUpSchema.parse({ name, email, password });
      setIsLoading(true);
      await signUpAsPassenger(email, password, name);
      navigation.navigate('VerifyEmail', { email: email });
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
    container: { 
      flex: 1 
    },
    scrollContainer: { flexGrow: 1, 
      justifyContent: 'center', 
      paddingHorizontal: 32 
    },
    content: { 
      width: '100%' 
    },
    headerContainer: { 
      alignItems: 'center',
      marginBottom: 48 
      },
    heading: { fontSize: 28, 
      color: theme.textPrimary, 
      marginBottom: 8, 
      fontWeight: '300' 
    },
    subtitle: { 
      fontSize: 15, 
      color: theme.textSecondary, 
      textAlign: 'center' 
    },
    formContainer: { 
      gap: 18, 
      marginBottom: 24 
    },
    inputGroup: { 
      gap: 6 
    },
    inputContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      height: 52, 
      borderWidth: 1, 
      borderRadius: 8, 
      paddingHorizontal: 16, 
      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
      borderColor: 'rgba(255, 255, 255, 0.1)' 
    } as ViewStyle,
    inputContainerFocused: { 
      borderColor: theme.buttonBackground 
    } as ViewStyle,
    inputContainerError: { 
      borderColor: theme.red 
    } as ViewStyle,
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
      fontSize: 13, 
      marginLeft: 4 
    },
    globalErrorText: { 
      color: theme.red, 
      fontSize: 14, 
      textAlign: 'center', 
      marginBottom: 15 
    },
    button: { 
      height: 52, 
      backgroundColor: theme.buttonBackground, 
      borderRadius: 8, 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'row', 
      marginTop: 10
    },
    buttonText: { 
      color: theme.buttonText, 
      fontSize: 16, 
      fontWeight: 'bold', 
      marginLeft: isLoading ? 10 : 0 
    },
    linkButton: { 
      paddingVertical: 12,
      marginTop: 16 
    },
    link: { color: theme.textPrimary, 
      fontSize: 14, 
      opacity: 0.8, 
      textAlign: 'center' 
    },
  });

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Crie sua Conta</Text>
            <Text style={styles.subtitle}>É rápido e fácil</Text>
          </View>

          {globalError ? <Text style={styles.globalErrorText}>{globalError}</Text> : null}

          <View style={styles.formContainer}>
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
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
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