import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  ViewStyle,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/auth'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { z } from 'zod'
import { useState } from 'react'

const companySignUpSchema = z.object({
  companyName: z.string().trim().min(3, 'O nome da empresa é obrigatório.'),
  cnpj: z.string().trim().min(14, 'O CNPJ deve ter no mínimo 14 caracteres.'),
  adminName: z.string().trim().min(3, 'O seu nome é obrigatório.'),
  email: z.string().trim().email('E-mail inválido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
})

const SignUpCompanyScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>()
  const { signUpAsCompanyAdmin } = useAuth()
  const theme = {
    gradientstartlogin: '#0D3B66',
    gradientendlogin: '#041C32',
    textPrimary: '#FFF',
    textSecondary: '#CCC',
    buttonBackground: '#F9A826',
    buttonText: '#041C32',
    red: '#D32F2F',
  }

  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    adminName: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) clearFieldError(field)
    if (globalError) setGlobalError('')
  }

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }))
  }

  const handleSignUp = async () => {
    Keyboard.dismiss()
    setFieldErrors({})
    setGlobalError('')

    try {
      companySignUpSchema.parse(formData)
      setIsLoading(true)
      await signUpAsCompanyAdmin(formData)
      
      navigation.navigate('VerifyEmail', { email: formData.email });

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0]
          if (typeof fieldName === 'string') {
            errors[fieldName] = issue.message
          }
        })
        setFieldErrors(errors)
      } else {
        setGlobalError(error.message || 'Erro ao cadastrar empresa.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingTop: 60,
      paddingBottom: 20,
    },
    heading: {
      fontSize: 28,
      color: theme.textPrimary,
      marginBottom: 8,
      fontWeight: '300',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    inputGroup: { marginBottom: 18 },
    inputLabel: {
      color: theme.textSecondary,
      marginBottom: 6,
      marginLeft: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 52,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputContainerError: { borderColor: theme.red },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, color: theme.textPrimary, fontSize: 16 },
    errorText: {
      color: theme.red,
      fontSize: 13,
      marginLeft: 4,
      marginTop: 4,
    },
    globalErrorText: {
      color: theme.red,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 15,
    },
    button: {
      height: 52,
      backgroundColor: theme.buttonBackground,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 10,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: isLoading ? 10 : 0,
    },
    linkButton: { paddingVertical: 12, marginTop: 16 },
    link: {
      color: theme.textPrimary,
      fontSize: 14,
      opacity: 0.8,
      textAlign: 'center',
    },
  })

  return (
    <LinearGradient
      colors={[theme.gradientstartlogin, theme.gradientendlogin]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Cadastro da Empresa</Text>
        <Text style={styles.subtitle}>
          Preencha os dados da sua empresa e do administrador.
        </Text>

        {globalError ? (
          <Text style={styles.globalErrorText}>{globalError}</Text>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome da Empresa</Text>
          <View
            style={[
              styles.inputContainer,
              fieldErrors.companyName && styles.inputContainerError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Ex: Viação Timon City"
              placeholderTextColor={theme.textSecondary}
              value={formData.companyName}
              onChangeText={(v) => handleInputChange('companyName', v)}
            />
          </View>
          {fieldErrors.companyName && (
            <Text style={styles.errorText}>{fieldErrors.companyName}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>CNPJ</Text>
          <View
            style={[
              styles.inputContainer,
              fieldErrors.cnpj && styles.inputContainerError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="00.000.000/0001-00"
              placeholderTextColor={theme.textSecondary}
              value={formData.cnpj}
              onChangeText={(v) => handleInputChange('cnpj', v)}
              keyboardType="numeric"
            />
          </View>
          {fieldErrors.cnpj && (
            <Text style={styles.errorText}>{fieldErrors.cnpj}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Seu Nome (Administrador)</Text>
          <View
            style={[
              styles.inputContainer,
              fieldErrors.adminName && styles.inputContainerError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor={theme.textSecondary}
              value={formData.adminName}
              onChangeText={(v) => handleInputChange('adminName', v)}
              autoCapitalize="words"
            />
          </View>
          {fieldErrors.adminName && (
            <Text style={styles.errorText}>{fieldErrors.adminName}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Seu E-mail (Administrador)</Text>
          <View
            style={[
              styles.inputContainer,
              fieldErrors.email && styles.inputContainerError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="seu-email@dominio.com"
              placeholderTextColor={theme.textSecondary}
              value={formData.email}
              onChangeText={(v) => handleInputChange('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {fieldErrors.email && (
            <Text style={styles.errorText}>{fieldErrors.email}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Sua Senha (Administrador)</Text>
          <View
            style={[
              styles.inputContainer,
              fieldErrors.password && styles.inputContainerError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(v) => handleInputChange('password', v)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {fieldErrors.password && (
            <Text style={styles.errorText}>{fieldErrors.password}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator size="small" color={theme.buttonText} />}
          <Text style={styles.buttonText}>Finalizar Cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpCompanyScreen;