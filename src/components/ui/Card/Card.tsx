import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export interface CardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  variant?: 'glass' | 'solid' | 'bordered' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
  hover?: boolean;
  children: ReactNode;
}

export const Card = ({
  variant = 'glass',
  padding = 'md',
  rounded = '2xl',
  hover = false,
  children,
  className = '',
  ...props
}: CardProps) => {
  const variantStyles = {
    glass: "bg-white/5 backdrop-blur-md border border-white/10",
    solid: "bg-[#2D2A4A] border border-white/5",
    bordered: "bg-transparent border border-white/20",
    gradient: "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const roundedStyles = {
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  };

  const hoverStyles = hover ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer" : "";

  const combinedClassName = `${variantStyles[variant]} ${paddingStyles[padding]} ${roundedStyles[rounded]} ${hoverStyles} ${className}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={combinedClassName}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const GlassCard = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="glass" {...props} />
);

export default Card;
