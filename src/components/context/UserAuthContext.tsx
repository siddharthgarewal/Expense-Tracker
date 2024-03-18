// In your UserAuthContext file

import { createContext, useContext, ReactNode } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

interface UserAuthContextType {
  signUp: (firstName:string,lastName:string,email: string, password: string) => Promise<any>; 
  signIn: (email: string, password: string) => Promise<any>; // Adjust the return type as necessary
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthContextProvider');
  }
  return context;
};

export const UserAuthContextProvider = ({ children }: { children: ReactNode }) => {
  const signUp = async (firstName:string,lastName:string,email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };


  return (
    <UserAuthContext.Provider value={{ signUp,signIn }}>
      {children}
    </UserAuthContext.Provider>
  );
};
