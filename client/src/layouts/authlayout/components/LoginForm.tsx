import React from 'react';

interface LoginFormProps {
  title?: string;
  img?: string;
  alt?: string;
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  htmlFor?: string;
  error?: boolean;
  className?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  confirmPassword?: boolean;
  errors?: string[];
}

const LoginForm: React.FC<LoginFormProps> = ({
  title,
  img,
  alt,
  type,
  name,
  id,
  placeholder,
  error,
  className,
  htmlFor,
  onChange,
  errorMessage,
  errors = [],
}) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={htmlFor}
          className=" text-[#333] text-[.75rem] leading-[1.125rem] font-semibold"
        >
          {title}
        </label>
        <div
          className={` 
          flex gap-2 transition-all duration-250 focus-within:border-[#633CFF] focus-within:shadow-[0_0_32px_0_rgba(99,60,255,0.25)] py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem] 
         ${error && (errorMessage || errors.length > 0) && 'border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_32px_0_rgba(255,0,0,0.15)] '} `}
        >
          <img
            src={img}
            alt={alt}
          />
          <input
            type={type}
            name={name}
            onChange={onChange}
            id={id}
            placeholder={placeholder}
            className={` px-3 text-[1rem] outline-none leading-[1.5rem] text-[#333] w-full ${className} ${
              error && (errorMessage || errors.length > 0) && 'border-red-500'
            }`}
          />
        </div>

        {error && (errorMessage || errors.length > 0) && (
          <div className="flex flex-col gap-1">
            {errorMessage && (
              <p className="text-red-500 text-xs">{errorMessage}</p>
            )}
            {errors.map((error, index) => (
              <p
                key={index}
                className="text-red-500 text-xs"
              >
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
