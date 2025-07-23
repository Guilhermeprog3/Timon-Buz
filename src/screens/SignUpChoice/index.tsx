import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const SignUpChoiceScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const theme = {
    gradientstartlogin: '#0D3B66', gradientendlogin: '#041C32', textPrimary: '#FFF',
    textSecondary: '#CCC', buttonBackground: '#F9A826', buttonText: '#041C32',
  };
  
  const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 32 
    },
    heading: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: theme.textPrimary, 
        textAlign: 'center', 
        marginBottom: 12 
    },
    subtitle: { 
        fontSize: 18, 
        color: theme.textSecondary, 
        textAlign: 'center', 
        marginBottom: 40, 
        lineHeight: 26 
    },
    button: { 
        height: 52, 
        backgroundColor: theme.buttonBackground, 
        borderRadius: 8, alignItems: 'center', 
        justifyContent: 'center' 
    },
    buttonText: { 
        color: theme.buttonText, 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    linkButton: { 
        marginTop: 24 
    },
    linkText: { 
        color: theme.textPrimary, 
        textAlign: 'center' 
    },
    modalOverlay: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.7)' 
    },
    modalContainer: { 
        width: '90%', 
        backgroundColor: theme.gradientendlogin, 
        borderRadius: 15, 
        padding: 20 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: theme.textPrimary, 
        textAlign: 'center', 
        marginBottom: 25 
    },
    optionButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: 20, 
        borderRadius: 10, 
        marginBottom: 15 
    },
    optionTextContainer: { 
        marginLeft: 15, 
        flex: 1 
    },
    optionTitle: { 
        color: theme.textPrimary, 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    optionSubtitle: { 
        color: theme.textSecondary, 
        fontSize: 14, 
        marginTop: 4 
    },
  });

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
        <Text style={styles.heading}>Junte-se a Nós</Text>
        <Text style={styles.subtitle}>Como você gostaria de usar o aplicativo?</Text>
      
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Começar Cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Já tenho uma conta</Text>
        </TouchableOpacity>

        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            animationType="fade"
        >
            <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.modalTitle}>Selecione seu perfil</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={() => { setModalVisible(false); navigation.navigate('SignUpPassenger'); }}>
                        <Ionicons name="person-outline" size={32} color={theme.buttonBackground} />
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Sou um Cidadão</Text>
                            <Text style={styles.optionSubtitle}>Quero acompanhar os ônibus.</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={() => { setModalVisible(false); navigation.navigate('SignUpCompany'); }}>
                        <Ionicons name="business-outline" size={32} color={theme.buttonBackground} />
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Sou uma Empresa</Text>
                            <Text style={styles.optionSubtitle}>Quero cadastrar minha frota.</Text>
                        </View>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    </LinearGradient>
  );
};

export default SignUpChoiceScreen;