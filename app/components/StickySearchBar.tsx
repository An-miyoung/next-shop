"use client";

import React, { useState } from "react";
import {
  Typography,
  MenuItem,
  Menu,
  MenuHandler,
  MenuList,
  Card,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  ChevronDownIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import categories from "@utils/categories";

const navListItems = categories.map((category) => {
  return {
    category,
    href: "",
  };
});

const NavListMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderItems = navListItems.map(({ category, href }) => (
    <Link href={href} key={category}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {category}
        </Typography>
      </MenuItem>
    </Link>
  ));

  return (
    <>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem className=" items-center gap-2 font-medium text-blue-gray-900 flex rounded-full">
              <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
              카테고리로 찾기{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className="w-[36rem] grid-cols-7 gap-3 overflow-visible grid">
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
    </>
  );
};

function NavList() {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
    </ul>
  );
}

export default function StickySearch() {
  return (
    <div className="flex items-center justify-start text-blue-gray-900">
      <div className="md:flex items-center gap-4 ">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium"
        >
          검색...
        </Typography>
        <div className="mr-4 block">
          <NavList />
        </div>
      </div>
    </div>
  );
}
