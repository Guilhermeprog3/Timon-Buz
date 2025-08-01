import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MenuOptionsCompany from '../../components/menuoptionsCompany';
import { useAuth } from '../../hooks/auth';
import theme from "../../colors/index"
const CompanyUserScreen: React.FC = () => {
  const { logout, deleteUserAccount, profile, user } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
        paddingTop: 60,
        paddingBottom: 100,
    }
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <MenuOptionsCompany 
          profile={profile}
          user={user}
          logout={logout} 
          deleteUserAccount={deleteUserAccount}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default CompanyUserScreen;