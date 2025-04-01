interface ButtonProps {
  name?: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
  className?: string;
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({ name, type, className, onClick }) => {
  return (
    <button
      type={type}
      className={`bg-[#633CFF] text-white text-[1rem] font-semibold py-3 rounded-md ${className}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
