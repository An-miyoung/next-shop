// user authorization
export interface MenuItems {
  href: string;
  icon: React.JSX.Element;
  label: string;
}

export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar?: { url: string; id: string };
  verified: boolean;
}

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  verified: boolean;
}

export interface EmailVerifyRequest {
  token: string;
  userId: string;
}

export interface SigninCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  userId: string;
  token: string;
  password: string;
}

// Product
export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: {
    mrp: number;
    salePrice: number;
    saleOff: number;
  };
  category: string;
  quantity: number;
}

export interface NewProductInfo {
  title: string;
  description: string;
  bulletPoints?: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
  thumbnail?: File;
  images?: File[];
}
