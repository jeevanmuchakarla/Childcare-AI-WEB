import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && (
        <label className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full p-[18px] bg-app-surface dark:bg-app-surface-dark rounded-app border border-black/5 dark:border-white/5
            focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200
            text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary/50
            ${error ? 'border-red-500' : ''}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
