import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./Button.module.css";

type ButtonVariant = "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyles = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonProps = ButtonStyles &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonStyles>;

type ButtonLinkProps = ButtonStyles &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonStyles> & {
    external?: boolean;
  };

function getButtonClassName({
  variant = "outline",
  size = "md",
  className,
}: ButtonStyles) {
  return [
    styles.button,
    styles[`button${variant[0].toUpperCase()}${variant.slice(1)}`],
    styles[`button${size[0].toUpperCase()}${size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName({ variant, size, className, children })}
      type="button"
      {...props}
    >
      <span>{children}</span>
    </button>
  );
}

export function ButtonLink({
  variant = "outline",
  size = "md",
  className,
  children,
  external = false,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={getButtonClassName({ variant, size, className, children })}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...props}
    >
      <span>{children}</span>
    </a>
  );
}
