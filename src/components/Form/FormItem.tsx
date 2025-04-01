import React from 'react';
import './Form.css';

export interface FormItemProps {
  label?: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  required = false,
  children,
  className = ''
}) => {
  return (
    <div className={`form-item ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormItem; 