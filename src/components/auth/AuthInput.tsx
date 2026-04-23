"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import clsx from "clsx";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, trailing, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-secondary"
        >
          {label}
        </label>
        <div className="group relative flex h-10 items-center rounded-lg border border-border bg-surface transition-colors duration-150 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
          {icon && (
            <span className="pointer-events-none flex h-full w-10 items-center justify-center text-tertiary group-focus-within:text-secondary">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "h-full flex-1 bg-transparent pr-3 text-sm text-primary placeholder:text-tertiary outline-none",
              !icon && "pl-3",
              trailing && "pr-1",
              className
            )}
            {...props}
          />
          {trailing && <div className="pr-2">{trailing}</div>}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
