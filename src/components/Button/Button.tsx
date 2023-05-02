import React, { ButtonHTMLAttributes } from "react";
import { Button as BootstrapButton } from "react-bootstrap";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  height?: string;
  width?: string;
}

export function Button({ children, ...props }: ButtonProps): JSX.Element {
  const { className: ogClass, variant, height, width, ...otherProps } = props;
  const textColorClass = `text-${variant}-contrast`;
  const newClass = `${textColorClass} ${ogClass || ""}`;

  return (
    <BootstrapButton
      {...otherProps}
      variant={variant}
      className={newClass}
      style={{ height, width }}
    >
      {children}
    </BootstrapButton>
  );
}

Button.defaultProps = {
  variant: "primary",
  height: "100%",
  width: "100%",
};
