"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { FaSignOutAlt } from "react-icons/fa";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-700 to-yellow-700 text-white hover:from-amber-800 hover:to-yellow-800 border-2 border-amber-600"
      onClick={() => void signOut()}
    >
      <FaSignOutAlt className="text-sm sm:text-base" />
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}