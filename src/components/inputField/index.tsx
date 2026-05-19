import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";
import styles from "./styles.module.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  isTextarea?: false;
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  isTextarea: true;
}

type Props = InputFieldProps | TextareaFieldProps;

export default function InputField(props: Props) {
  const { label, error, icon, isTextarea, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = !isTextarea && (rest as InputHTMLAttributes<HTMLInputElement>).type === "password";

  const inputClasses = [
    styles.input,
    icon ? styles.inputWithIcon : "",
    isTextarea ? styles.textarea : "",
    error ? styles.error : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {isTextarea ? (
          <textarea
            className={inputClasses}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={inputClasses}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            type={isPassword && showPassword ? "text" : (rest as InputHTMLAttributes<HTMLInputElement>).type}
          />
        )}
        {isPassword && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
