import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { 
  FaRocket, 
  FaCrown, 
  FaStar, 
  FaShippingFast, 
  FaUsers, 
  FaUtensils,
  FaChevronRight,
  FaAward,
  FaClock,
  FaCheckCircle,
  FaCalendarAlt
} from "react-icons/fa";
import { GiChefToque, GiPartyFlags } from "react-icons/gi";

interface CustomerHomeProps {
  onNavigate: (page: 'menu' | 'catering') => void;
}

export function CustomerHome({ onNavigate }: CustomerHomeProps) {
  const seedMenu = useMutation(api.menu.seedMenuItems);

  useEffect(() => {
    seedMenu();
  }, [seedMenu]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <img loading="lazy" src="../src/assets/logorm3.webp" alt="Hameed Catering Logo" className="mx-auto  w-90 h-60 rounded-md shadow-lg" />
       
        <p className="text-base sm:text-xl text-amber-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
Premium meals for gatherings, events, parties & birthdays 🍽️
Top-quality ingredients with unforgettable flavor that keeps you coming back 🔥
We serve your occasions with food that looks amazing.and tastes even better 😍
        </p>
        
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-16 sm:w-32 flex-1 max-w-32"></div>
          <div className="mx-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl">
            <FaUtensils className="text-base sm:text-lg text-amber-900" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-16 sm:w-32 flex-1 max-w-32"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        <div 
          onClick={() => onNavigate('menu')}
          className="group cursor-pointer royal-card"
        >
          <div className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 overflow-hidden hover:border-amber-500 transition-all duration-300 h-full">
            <div className="bg-gradient-to-br from-amber-800 via-yellow-700 to-amber-800 p-6 sm:p-8 text-center relative">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-repeat" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FaRocket className="text-2xl sm:text-3xl text-amber-900" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Order Now</h3>
                <p className="text-amber-200 text-sm sm:text-base">UFO-Style Delivery</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  { icon: <FaAward className="text-amber-400" />, text: "UFO Burger" },
                  { icon: <GiChefToque className="text-amber-400" />, text: "Golden Liver Sandwich" },
                  { icon: <FaStar className="text-amber-400" />, text: "Classic Sausage UFO" },
                  { icon: <FaCrown className="text-amber-400" />, text: "Kofta Delight" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                    {item.icon}
                    <span className="text-white text-sm sm:text-base">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-700 to-yellow-700 text-white rounded-xl font-bold group-hover:from-amber-800 group-hover:to-yellow-800 transition-all shadow-lg text-sm sm:text-base">
                  <span>Explore Hameed Menu</span>
                  <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('catering')}
          className="group cursor-pointer royal-card"
        >
          <div className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 overflow-hidden hover:border-amber-500 transition-all duration-300 h-full">
            <div className="bg-gradient-to-br from-yellow-800 via-amber-700 to-yellow-800 p-6 sm:p-8 text-center relative">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-repeat" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FaCrown className="text-2xl sm:text-3xl text-amber-900" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Catering Services</h3>
                <p className="text-amber-200 text-sm sm:text-base">Premium Event Experience</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  { icon: <GiPartyFlags className="text-amber-400" />, text: "Wedding Celebrations" },
                  { icon: <FaUsers className="text-amber-400" />, text: "Corporate Events" },
                  { icon: <FaCalendarAlt className="text-amber-400" />, text: "Private Parties" },
                  { icon: <FaCheckCircle className="text-amber-400" />, text: "Custom Menus" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                    {item.icon}
                    <span className="text-white text-sm sm:text-base">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-700 to-amber-700 text-white rounded-xl font-bold group-hover:from-yellow-800 group-hover:to-amber-800 transition-all shadow-lg text-sm sm:text-base">
                  <span>Plan Event</span>
                  <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
          Why Choose Hameed Catering?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <FaStar className="text-2xl sm:text-3xl" />,
              title: "Premium Quality",
              description: "Fresh ingredients and  recipes passed down through generations"
            },
            {
              icon: <FaShippingFast className="text-2xl sm:text-3xl" />,
              title: "Fast Delivery",
              description: "UFO-sealed freshness delivered to your doorstep in record time"
            },
            {
              icon: <FaUsers className="text-2xl sm:text-3xl" />,
              title: "Custom Service",
              description: "Tailored to your preferences with extensive customization options"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-amber-950/50 to-amber-900/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-amber-800/50 royal-card">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg">
                <div className="text-amber-900">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
              <p className="text-amber-300 text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 sm:hidden bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-xl p-6 border border-amber-800/50">
        <div className="flex items-center space-x-4">
          <FaClock className="text-amber-400 text-xl" />
          <div>
            <div className="text-white font-bold">Fast Service</div>
            <div className="text-amber-300 text-sm">Average delivery: 30-45 minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}