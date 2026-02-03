import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  FaArrowLeft,
  FaHistory,
  FaRocket,
  FaCrown,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFlagCheckered,
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaStickyNote,
  FaSpinner,
  FaReceipt,
  FaHamburger,
  FaBacon,
  FaHotdog,
  FaDrumstickBite,
  FaUtensils,
  FaGlassMartini,
  FaCookie
} from "react-icons/fa";

interface OrderHistoryProps {
  onBack: () => void;
}

export function OrderHistory({ onBack }: OrderHistoryProps) {
  const orders = useQuery(api.orders.getUserOrders);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="inline mr-2" />;
      case 'accepted': return <FaCheckCircle className="inline mr-2" />;
      case 'rejected': return <FaTimesCircle className="inline mr-2" />;
      case 'completed': return <FaFlagCheckered className="inline mr-2" />;
      default: return <FaClock className="inline mr-2" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'accepted': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'rejected': return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'completed': return 'bg-sky-100 text-sky-900 border-sky-300';
      default: return 'bg-gray-100 text-gray-900 border-gray-300';
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

  if (!orders) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
          <div className="text-amber-200">Loading History...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-amber-300 hover:text-white transition-colors text-sm sm:text-base mb-4"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">Order History</h1>
            <p className="text-amber-300 text-sm sm:text-base">Your culinary journey</p>
          </div>
          
          <div className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-amber-900/50 to-yellow-900/30 px-4 py-3 rounded-xl border border-amber-800/50">
            <FaHistory className="text-amber-400" />
            <div className="text-right">
              <div className="text-white font-bold text-sm">{orders.length}</div>
              <div className="text-amber-300 text-xs">Orders</div>
            </div>
          </div>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="sm:hidden mb-6">
          <div className="grid grid-cols-4 gap-2">
            {['pending', 'accepted', 'completed', 'total'].map((stat) => (
              <div key={stat} className="bg-gradient-to-br from-amber-900/50 to-yellow-900/30 rounded-lg p-3 text-center border border-amber-800/50">
                <div className="text-white font-bold text-sm">
                  {stat === 'total' 
                    ? orders.length 
                    : orders.filter(o => o.status === stat).length
                  }
                </div>
                <div className="text-amber-300 text-xs capitalize">{stat}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-amber-950/50 to-amber-900/30 rounded-2xl border-2 border-amber-800">
            <FaReceipt className="text-5xl sm:text-6xl mx-auto mb-4 text-amber-400 opacity-50" />
            <h3 className="text-xl sm:text-2xl font-bold text-amber-200 mb-2">No   Orders Yet</h3>
            <p className="text-amber-300 text-sm sm:text-base max-w-md mx-auto">
              Your culinary journey awaits! Explore our menu to place your first order.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 overflow-hidden royal-card">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-full flex items-center justify-center flex-shrink-0">
                      {order.orderType === 'delivery' ? (
                        <FaRocket className="text-white text-lg" />
                      ) : (
                        <FaCrown className="text-white text-lg" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                        {order.orderType === 'delivery' ? 'Delivery Order' : 'Catering Service'}
                      </h3>
                      <div className="text-amber-300 text-xs sm:text-sm">
                        {new Date(order._creationTime).toLocaleDateString()} • {new Date(order._creationTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-2">
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-amber-300 text-xs sm:text-sm">Total</div>
                    </div>
                    <div className="inline-block">
                      <span className={`px-3 py-2 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)} flex items-center`}>
                        {getStatusIcon(order.status)}
                        <span className="hidden sm:inline">{order.status.toUpperCase()}</span>
                        <span className="sm:hidden capitalize">{order.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  {order.orderType === 'delivery' && order.items && (
                    <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl p-4 border border-amber-800/50">
                      <h4 className="font-bold text-white mb-3 flex items-center text-sm sm:text-base">
                        <FaBox className="mr-2 text-amber-400" />
                        Items Ordered
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-amber-900/20 rounded-lg">
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                              {getItemIcon(item.type)}
                              <div>
                                <div className="font-medium text-white text-sm sm:text-base">{item.name}</div>
                                <div className="text-amber-300 text-xs sm:text-sm">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end">
                              <div className="font-bold text-white text-sm sm:text-base">${item.price.toFixed(2)}</div>
                              {item.customizations.length > 0 && (
                                <div className="text-amber-400 text-xs mt-1">
                                  {item.customizations.map((custom, idx) => (
                                    <div key={idx} className="inline-block bg-amber-900/50 px-2 py-1 rounded mr-1 mb-1">
                                      {custom}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {order.orderType === 'catering' && (
                    <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/30 rounded-xl p-4 border border-amber-800/50">
                      <h4 className="font-bold text-white mb-3 flex items-center text-sm sm:text-base">
                        <FaCalendarAlt className="mr-2 text-amber-400" />
                        Event Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-amber-300 mr-3 text-sm" />
                            <div>
                              <div className="text-amber-300 text-xs">Event Date</div>
                              <div className="text-white text-sm">{order.eventDate}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-amber-300 mr-3 text-sm" />
                            <div>
                              <div className="text-amber-300 text-xs">Location</div>
                              <div className="text-white text-sm truncate">{order.eventLocation}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <FaUsers className="text-amber-300 mr-3 text-sm" />
                            <div>
                              <div className="text-amber-300 text-xs">Guests</div>
                              <div className="text-white text-sm">{order.guestCount}</div>
                            </div>
                          </div>
                        </div>
                        
                        {order.cateringItems && order.cateringItems.length > 0 && (
                          <div className="sm:border-l sm:border-amber-800/50 sm:pl-4">
                            <div className="text-amber-300 text-sm mb-2">Catering Items:</div>
                            <div className="space-y-2">
                              {order.cateringItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="text-white">{item.item}</span>
                                  <span className="text-amber-300">{item.quantity} servings</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 rounded-xl p-4 border border-gray-800/50">
                    <h4 className="font-bold text-white mb-2 flex items-center text-sm sm:text-base">
                      <FaStickyNote className="mr-2 text-amber-400" />
                      Notes
                    </h4>
                    <p className="text-amber-200 text-sm sm:text-base">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {orders.length > 0 && (
        <div className="sm:hidden mt-6 bg-gradient-to-br from-amber-900/60 to-yellow-900/40 rounded-xl p-4 border border-amber-800/50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-bold text-sm">Total Spent</div>
              <div className="text-amber-300 text-xs">Across all orders</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
              ${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}