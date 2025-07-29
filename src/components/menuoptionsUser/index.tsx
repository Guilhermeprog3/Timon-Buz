import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { UserProfile } from '../../context/authcontext';
import { User } from '@supabase/supabase-js';

interface MenuOptionsProps {
  logout: () => void;
  deleteUserAccount: () => Promise<void>;
  profile: UserProfile | null;
  user: User | null;
}

const MenuOptionsUser: React.FC<MenuOptionsProps> = ({ logout, deleteUserAccount, profile, user }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    logout();
  };
  
  const handleDeleteAccount = async () => {
    setDeleteModalVisible(false);
    try {
        await deleteUserAccount();
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível deletar sua conta. Tente novamente.");
    }
  };

  const theme = { 
    gradientEnd: '#041C32', textPrimary: '#FFF', textSecondary: '#CCC',
    buttonBackground: '#F9A826', secondary: '#F9A826', red: '#D32F2F' 
  };
  
  const styles = StyleSheet.create({
    profileHeader: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 30,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.1)'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    profileEmail: {
        fontSize: 16,
        color: theme.textSecondary,
        marginTop: 4,
    },
    menuContainer: { 
      paddingBottom: 30, 
    },
    menuItem: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingVertical: 18, 
      paddingHorizontal: 24, 
    },
    menuItemText: { 
      fontSize: 16, 
      color: theme.textPrimary, 
      marginLeft: 20, 
      flex: 1 
    },
    deleteText: {
      color: theme.red
    },
    modalOverlay: { 
      flex: 1, justifyContent: 'center', alignItems: 'center', 
      backgroundColor: 'rgba(0, 0, 0, 0.7)' 
    },
    modalContainer: { 
       width: '85%', backgroundColor: theme.gradientEnd,
       borderRadius: 20, padding: 24, alignItems: 'center', 
       shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, 
       shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 
    },
    modalTitle: { 
      fontSize: 20, fontWeight: 'bold', color: theme.textPrimary, 
      marginBottom: 8, textAlign: 'center' 
    },
    modalMessage: { 
      fontSize: 16, color: theme.textSecondary, textAlign: 'center', 
      marginBottom: 24, lineHeight: 22 
    },
    modalButtonContainer: { 
      flexDirection: 'row', width: '100%', justifyContent: 'space-between' 
    },
    modalButton: { 
      flex: 1, paddingVertical: 14, borderRadius: 12, 
      alignItems: 'center', justifyContent: 'center' 
    },
    cancelButton: { 
      backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 8 
    },
    confirmButton: { 
      backgroundColor: theme.red, marginLeft: 8 
    },
    modalButtonText: { 
      fontSize: 16, fontWeight: 'bold', color: '#FFF' 
    },
  });

  return (
    <View>
        <View style={styles.profileHeader}>
            <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={theme.textPrimary} />
            </View>
            <Text style={styles.profileName}>{profile?.name || 'Usuário'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
        </View>

        <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')} activeOpacity={0.7}>
                <Ionicons name="information-circle-outline" size={24} color={theme.textSecondary} />
                <Text style={styles.menuItemText}>Sobre a Plataforma</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Ionicons name="document-text-outline" size={24} color={theme.textSecondary} />
                <Text style={styles.menuItemText}>Termos de Uso</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => setLogoutModalVisible(true)} activeOpacity={0.7}>
                <Ionicons name="exit-outline" size={24} color={theme.textSecondary} />
                <Text style={styles.menuItemText}>Sair da Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setDeleteModalVisible(true)} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={24} color={theme.red} />
                <Text style={[styles.menuItemText, styles.deleteText]}>Deletar Conta</Text>
            </TouchableOpacity>
        </View>
        
        {/* Modal de Logout */}
        <Modal animationType="fade" transparent={true} visible={isLogoutModalVisible} onRequestClose={() => setLogoutModalVisible(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setLogoutModalVisible(false)}>
                <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.modalTitle}>Confirmar Saída</Text>
                    <Text style={styles.modalMessage}>Você tem certeza de que deseja sair?</Text>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setLogoutModalVisible(false)} activeOpacity={0.8}>
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: theme.secondary, marginLeft: 8}]} onPress={handleLogout} activeOpacity={0.8}>
                            <Text style={styles.modalButtonText}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>

        {/* Modal de Deletar Conta */}
        <Modal animationType="fade" transparent={true} visible={isDeleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setDeleteModalVisible(false)}>
                <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.modalTitle}>Deletar Conta</Text>
                    <Text style={styles.modalMessage}>Esta ação é irreversível. Você tem certeza de que deseja deletar sua conta e todos os seus dados?</Text>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setDeleteModalVisible(false)} activeOpacity={0.8}>
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleDeleteAccount} activeOpacity={0.8}>
                            <Text style={styles.modalButtonText}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    </View>
  );
};

export default MenuOptionsUser;