import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";

export default function ExercisesPage() {
  return (
    <div className="flex w-full max-w-lg mx-auto flex-col gap-6 mt-10">
      <h1 className="font-semibold text-xl">Exercícios</h1>
      <Item variant="outline" size="sm" asChild>
        <Link href="#">
          <ItemContent>
            <ItemTitle className="text-lg">HTML</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
      <Item variant="outline" size="sm" asChild>
        <Link href="#">
          <ItemContent>
            <ItemTitle className="text-lg">CSS</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
      <Item variant="outline" size="sm" asChild>
        <Link href="/exercises/javascript">
          <ItemContent>
            <ItemTitle className="text-lg">JavaScript</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
    </div>
  );
}
