import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaHamburger,
  FaBacon,
  FaHotdog,
  FaDrumstickBite,
  FaPlus,
  FaMinus,
  FaTrash,
  FaTimes,
  FaUser,
  FaPhone,
  FaCheck,
  FaChevronRight,
  FaUtensils,
  FaTag,
  FaInfoCircle,
  FaSpinner
} from "react-icons/fa";

interface MenuPageProps {
  onBack: () => void;
}

interface CartItem {
  id: string;
  name: string;
  type: "burger" | "liver" | "sausage" | "kofta";
  quantity: number;
  customizations: string[];
  price: number;
}

export function MenuPage({ onBack }: MenuPageProps) {
  const menuItems = useQuery(api.menu.getMenuItems);
  const createOrder = useMutation(api.orders.createOrder);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  if (!menuItems) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
          <div className="text-amber-200">Loading Menu...</div>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    if (!selectedItem) return;

    const customizationPrice = selectedCustomizations.reduce((total, customization) => {
      const custom = selectedItem.customizations.find((c: any) => c.name === customization);
      return total + (custom?.price || 0);
    }, 0);

    const totalPrice = (selectedItem.basePrice + customizationPrice) * quantity;

    const cartItem: CartItem = {
      id: `${selectedItem._id}-${Date.now()}`,
      name: selectedItem.name,
      type: selectedItem.type,
      quantity,
      customizations: [...selectedCustomizations],
      price: totalPrice,
    };

    setCart([...cart, cartItem]);
    setSelectedItem(null);
    setSelectedCustomizations([]);
    setQuantity(1);
    toast.success("Added to  cart!");
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please fill in your  contact details");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      await createOrder({
        customerName,
        customerPhone,
        orderType: "delivery",
        items: cart.map(item => ({
          name: item.name,
          type: item.type,
          quantity: item.quantity,
          customizations: item.customizations,
          price: item.price,
        })),
        totalAmount: getTotalAmount(),
      });

      toast.success("order placed successfully!");
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setShowCheckout(false);
      onBack();
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'burger': return <FaHamburger />;
      case 'liver': return <FaBacon />;
      case 'sausage': return <FaHotdog />;
      case 'kofta': return <FaDrumstickBite />;
      default: return <FaUtensils />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-amber-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
        </div>
        
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-4xl font-bold text-white mb-1">Menu</h1>
        </div>

        <button
          onClick={() => setShowCheckout(true)}
          className="relative bg-gradient-to-r from-amber-700 to-yellow-700 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl flex items-center space-x-3 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FaShoppingCart />
          <span>Cart ({cart.length})</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {cart.length > 0 && (
        <div className="sm:hidden mb-6 bg-gradient-to-r from-amber-900/50 to-yellow-900/30 rounded-xl p-4 border border-amber-800/50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-bold">{cart.length} item{cart.length > 1 ? 's' : ''} in cart</div>
              <div className="text-amber-300 text-sm">Total: ${getTotalAmount().toFixed(2)}</div>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="bg-gradient-to-r from-amber-700 to-yellow-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 overflow-hidden royal-card group">
            <div className="h-40 sm:h-48 bg-gradient-to-br from-amber-900 to-yellow-900 flex items-center justify-center relative overflow-hidden">
              {item.imageUrl ? (
                <img 
                loading="lazy"
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="text-5xl sm:text-6xl opacity-50 text-amber-400">
                  {getItemIcon(item.type)}
                </div>
              )}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-amber-700 to-yellow-700 text-white px-3 py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm">
                ${item.basePrice}
              </div>
              <div className={`absolute top-3 sm:top-4 left-3 sm:left-4 px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                item.available 
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white' 
                  : 'bg-gradient-to-r from-rose-700 to-rose-800 text-white'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">{item.name}</h3>
                <span className="text-amber-400 font-semibold text-xs sm:text-sm bg-amber-900/50 px-2 py-1 rounded-full">
                  {item.type}
                </span>
              </div>
              <p className="text-amber-300 mb-4 text-sm line-clamp-2 sm:line-clamp-3">{item.description}</p>
              
              <button
                onClick={() => setSelectedItem(item)}
                disabled={!item.available}
                className="w-full bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-3 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FaPlus />
                <span>Customize & Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-amber-950 to-amber-900 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-700 shadow-2xl">
            <div className="p-4 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedItem.name}</h3>
                  <p className="text-amber-300 text-sm sm:text-base">Customize your order</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-amber-300 hover:text-white text-2xl sm:text-3xl transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-white font-bold mb-3 flex items-center">
                  <FaTag className="mr-2" /> Quantity
                </label>
                <div className="flex items-center justify-between bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl p-4 border border-amber-800/50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-xl flex items-center justify-center font-bold text-white hover:from-amber-800 hover:to-yellow-800 transition-all"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">{quantity}</div>
                    <div className="text-amber-300 text-sm">Portion{cart.length > 1 ? 's' : ''}</div>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-xl flex items-center justify-center font-bold text-white hover:from-amber-800 hover:to-yellow-800 transition-all"
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {selectedItem.customizations && selectedItem.customizations.length > 0 && (
                <div className="mb-6">
                  <label className="block text-white font-bold mb-3 flex items-center">
                    <FaInfoCircle className="mr-2" /> Customizations
                  </label>
                  <div className="space-y-3">
                    {selectedItem.customizations.map((custom: any) => (
                      <label key={custom.name} className="flex items-center justify-between cursor-pointer bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl p-4 border border-amber-800/30 hover:border-amber-500 transition-all">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedCustomizations.includes(custom.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCustomizations([...selectedCustomizations, custom.name]);
                              } else {
                                setSelectedCustomizations(selectedCustomizations.filter(c => c !== custom.name));
                              }
                            }}
                            className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 focus:ring-2"
                          />
                          <span className="text-white">{custom.name}</span>
                        </div>
                        <span className={`font-semibold ${custom.price > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                          {custom.price > 0 ? `+$${custom.price}` : 'Free'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/30 rounded-xl p-5 border border-amber-800/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-sm">Total</div>
                      <div className="text-amber-300 text-xs">Including customizations</div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                      ${((selectedItem.basePrice + selectedCustomizations.reduce((total, customization) => {
                        const custom = selectedItem.customizations.find((c: any) => c.name === customization);
                        return total + (custom?.price || 0);
                      }, 0)) * quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={addToCart}
                className="w-full bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-4 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl flex items-center justify-center space-x-3 text-sm sm:text-base"
              >
                <FaCheck />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-amber-900 bg-amber-700 to-amber-600 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-700 shadow-2xl">
            <div className="p-4 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Checkout</h3>
                  <p className="text-amber-300 text-sm sm:text-base">Complete your order</p>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-amber-300 hover:text-white text-2xl sm:text-3xl transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-white mb-4 flex items-center">
                  <FaShoppingCart className="mr-2" /> Your Order
                </h4>
                {cart.length === 0 ? (
                  <div className="text-center py-8 bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl border border-amber-800/30">
                    <FaShoppingCart className="text-5xl text-amber-400 mx-auto mb-4 opacity-50" />
                    <p className="text-amber-300">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl p-4 border border-amber-800/30">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getItemIcon(item.type)}
                              <div className="font-bold text-white">{item.name}</div>
                            </div>
                            <div className="text-amber-300 text-sm mb-2">Qty: {item.quantity}</div>
                            {item.customizations.length > 0 && (
                              <div className="text-amber-400 text-xs">
                                {item.customizations.map((custom, idx) => (
                                  <div key={idx} className="inline-block bg-amber-900/50 px-2 py-1 rounded mr-2 mb-1">
                                    {custom}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-bold text-white">${item.price.toFixed(2)}</div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-rose-500 hover:text-rose-300 transition-colors"
                              aria-label="Remove item"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-white mb-4 flex items-center">
                  <FaUser className="mr-2" />  Contact Details
                </h4>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-amber-400" />
                    </div>
                    <input
                      type="text"
                      placeholder=" Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-amber-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/30 rounded-xl p-5 border border-amber-800/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-sm">Total Amount</div>
                      <div className="text-amber-300 text-xs">Including all charges</div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                      ${getTotalAmount().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-4 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-sm sm:text-base"
              >
                <FaCheck />
                <span>Place Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}