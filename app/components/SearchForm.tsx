import { Input } from "@material-tailwind/react";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Props {
  submitTo: string;
}

export default function SearchForm({ submitTo }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!query) return;
        router.push(`${submitTo}${query}`);
        setQuery("");
      }}
      className="w-full md:w-72"
    >
      <Input
        label="검색..."
        icon={
          <button>
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        }
        value={query}
        onChange={({ target }) => setQuery(target.value)}
        crossOrigin={undefined}
      />
    </form>
  );
}
