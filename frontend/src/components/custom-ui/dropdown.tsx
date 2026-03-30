"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";

type Align = "start" | "end";
type Side = "bottom" | "top";

type DropdownContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  toggle: () => void;
  close: () => void;
  menuId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  align: Align;
  side: Side;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown components must be used inside <Dropdown />");
  return ctx;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Dropdown({
  children,
  defaultOpen = false,
  align = "end",
  side = "bottom",
  closeOnClickOutside = true,
  closeOnEscape = true,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  align?: Align;
  side?: Side;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const value = useMemo<DropdownContextValue>(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((prev) => !prev),
      close: () => setOpen(false),
      menuId,
      triggerRef,
      contentRef,
      align,
      side,
    }),
    [open, menuId, align, side]
  );

  useEffect(() => {
    if (!open || !closeOnClickOutside) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedContent = contentRef.current?.contains(target);
      if (!clickedTrigger && !clickedContent) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open, closeOnClickOutside]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEscape]);

  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

export function DropdownTrigger({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, toggle, menuId, triggerRef } = useDropdownContext();

  return (
    <button
      {...props}
      ref={triggerRef}
      type={props.type ?? "button"}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={menuId}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { open, menuId, contentRef, align, side } = useDropdownContext();

  const alignClasses =
    align === "start" ? "left-0 origin-top-left" : "right-0 origin-top-right";
  const sideClasses = side === "top" ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]";

  return (
    <div className="relative">
      <div
        {...props}
        id={menuId}
        role="menu"
        ref={contentRef}
        aria-hidden={!open}
        className={cx(
          "absolute z-50 min-w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10",
          "transition-all duration-200 ease-out will-change-transform",
          alignClasses,
          sideClasses,
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DropdownItem({
  children,
  className,
  onClick,
  closeOnSelect = true,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { closeOnSelect?: boolean }) {
  const { close } = useDropdownContext();

  return (
    <button
      {...props}
      role="menuitem"
      type={props.type ?? "button"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && closeOnSelect) close();
      }}
      className={cx(
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700",
        "transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900",
        "focus-visible:outline-none focus-visible:bg-slate-100",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownLabel({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx("px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-400", className)}
    >
      {children}
    </div>
  );
}

export function DropdownDivider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={cx("my-1 border-slate-200", className)} />;
}

type DropdownSelectOption = {
  value: string;
  label: ReactNode;
};

interface DropdownSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: DropdownSelectOption[];
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  placeholder?: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
}

export function DropdownSelect({
  options,
  value,
  onChange,
  placeholder,
  triggerClassName,
  contentClassName,
  itemClassName,
  ...props
}: DropdownSelectProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <Dropdown align="end">
      <div className="relative inline-flex">
        <DropdownTrigger className={cx("justify-between", triggerClassName)} aria-label={props["aria-label"]}>
          <span>{selected?.label ?? placeholder ?? value}</span>
          <span className="text-slate-400">▾</span>
        </DropdownTrigger>
        <DropdownContent className={contentClassName}>
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              className={cx(option.value === value ? "bg-slate-100 text-slate-900" : undefined, itemClassName)}
              onClick={() => onChange({ target: { value: option.value } })}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownContent>
      </div>
    </Dropdown>
  );
}