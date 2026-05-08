/**
 * Legacy HTML attributes from mirrored Café24 / table markup.
 * React omits some from JSX; allow them for 1:1 port without polluting every file.
 */
import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    bgcolor?: string;
    bordercolor?: string;
    valign?: string;
    vspace?: number | string;
    hspace?: number | string;
  }

  interface TableHTMLAttributes<T> {
    height?: number | string;
  }

  interface ThHTMLAttributes<T> {
    height?: number | string;
    width?: number | string;
  }

  interface TdHTMLAttributes<T> {
    height?: number | string;
    width?: number | string;
  }
}
