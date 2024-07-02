import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import {Buffer} from 'buffer';

export const decodeRolesFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const parts = token.split('.').map(part => {
        return Buffer.from(
          part.replace(/-/g, '+').replace(/_/g, '/'),
          'base64',
        );
      });
      const payload = JSON.parse(parts[1].toString());
      //   console.log(payload);
      const roles = payload.authorities;
      return roles[0];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return [];
  }
};

// const Buffer = require(buffer).Buffer;
// export const decodeTokenGetUserType = (token) => {
//     const parts = token.split(“.”).map((part) => {
//         return Buffer.from(
//             part.replace(/-/g, “+”).replace(/_/g, “/”),
//             “base64"
//         );
//     });
//     const payload = JSON.parse(parts[1].toString());
//     return payload.authorities[0];
// };
