import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaUserSecret, FaArrowRight } from "react-icons/fa";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full bg-inherit">

      <form
        className="flex flex-col gap-4 sm:gap-6 bg-inherit"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaUser className="text-amber-400" />
          </div>
          <input
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm sm:text-base"
            type="email"
            name="email"
            placeholder=" Email Address"
            required
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaLock className="text-amber-400" />
          </div>
          <input
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm sm:text-base"
            type="password"
            name="password"
            placeholder="Secret Password"
            required
          />
        </div>

        <button
          className="w-full bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-4 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FaArrowRight />
              <span>{flow === "signIn" ? "Sign In" : "Join"}</span>
            </>
          )}
        </button>

        <div className="text-center text-sm text-amber-300">
          <span>
            {flow === "signIn"
              ? "Don't have an account yet? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer ml-1"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center my-4 sm:my-6">
        <hr className="flex-1 border-amber-800/50" />
        <span className="mx-4 text-amber-400 text-sm sm:text-base">OR</span>
        <hr className="flex-1 border-amber-800/50" />
      </div>

      <button
        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 rounded-xl font-bold hover:from-gray-900 hover:to-black transition-all shadow-xl flex items-center justify-center space-x-3 text-sm sm:text-base"
        onClick={() => void signIn("anonymous")}
      >
        <FaUserSecret />
        <span>Enter as Guest</span>
      </button>
    </div>
  );
}