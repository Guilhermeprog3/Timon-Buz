import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MenuOptionsUser from '../../components/menuoptionsUser'
import { AuthContext } from '../../context/authcontext';

const UserPage: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const theme = { gradientStart: '#0D3B66', gradientEnd: '#041C32' };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
        paddingTop: 60,
    }
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <MenuOptionsUser logout={logout} />
      </ScrollView>
    </LinearGradient>
  );
};

export default UserPage;