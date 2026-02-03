import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaStickyNote,
  FaHamburger,
  FaBacon,
  FaHotdog,
  FaDrumstickBite,
  FaUtensils,
  FaGlassMartini,
  FaCookie,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaSpinner,
  FaCrown,
  FaTruck,
  FaClipboardCheck,
  FaConciergeBell,
  FaUserTie,
  FaListAlt,
  FaShoppingCart,
  FaPlus,
  FaMinus
} from "react-icons/fa";

interface CateringPageProps {
  onBack: () => void;
}

export function CateringPage({ onBack }: CateringPageProps) {
  const createOrder = useMutation(api.orders.createOrder);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    eventDate: "",
    eventLocation: "",
    guestCount: "",
    notes: "",
  });

  const [cateringItems, setCateringItems] = useState([
    { item: " UFO Burgers", quantity: 0, icon: <FaHamburger />, perServing: 8 },
    { item: "Golden Liver Sandwiches", quantity: 0, icon: <FaBacon />, perServing: 8 },
    { item: "Classic Sausage UFOs", quantity: 0, icon: <FaHotdog />, perServing: 8 },
    { item: " Kofta Delights", quantity: 0, icon: <FaDrumstickBite />, perServing: 8 },
    { item: "Premium Appetizers", quantity: 0, icon: <FaUtensils />, perServing: 8 },
    { item: " Desserts", quantity: 0, icon: <FaCookie />, perServing: 8 },
    { item: "Beverages Package", quantity: 0, icon: <FaGlassMartini />, perServing: 8 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'menu'>('details');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemQuantityChange = (index: number, quantity: number) => {
    setCateringItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  const calculateEstimate = () => {
    const basePrice = 15; // Base price per person
    const guestCount = parseInt(formData.guestCount) || 0;
    const itemsTotal = cateringItems.reduce((total, item) => total + (item.quantity * item.perServing), 0);
    return (guestCount * basePrice) + itemsTotal;
  };

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.customerPhone || !formData.eventDate || !formData.eventLocation || !formData.guestCount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedItems = cateringItems.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
      toast.error("Please select at least one catering item");
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        orderType: "catering",
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        guestCount: parseInt(formData.guestCount),
        cateringItems: selectedItems.map(({ item, quantity }) => ({ item, quantity })),
        totalAmount: calculateEstimate(),
        notes: formData.notes,
      });

      toast.success(" catering request submitted successfully!");
      setFormData({
        customerName: "",
        customerPhone: "",
        eventDate: "",
        eventLocation: "",
        guestCount: "",
        notes: "",
      });
      setCateringItems(prev => prev.map(item => ({ ...item, quantity: 0 })));
      onBack();
    } catch (error) {
      toast.error("Failed to submit catering request");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedItemsCount = cateringItems.filter(item => item.quantity > 0).length;
  const totalServings = cateringItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-3 py-4">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-amber-300 hover:text-white transition-colors text-sm mb-4"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold text-white mb-2">Catering</h1>
          <p className="text-amber-300 text-sm">Premium Event Experience</p>
        </div>

        <div className="flex border-b border-amber-800/50 mb-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-all ${activeTab === 'details'
                ? 'text-white border-b-2 border-amber-500'
                : 'text-amber-400 hover:text-amber-300'
              }`}
          >
            <FaUser className="inline mr-2" />
            Event Details
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-all ${activeTab === 'menu'
                ? 'text-white border-b-2 border-amber-500'
                : 'text-amber-400 hover:text-amber-300'
              }`}
          >
            <FaUtensils className="inline mr-2" />
            Menu ({selectedItemsCount})
          </button>
        </div>
      </div>

      {selectedItemsCount > 0 && (
        <div className="bg-gradient-to-r from-amber-900/60 to-yellow-900/40 rounded-xl p-3 mb-4 border border-amber-800/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FaShoppingCart className="text-amber-300" />
              <div>
                <div className="text-white text-sm font-bold">{selectedItemsCount} items selected</div>
                <div className="text-amber-300 text-xs">{totalServings} total servings</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-sm font-bold">Estimate</div>
              <div className="text-amber-300 text-xs">${calculateEstimate().toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="sm:hidden">
        {activeTab === 'details' && (
          <div className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl shadow-xl border border-amber-800 p-4 mb-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-amber-400" />
              Event Details
            </h2>

            <div className="space-y-4">
              {[
                { icon: FaUser, field: 'customerName', placeholder: 'Your Name *', type: 'text' },
                { icon: FaPhone, field: 'customerPhone', placeholder: 'Phone Number *', type: 'tel' },
                { icon: FaCalendarAlt, field: 'eventDate', placeholder: 'Event Date *', type: 'date' },
                { icon: FaMapMarkerAlt, field: 'eventLocation', placeholder: 'Event Location *', type: 'text' },
                { icon: FaUsers, field: 'guestCount', placeholder: 'Number of Guests *', type: 'number' },
              ].map((input, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <input.icon className="text-amber-400 text-sm" />
                  </div>
                  <input
                    type={input.type}
                    value={formData[input.field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(input.field, e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-amber-950/70 border border-amber-800 rounded-lg text-white placeholder-amber-400/70 focus:border-amber-500 focus:outline-none text-sm"
                    placeholder={input.placeholder}
                    min={input.type === 'number' ? '1' : undefined}
                  />
                </div>
              ))}

              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FaStickyNote className="text-amber-400 text-sm" />
                </div>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-amber-950/70 border border-amber-800 rounded-lg text-white placeholder-amber-400/70 focus:border-amber-500 focus:outline-none h-32 resize-none text-sm"
                  placeholder="Special notes or requirements..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl shadow-xl border border-amber-800 p-4 mb-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <FaUtensils className="mr-2 text-amber-400" />
              Menu Selection
            </h2>

            <div className="space-y-3 mb-6">
              {cateringItems.map((item, index) => (
                <div key={index} className="bg-amber-900/30 rounded-lg p-3 border border-amber-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-amber-300">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.item}</div>
                        <div className="text-amber-300 text-xs">${item.perServing}/serving</div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-sm">
                      ${(item.quantity * item.perServing).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-amber-300 text-xs">
                      {item.quantity} serving{item.quantity !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleItemQuantityChange(index, item.quantity - 1)}
                        className="w-8 h-8 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-full flex items-center justify-center font-bold text-white hover:from-amber-800 hover:to-yellow-800 transition-all"
                        aria-label="Decrease"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleItemQuantityChange(index, item.quantity + 1)}
                        className="w-8 h-8 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-full flex items-center justify-center font-bold text-white hover:from-amber-800 hover:to-yellow-800 transition-all"
                        aria-label="Increase"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/30 rounded-lg p-4 border border-amber-800/50 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-amber-300 text-sm">Base ({formData.guestCount || 0} guests)</span>
                <span className="text-white font-bold text-sm">
                  ${((parseInt(formData.guestCount) || 0) * 15).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-amber-300 text-sm">Additional Items</span>
                <span className="text-white font-bold text-sm">
                  ${(cateringItems.reduce((total, item) => total + (item.quantity * item.perServing), 0)).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-amber-700/50 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    ${calculateEstimate().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('details')}
              className="w-full bg-gradient-to-r from-amber-800 to-yellow-800 text-white py-3 rounded-lg font-bold mb-3 flex items-center justify-center space-x-2 text-sm"
            >
              <FaArrowLeft />
              <span>Back to Event Details</span>
            </button>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-40 p-20">
          <button
            onClick={handleSubmit}
            disabled={submitting || selectedItemsCount === 0}
            className="w-full bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-4 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-sm"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Submit Request (${calculateEstimate().toFixed(2)})</span>
              </>
            )}
          </button>
          <p className="text-amber-300 text-xs text-center mt-2">
            * Minimum order: 20 guests
          </p>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <FaCalendarAlt className="mr-3 text-amber-400" />
              Event Details
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {[
                { icon: FaUser, field: 'customerName', placeholder: ' Contact Name *', type: 'text' },
                { icon: FaPhone, field: 'customerPhone', placeholder: ' Phone Number *', type: 'tel' },
                { icon: FaCalendarAlt, field: 'eventDate', placeholder: '', type: 'date' },
                { icon: FaMapMarkerAlt, field: 'eventLocation', placeholder: 'Event Location *', type: 'text' },
                { icon: FaUsers, field: 'guestCount', placeholder: 'Number of Guests *', type: 'number', min: '1' },
              ].map((input, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <input.icon className="text-amber-400" />
                  </div>
                  <input
                    type={input.type}
                    value={formData[input.field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(input.field, e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                    placeholder={input.placeholder}
                    min={input.min}
                  />
                </div>
              ))}

              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <FaStickyNote className="text-amber-400" />
                </div>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 h-32 resize-none text-sm sm:text-base"
                  placeholder="Any special requirements or dietary restrictions..."
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <FaUtensils className="mr-3 text-amber-400" />
              Menu Selection
            </h2>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {cateringItems.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl p-4 border border-amber-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      <div className="text-amber-400 text-lg sm:text-xl">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm sm:text-base truncate">{item.item}</div>
                        <div className="text-amber-300 text-xs sm:text-sm">${item.perServing} per serving</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => handleItemQuantityChange(index, item.quantity - 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-full flex items-center justify-center font-bold text-white hover:from-amber-800 hover:to-yellow-800 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <FaChevronLeft className="text-xs" />
                      </button>
                      <div className="text-center min-w-12">
                        <div className="text-xl sm:text-2xl font-bold text-white">{item.quantity}</div>
                        <div className="text-amber-300 text-xs">servings</div>
                      </div>
                      <button
                        onClick={() => handleItemQuantityChange(index, item.quantity + 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-full flex items-center justify-center font-bold text-white hover:from-amber-800 hover:to-yellow-800 transition-all"
                        aria-label="Increase quantity"
                      >
                        <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/30 p-5 sm:p-6 rounded-xl border border-amber-800/50 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <FaCrown className="mr-2" />Price Estimate
              </h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-amber-300">Base Service ({formData.guestCount || 0} guests)</span>
                  <span className="text-white font-bold">
                    ${((parseInt(formData.guestCount) || 0) * 15).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-300">Additional Items</span>
                  <span className="text-white font-bold">
                    ${(cateringItems.reduce((total, item) => total + (item.quantity * item.perServing), 0)).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-amber-700/50 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-white text-lg sm:text-xl">Total Estimate</span>
                    <span className="text-xl sm:text-2xl bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                      ${calculateEstimate().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-amber-400 mt-4">
                * Final pricing may vary based on specific requirements and menu customizations
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-4 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processing Request...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>Submit Catering Request</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-950/80 to-amber-900/60 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Our Catering Services Include
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <FaConciergeBell className="text-2xl sm:text-3xl" />,
                title: "Full Service Setup",
                description: "Complete table setup, serving equipment, and professional presentation"
              },
              {
                icon: <FaUserTie className="text-2xl sm:text-3xl" />,
                title: "Professional Staff",
                description: "Experienced catering staff to ensure smooth service throughout your event"
              },
              {
                icon: <FaListAlt className="text-2xl sm:text-3xl" />,
                title: "Custom Menus",
                description: "Tailored menu options to match your event theme and dietary requirements"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl sm:rounded-2xl p-6 border-2 border-amber-800/50 text-center royal-card">
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
      </div>

      <div className="h-24 sm:hidden"></div>
    </div>
  );
}