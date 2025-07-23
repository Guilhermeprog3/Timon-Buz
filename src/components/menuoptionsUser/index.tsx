import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface MenuOptionsProps {
  logout: () => void;
}

const MenuOptionsUser: React.FC<MenuOptionsProps> = ({ logout }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const theme = { 
    gradientEnd: '#041C32', textPrimary: '#FFF', textSecondary: '#CCC',
    buttonBackground: '#F9A826', secondary: '#F9A826', red: '#D32F2F' 
  };
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    logout();
  };

  const styles = StyleSheet.create({
    menuContainer: { 
      paddingBottom: 30, 
      marginTop: 20 
    },
    menuItem: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingVertical: 18, 
      paddingHorizontal: 24, 
      borderBottomWidth: StyleSheet.hairlineWidth, 
      borderBottomColor: 'rgba(255,255,255,0.1)' 
    },
    menuItemText: { 
      fontSize: 16, 
      color: theme.textPrimary, 
      marginLeft: 20, 
      flex: 1 
    },
    logoutText: { 
      color: theme.red 
    },
    modalOverlay: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(0, 0, 0, 0.7)' 
    },
    modalContainer: { width: '85%',
       backgroundColor: theme.gradientEnd,
       borderRadius: 20, 
       padding: 24, 
       alignItems: 'center', 
       shadowColor: '#000', 
       shadowOffset: { width: 0, height: 4 }, 
       shadowOpacity: 0.3, 
       shadowRadius: 5, 
       elevation: 8 
      },
    modalTitle: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: theme.textPrimary, 
      marginBottom: 8, 
      textAlign: 'center' 
    },
    modalMessage: { 
      fontSize: 16, 
      color: theme.textSecondary, 
      textAlign: 'center', 
      marginBottom: 24, 
      lineHeight: 22 
    },
    modalButtonContainer: { 
      flexDirection: 'row',
       width: '100%', 
       justifyContent: 'space-between' 
      },
    modalButton: { 
      flex: 1, 
      paddingVertical: 14, 
      borderRadius: 12, 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    cancelButton: { 
      backgroundColor: theme.secondary, 
      marginRight: 8 
    },
    logoutButton: { 
      backgroundColor: theme.red, 
      marginLeft: 8 
    },
    modalButtonText: { 
      fontSize: 16, 
      fontWeight: 'bold', 
      color: '#FFF' 
    },
    cancelButtonText: { 
      color: theme.textPrimary 
    },
  });

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={() => setLogoutModalVisible(true)} activeOpacity={0.7}>
        <Ionicons name="exit-outline" size={24} color={theme.red} />
        <Text style={[styles.menuItemText, styles.logoutText]}>Sair da Conta</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLogoutModalVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Confirmar Saída</Text>
            <Text style={styles.modalMessage}>Você tem certeza de que deseja sair?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setLogoutModalVisible(false)} activeOpacity={0.8}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.logoutButton]} onPress={handleLogout} activeOpacity={0.8}>
                <Text style={styles.modalButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MenuOptionsUser;