import { getActiveCategories } from "@/lib/posts";
import { HeaderClient } from "@/components/HeaderClient";

export function Header() {
  const categories = getActiveCategories();
  return <HeaderClient categories={categories} />;
}
