import React, { ButtonHTMLAttributes } from "react";
import { Button as BootstrapButton } from "react-bootstrap";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

export function Button({ children, ...props }: ButtonProps): JSX.Element {
  const { variant } = props;
  const textColorClass = `text-${variant}-contrast`;

  return (
    <BootstrapButton variant={variant} className={textColorClass} {...props}>
      {children}
    </BootstrapButton>
  );
}

Button.defaultProps = {
  variant: "primary",
};
