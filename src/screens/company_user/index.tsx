import React, { useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MenuOptionsCompany from '../../components/menuoptionsCompany';
import { useAuth } from '../../hooks/auth';

const CompanyUserScreen: React.FC = () => {
  const { logout } = useAuth();
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
        <MenuOptionsCompany logout={logout} />
      </ScrollView>
    </LinearGradient>
  );
};

export default CompanyUserScreen;