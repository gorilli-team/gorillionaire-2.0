import { JSX } from "react";

export default function Button({
  onClick,
  children,
  className,
}: {
  children: JSX.Element | string | number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${className} px-4 py-2 bg-blue-500 border border-transparent text-white text-sm rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-500 transition w-[100px]`}
    >
      {children}
    </button>
  );
}
