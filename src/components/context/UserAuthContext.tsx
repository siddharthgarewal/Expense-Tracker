import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";

interface UserAuthContextType {
  user: User | null;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
  googleSignIn: () => Promise<any>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(
  undefined
);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error(
      "useUserAuth must be used within a UserAuthContextProvider"
    );
  }
  return context;
};

export const UserAuthContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setPending(false);
    });
  }, []);

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      let cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, {
        displayName: `${firstName} ${lastName}`,
      });
      return cred;
    } catch (error) {
      console.log(error);
    }
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut: () => Promise<void> = () => {
    return signOut(auth);
  };

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  if (pending) {
    return <>Loading...</>;
  }

  return (
    <UserAuthContext.Provider
      value={{ user, signUp, signIn, logOut, googleSignIn }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
