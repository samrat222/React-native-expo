import {useNavigation} from '@react-navigation/native';
import {APP_ROLES} from './constants';

const navigateToRoleDashboard = roleTitle => {
  const navigation = useNavigation();
  const role = APP_ROLES.find(r => r.title === roleTitle);

  if (role && role.navigateTo) {
    navigation.navigate(role.navigateTo);
  } else {
    console.error('Role or navigation route not found');
  }
};
