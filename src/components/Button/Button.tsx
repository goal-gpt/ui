import React, { ButtonHTMLAttributes } from "react";
import { Button as BootstrapButton } from "react-bootstrap";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

export function Button({ children, ...props }: ButtonProps): JSX.Element {
  const { className: ogClass, variant } = props;
  const textColorClass = `text-${variant}-contrast`;
  const newClass = `${textColorClass} ${ogClass}`;

  return (
    <BootstrapButton
      {...props}
      variant={variant}
      className={newClass}
      style={{ height: "100%", width: "100%" }}
    >
      {children}
    </BootstrapButton>
  );
}

Button.defaultProps = {
  variant: "primary",
};
