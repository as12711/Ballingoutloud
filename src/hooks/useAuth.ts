import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getCurrentUser, signIn, signUp, signOut } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check for existing session on mount
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    return dispatch(signUp({ email, password, fullName }));
  };

  const handleSignIn = async (email: string, password: string) => {
    return dispatch(signIn({ email, password }));
  };

  const handleSignOut = async () => {
    return dispatch(signOut());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};
