import React from 'react'

interface ToothProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function Tooth({ className, ...props }: ToothProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2C15.5 2 18 3.5 18 7C18 10.5 16.5 13 16 15C15.5 17 17 19.5 16.5 20.5C16 21.5 14 22 13 21C12 20 12 18 12 18S12 20 11 21C10 22 8 21.5 7.5 20.5C7 19.5 8.5 17 8 15C7.5 13 6 10.5 6 7C6 3.5 8.5 2 12 2Z" />
    </svg>
  )
}
