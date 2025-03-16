// src/components/Navbar.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { generatePages } from "@/utils/common.util";
import { validateAuth } from "@/utils/auth.utils";
import type { Business, StaticData } from "@/types/business.types";
import { User, ShoppingCart, MapPin, Package, LogOut } from "lucide-react";
import { isActivePath } from "@/utils/path.utils";
import { CartBadge } from "./Cart/CartBadge";

interface NavbarProps {
  businessData: Business;
  staticData: StaticData;
  pathname: string;
  cartCount: number;
}

export default async function Navbar({
  businessData,
  pathname,
  cartCount
}: NavbarProps) {
  const pages = generatePages(businessData);
  const middlePages = pages.filter((page: any) => page.group === "navbar-middle");
  const user : any = await validateAuth();

  const isActiveLink = (path: string) => {
    // Don't consider query params for matching
    const cleanPath = pathname.split("?")[0];
    const isActive = isActivePath(cleanPath, path);
    return isActive;
  };

  const isActiveParent = (item: any) => {
    if (!item.hasChildren) {
      return isActiveLink(item.to);
    }
    return item.children?.some((child: any) => isActiveLink(child.to));
  };

  // Update mobile menu link className
  const getMobileItemClass = (itemPath: string) =>
    `block px-3 py-2 text-sm sm:text-base rounded-md transition-all duration-200 ${
      isActiveLink(itemPath)
        ? "bg-[rgb(1,82,168)] text-white"
        : "text-gray-700 hover:bg-[rgb(1,82,168)]/10 hover:text-[rgb(1,82,168)]"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {businessData?.logoURl && (
              <Image
                src={businessData.logoURl}
                alt="Logo"
                width={120}
                height={40}
                className="logo-navbar"
                priority
              />
            )}
          </Link>

          {/* Mobile Auth Links - Moved outside dropdown */}
          <div className="flex items-center space-x-2 lg:hidden">
            {businessData?.enableEcommerce && (
              <>
                <Link
                  href="/cart"
                  className="p-2 rounded-md text-gray-700 hover:text-[rgb(1,82,168)] relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <CartBadge count={cartCount} />
                </Link>
                {user ? (
                  <details className="relative">
                    <summary className="list-none">
                      <div className="w-8 h-8 rounded-full bg-[rgb(1,82,168)] text-white flex items-center justify-center cursor-pointer">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    </summary>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="p-2 space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <Package className="w-4 h-4 text-gray-400" />
                          <span>Orders</span>
                          {user.orderCount > 0 && (
                            <span className="ml-auto bg-[rgb(1,82,168)]/10 text-[rgb(1,82,168)] px-2 py-0.5 rounded-full text-xs">
                              {user.orderCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          href="/address"
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>Addresses</span>
                        </Link>

                        <Link
                          href="/products"
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <ShoppingCart className="w-4 h-4 text-gray-400" />
                          <span>Products</span>
                        </Link>

                        <div className="my-2 border-t border-gray-100"></div>

                        <form action="/api/auth/logout" method="POST">
                          <button
                            type="submit"
                            className="flex w-full items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <LogOut className="w-4 h-4 text-red-400" />
                            <span>Logout</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </details>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/login"
                      className="px-3 py-1.5 text-sm font-medium text-[rgb(1,82,168)] hover:text-[rgb(1,82,168)]/80"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-3 py-1.5 text-sm font-medium text-white bg-[rgb(1,82,168)] hover:bg-[rgb(1,82,168)]/90 rounded-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
            {/* Mobile Menu Button */}
            <details className="lg:hidden group">
              <summary className="p-2 rounded-md text-gray-700 hover:text-[rgb(1,82,168)] focus:outline-none cursor-pointer list-none">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </summary>
              <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-b-lg border-t">
                {middlePages.map((item:any) => (
                  <div key={item.label} className="p-2">
                    {!item.hasChildren ? (
                      <Link
                        href={item.to}
                        className={getMobileItemClass(item.to)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className="w-full space-y-1">
                        <div className="text-sm font-medium text-gray-700 px-3 py-2 bg-gray-50">
                          {item.label}
                        </div>
                        {item.children?.map((child) => (
                          <Link
                            key={child.label}
                            href={child.to}
                            className={`block px-4 py-2 rounded-md transition-all duration-200 ${
                              pathname === child.to
                                ? "bg-[rgb(1,82,168)] text-white font-medium shadow-md"
                                : "text-gray-600 hover:bg-[rgb(1,82,168)]/10 hover:text-[rgb(1,82,168)]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {middlePages.map((item:any) => (
              <div key={item.label} className="relative group">
                {!item.hasChildren ? (
                  <Link
                    href={item.to}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      isActiveLink(item.to)
                        ? "text-[rgb(1,82,168)] bg-[rgb(1,82,168)]/5 font-medium"
                        : "text-gray-700 hover:text-[rgb(1,82,168)] hover:bg-[rgb(1,82,168)]/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className="relative inline-block text-left group">
                    <button
                      className={`px-4 py-2 rounded-md transition-all duration-200 inline-flex items-center relative ${
                        isActiveParent(item)
                          ? "text-[rgb(1,82,168)] font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[rgb(1,82,168)]"
                          : "text-gray-700 hover:text-[rgb(1,82,168)] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[rgb(1,82,168)] after:transition-all after:duration-300 group-hover:after:w-full"
                      }`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.children?.map((child) => (
                        <Link
                          key={child.label}
                          href={child.to}
                          className={`block px-4 py-2 text-sm transition-all duration-200 ${
                            isActiveLink(child.to)
                              ? "bg-[rgb(1,82,168)]/10 text-[rgb(1,82,168)] font-medium"
                              : "text-gray-700 hover:bg-[rgb(1,82,168)]/5 hover:text-[rgb(1,82,168)]"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Auth Links */}
          {businessData?.enableEcommerce && (
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[rgb(1,82,168)] text-white flex items-center justify-center">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.fullName}</span>
                    <svg
                      className="w-4 h-4 opacity-50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="font-medium text-gray-900">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {user.email}
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-2 space-y-1">
                      <form
                        action="/api/auth/logout"
                        method="POST"
                        className="w-full"
                      >
                        {/* Profile Section */}
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors group/item w-full"
                        >
                          <User className="w-4 h-4 text-gray-400 group-hover/item:text-[rgb(1,82,168)]" />
                          <span className="flex-1">Profile</span>
                        </Link>

                        {/* Orders Section */}
                        <Link
                          href="/orders"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors group/item w-full"
                        >
                          <Package className="w-4 h-4 text-gray-400 group-hover/item:text-[rgb(1,82,168)]" />
                          <span className="flex-1">Orders</span>
                          {user.orderCount > 0 && (
                            <span className="bg-[rgb(1,82,168)]/10 text-[rgb(1,82,168)] px-2 py-0.5 rounded-full text-xs">
                              {user.orderCount}
                            </span>
                          )}
                        </Link>

                        {/* Address Section */}
                        <Link
                          href="/address"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors group/item w-full"
                        >
                          <MapPin className="w-4 h-4 text-gray-400 group-hover/item:text-[rgb(1,82,168)]" />
                          <span className="flex-1">Addresses</span>
                        </Link>

                        {/* Products Section */}
                        <Link
                          href="/products"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors group/item w-full"
                        >
                          <ShoppingCart className="w-4 h-4 text-gray-400 group-hover/item:text-[rgb(1,82,168)]" />
                          <span className="flex-1">Products</span>
                        </Link>

                        {/* Divider */}
                        <div className="my-2 border-t border-gray-100"></div>

                        {/* Logout Button */}
                        <button
                          type="submit"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors group/item w-full"
                        >
                          <LogOut className="w-4 h-4 text-red-400 group-hover/item:text-red-600" />
                          <span>Logout</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/login" className="btn-login">
                    Login
                  </Link>
                  <Link href="/register" className="btn-register">
                    Sign Up
                  </Link>
                </>
              )}
              <Link href="/cart" className="relative p-2">
                <ShoppingCart className="w-6 h-6" />
                <CartBadge count={cartCount} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
