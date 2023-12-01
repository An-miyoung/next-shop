import React from "react";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  RectangleGroupIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import { MenuItems } from "@app/types";
import SignOutButton from "./SignOut";

interface Props {
  open: boolean;
  onClose(): void;
  menuItems: MenuItems[];
}

export function MobileNav({ open, onClose, menuItems }: Props) {
  const { isAdmin, loggedIn } = useAuth();

  return (
    <>
      <Drawer open={open} onClose={onClose}>
        <div className="mb-2 flex items-center justify-between p-4 z-50">
          <Typography variant="h5" color="blue-gray">
            Next Shop
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={onClose}>
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </IconButton>
        </div>
        <List>
          {loggedIn ? (
            <>
              {menuItems.map(({ href, icon, label }) => {
                return (
                  <Link key={href} href={href}>
                    <ListItem onClick={onClose}>
                      <ListItemPrefix>{icon}</ListItemPrefix>
                      {label}
                    </ListItem>
                  </Link>
                );
              })}
              <ListItem>
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                <SignOutButton>로그아웃</SignOutButton>
              </ListItem>
            </>
          ) : (
            <div className="flex items-center">
              <Link
                className="pl-3 pr-4 py-1 flex-1 text-center"
                href="/auth/signin"
              >
                <div className="flex flex-row ">
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="pl-4" onClick={onClose}>
                    로그인
                  </span>
                </div>
              </Link>
              <Link
                className="bg-blue-500 text-white px-4 py-1 rounded flex-1 text-center"
                href="/auth/signup"
              >
                <span onClick={onClose}>회원가입</span>
              </Link>
            </div>
          )}

          {isAdmin ? (
            <Link href="/dashboard">
              <ListItem onClick={onClose}>
                <ListItemPrefix>
                  <RectangleGroupIcon className="h-4 w-4" />
                </ListItemPrefix>
                관리자전용
              </ListItem>
            </Link>
          ) : null}
        </List>
      </Drawer>
    </>
  );
}
