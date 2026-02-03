import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { CustomerHome } from "./components/CustomerHome";
import { AdminDashboard } from "./components/AdminDashboard";
import { MenuPage } from "./components/MenuPage";
import { CateringPage } from "./components/CateringPage";
import { OrderHistory } from "./components/OrderHistory";
import {
  FaHome,
  FaHistory,
  FaCrown,
  FaBars,
  FaTimes,
  FaUtensils,
  FaGlassCheers
} from "react-icons/fa";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient("https://whimsical-wolverine-532.convex.cloud");


export default function App() {
  return (
    <ConvexProvider client={convex}>
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950">
        <Content />
        <Toaster position="top-center" />
      </div>
    </ConvexProvider>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'catering' | 'orders' | 'admin'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate isAdmin safely
  const isAdmin = useMemo(() => {
    return loggedInUser?.email === "mahgoubzeyad857@gmail.com";
  }, [loggedInUser]);

  // Auto-redirect admin to dashboard
  useEffect(() => {
    if (loggedInUser && isAdmin && currentPage === 'home') {
      setCurrentPage('admin');
    }
  }, [loggedInUser, isAdmin, currentPage]);

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
          <div className="text-amber-200">Loading  Experience...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 text-white shadow-2xl fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <img loading="lazy" src="../src/assets/icon.webp" alt="Hameed Catering Logo" className="w-11 h-9 sm:w-10 sm:h-10 rounded-full" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wide">Hameed Catering</h1>
                <p className="text-amber-200 text-xs sm:text-sm"> Food & service</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold tracking-wide">Hameed Catering</h1>
                <p className="text-amber-200 text-xs"> Food & service</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Authenticated>
                <div className="flex items-center space-x-4">
                  {!isAdmin && (
                    <nav className="flex space-x-4">
                      <button
                        onClick={() => setCurrentPage('home')}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${currentPage === 'home'
                            ? 'bg-amber-600 text-white shadow-lg'
                            : 'text-amber-200 hover:bg-amber-800/50'
                          }`}
                      >
                        <FaHome />
                        <span>Home</span>
                      </button>
                      <button
                        onClick={() => setCurrentPage('orders')}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${currentPage === 'orders'
                            ? 'bg-amber-600 text-white shadow-lg'
                            : 'text-amber-200 hover:bg-amber-800/50'
                          }`}
                      >
                        <FaHistory />
                        <span>My Orders</span>
                      </button>
                    </nav>
                  )}
                  <SignOutButton />
                </div>
              </Authenticated>

              <Unauthenticated>
                <div className="text-amber-200 text-sm">
                  Welcome
                </div>
              </Unauthenticated>
            </div>

            <div className="md:hidden flex items-center space-x-3">
              <Authenticated>
                <SignOutButton />
              </Authenticated>

            </div>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
      </header>



      <main className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        <Unauthenticated>
          <LoginPage />
        </Unauthenticated>

        <Authenticated>
          {isAdmin ? (
            <AdminDashboard />
          ) : (
            <>
              {currentPage === 'home' && <CustomerHome onNavigate={setCurrentPage} />}
              {currentPage === 'menu' && <MenuPage onBack={() => setCurrentPage('home')} />}
              {currentPage === 'catering' && <CateringPage onBack={() => setCurrentPage('home')} />}
              {currentPage === 'orders' && <OrderHistory onBack={() => setCurrentPage('home')} />}
            </>
          )}
        </Authenticated>
      </main>

      <Authenticated>
        {!isAdmin && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-br from-amber-900 to-amber-950 border-t-2 border-amber-800 z-40 shadow-2xl">
            <div className="container mx-auto px-3 py-2">
              <div className="flex justify-around">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${currentPage === 'home'
                      ? 'text-white bg-gradient-to-r from-amber-700/30 to-yellow-700/30'
                      : 'text-amber-300 hover:text-white'
                    }`}
                >
                  <FaHome className="text-lg mb-1" />
                  <span className="text-xs font-medium">Home</span>
                </button>

                <button
                  onClick={() => setCurrentPage('menu')}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${currentPage === 'menu'
                      ? 'text-white bg-gradient-to-r from-amber-700/30 to-yellow-700/30'
                      : 'text-amber-300 hover:text-white'
                    }`}
                >
                  <FaUtensils className="text-lg mb-1" />
                  <span className="text-xs font-medium">Order</span>
                </button>

                <button
                  onClick={() => setCurrentPage('catering')}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${currentPage === 'catering'
                      ? 'text-white bg-gradient-to-r from-amber-700/30 to-yellow-700/30'
                      : 'text-amber-300 hover:text-white'
                    }`}
                >
                  <FaGlassCheers className="text-lg mb-1" />
                  <span className="text-xs font-medium">Catering</span>
                </button>

                <button
                  onClick={() => setCurrentPage('orders')}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${currentPage === 'orders'
                      ? 'text-white bg-gradient-to-r from-amber-700/30 to-yellow-700/30'
                      : 'text-amber-300 hover:text-white'
                    }`}
                >
                  <FaHistory className="text-lg mb-1" />
                  <span className="text-xs font-medium">Orders</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Authenticated>

      <div className="md:hidden h-16"></div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="max-w-md mx-auto" style={{ marginTop: '100px' }}>
      <div className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-2xl shadow-2xl border-4 border-amber-800 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 p-6 sm:p-8 text-center relative">
          <img loading="lazy" src="../src/assets/logorm2.webp" alt="Hameed Catering Logo" className="mx-auto mb-4 w-90 h-70 rounded-md" />

        </div>

        <div className="p-6 sm:p-8">
          <SignInForm />
        </div>

        <div className="h-2 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200"></div>
      </div>
    </div>
  );
}