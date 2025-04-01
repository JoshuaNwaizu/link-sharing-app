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
}

const LoginForm: React.FC<LoginFormProps> = ({
  title,
  img,
  alt,
  type,
  name,
  id,
  placeholder,
  htmlFor,
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
        <div className="flex gap-2  py-[.75rem] border rounded-[.5rem] border-[#D9D9D9] items-center px-[1rem]">
          <img
            src={img}
            alt={alt}
          />
          <input
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            className=" px-3 text-[1rem] outline-none leading-[1.5rem] text-[#333] w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
