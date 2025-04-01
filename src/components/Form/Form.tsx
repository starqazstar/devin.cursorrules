import React from 'react';
import './Form.css';

export interface FormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ onSubmit, children, className = '' }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form className={`form ${className}`} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

export default Form; 