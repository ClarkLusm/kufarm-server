import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  FC,
} from 'react';

import { EventBus } from '../common/event-bus';
import { IAuth } from '../common/interfaces/auth.interface';
import * as AuthHelper from '../common/helpers/auth.helper';
import { usePathname, useRouter } from 'next/navigation';

type AuthContextProps = {
  auth: IAuth | undefined;
  saveAuth: (auth: IAuth | undefined) => void;
  logout: () => void;
};

const initAuthContextPropsState = {
  auth: AuthHelper.getAuth(),
  saveAuth: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState<IAuth | undefined>(AuthHelper.getAuth());

  const saveAuth = (auth: IAuth | undefined) => {
    setAuth(auth);
    if (auth) {
      AuthHelper.setAuth(auth);
    } else {
      AuthHelper.removeAuth();
    }
  };

  const logout = () => {
    saveAuth(undefined);
  };

  return (
    <AuthContext.Provider value={{ auth, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

type WithChildren = {
  children?: ReactNode;
};

const AuthInitBase: FC<WithChildren> = ({ children }) => {
  const { logout, auth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const authenticated = !!auth?.accessToken || pathname === '/login';
    setIsLogged(authenticated);
    console.log('isLogged');
    
    if (!authenticated) {
      router.push('/login');
    }
  }, [auth]);

  useEffect(() => {
    EventBus.on('logout', logout, { once: true });
    return () => {
      EventBus.off('logout', () => {});
    };
  }, []);

  return isLogged ? children : null;
};

const AuthInit = ({ children }) => (
  <AuthProvider>
    <AuthInitBase>{children}</AuthInitBase>
  </AuthProvider>
);

export { AuthProvider, AuthInit, useAuth };
