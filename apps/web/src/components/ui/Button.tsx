import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gov-mid-blue disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-gov-dark-blue text-white hover:bg-[#1d3959]",
      secondary: "bg-gov-mid-blue text-white hover:bg-[#4d7895]",
      outline: "border-2 border-gov-dark-blue text-gov-dark-blue hover:bg-gov-light-gray",
      ghost: "hover:bg-gov-light-gray text-gov-dark-blue",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
