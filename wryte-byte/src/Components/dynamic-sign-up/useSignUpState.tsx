import React, { createContext, useContext, useState } from 'react';

interface FormData {
  name: string;
  email: string;
}

interface SignUpState {
  isFormVisible: boolean;
  isSubmitted: boolean;
  formData: FormData;
  setIsFormVisible: (value: boolean) => void;
  setIsSubmitted: (value: boolean) => void;
  setFormData: (data: FormData) => void;
}

const SignUpContext = createContext<SignUpState | undefined>(undefined);

export const SignUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });

  return (
    <SignUpContext.Provider
      value={{
        isFormVisible,
        isSubmitted,
        formData,
        setIsFormVisible,
        setIsSubmitted,
        setFormData,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUpState = () => {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUpState must be used within a SignUpProvider');
  }
  return context;
};