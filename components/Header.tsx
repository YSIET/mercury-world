import AdminHeaderTopLinks from "@/components/AdminHeaderTopLinks";
import HeaderClient, { type HeaderClientProps, SideNav } from "@/components/HeaderClient";
import { MENU_ITEMS } from "@/lib/menu-items";

export type { HeaderClientProps as HeaderProps };
export { MENU_ITEMS, SideNav };

export default async function Header(props: HeaderClientProps) {
  return (
    <HeaderClient
      {...props}
      adminTopLinks={<AdminHeaderTopLinks />}
    />
  );
}
