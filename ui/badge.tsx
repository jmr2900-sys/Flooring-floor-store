import * as React from "react";
export function Badge({ className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white ${className}`} {...props} />
}
