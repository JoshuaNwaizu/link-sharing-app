interface ButtonProps {
  name?: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
  className?: string;
  onClick?: (event: React.FormEvent) => void | Promise<void>;
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  name,
  type,
  className,
  onClick,
  disabled,
}) => {
  return (
    <button
      type={type}
      className={`bg-[#633CFF]  text-[1rem] cursor-pointer font-semibold py-3 rounded-md ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
