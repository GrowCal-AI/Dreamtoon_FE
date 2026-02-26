import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30",
    secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm",
    gradient: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-purple-900/40",
    outline: "border border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5",
    ghost: "text-gray-400 hover:text-white hover:bg-white/10",
    glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex items-center">{icon}</span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
