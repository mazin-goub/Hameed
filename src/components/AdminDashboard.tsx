import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  FaCrown,
  FaClipboardList,
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaFlagCheckered,
  FaDollarSign,
  FaTimesCircle,
  FaUser,
  FaInfoCircle,
  FaStickyNote,
  FaCheck,
  FaTimes,
  FaMotorcycle,
  FaUserFriends,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronRight,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaTag,
  FaImage,
} from "react-icons/fa";
import { GiCrownCoin, GiScrollQuill } from "react-icons/gi";
import { MdFastfood } from "react-icons/md";

export function AdminDashboard() {
  const orders = useQuery(api.orders.getAllOrders);
  const menuItems = useQuery(api.menu.getAllMenuItems);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const addMenuItem = useMutation(api.menu.addMenuItem);
  const updateMenuItem = useMutation(api.menu.updateMenuItem);
  const deleteMenuItem = useMutation(api.menu.deleteMenuItem);
  const generateUploadUrl = useMutation(api.menu.generateUploadUrl);

  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const [newItem, setNewItem] = useState({
    name: "",
    type: "burger" as "burger" | "liver" | "sausage" | "kofta" | "drinks" | "desserts",
    description: "",
    basePrice: 0,
    image: null as string | null,
    customizations: [{ name: "", price: 0 }],
  });

  if (!orders || !menuItems) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
          <div className="text-amber-200">Loading  Dashboard...</div>
        </div>
      </div>
    );
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);

  const handleStatusUpdate = async (orderId: string, status: 'accepted' | 'rejected' | 'completed') => {
    try {
      await updateOrderStatus({ orderId: orderId as any, status });
      toast.success(`Order ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} order`);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || newItem.basePrice <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const validCustomizations = newItem.customizations.filter(c => c.name.trim() !== "");

    try {
      let imageId = null;
      if (imageInput.current?.files?.[0]) {
        imageId = await handleImageUpload(imageInput.current.files[0]);
      }

      await addMenuItem({
        name: newItem.name,
        type: newItem.type,
        description: newItem.description,
        basePrice: newItem.basePrice,
        image: imageId,
        customizations: validCustomizations,
      });

      toast.success("Menu item added successfully!");
      setNewItem({
        name: "",
        type: "burger",
        description: "",
        basePrice: 0,
        image: null,
        customizations: [{ name: "", price: 0 }],
      });
      setShowAddItem(false);
      if (imageInput.current) imageInput.current.value = "";
    } catch (error) {
      toast.error("Failed to add menu item");
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      let imageId = editingItem.image;
      if (imageInput.current?.files?.[0]) {
        imageId = await handleImageUpload(imageInput.current.files[0]);
      }

      const validCustomizations = editingItem.customizations.filter((c: any) => c.name.trim() !== "");

      await updateMenuItem({
        itemId: editingItem._id,
        name: editingItem.name,
        type: editingItem.type,
        description: editingItem.description,
        basePrice: editingItem.basePrice,
        available: editingItem.available,
        image: imageId,
        customizations: validCustomizations,
      });

      toast.success("Menu item updated successfully!");
      setEditingItem(null);
      if (imageInput.current) imageInput.current.value = "";
    } catch (error) {
      toast.error("Failed to update menu item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await deleteMenuItem({ itemId: itemId as any });
      toast.success("Menu item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const addCustomization = (isEditing = false) => {
    if (isEditing && editingItem) {
      setEditingItem({
        ...editingItem,
        customizations: [...editingItem.customizations, { name: "", price: 0 }]
      });
    } else {
      setNewItem({
        ...newItem,
        customizations: [...newItem.customizations, { name: "", price: 0 }]
      });
    }
  };

  const removeCustomization = (index: number, isEditing = false) => {
    if (isEditing && editingItem) {
      setEditingItem({
        ...editingItem,
        customizations: editingItem.customizations.filter((_: any, i: number) => i !== index)
      });
    } else {
      setNewItem({
        ...newItem,
        customizations: newItem.customizations.filter((_, i) => i !== index)
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="inline mr-2" />;
      case 'accepted': return <FaCheckCircle className="inline mr-2" />;
      case 'rejected': return <FaTimesCircle className="inline mr-2" />;
      case 'completed': return <FaFlagCheckered className="inline mr-2" />;
      default: return <FaClipboardList className="inline mr-2" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="bg-gradient-to-r from-orange-950 via-amber-900 to-orange-950 text-white rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-amber-200">Hameed Catering Management System</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{orders.length}</div>
            <div className="text-amber-200">Total Orders</div>
          </div>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-3 ${activeTab === 'orders'
              ? 'bg-gradient-to-r from-amber-700 to-yellow-700 text-white shadow-2xl'
              : 'bg-amber-950 text-amber-300 border-2 border-amber-800 hover:border-amber-500 hover:bg-amber-900/50'
            }`}
        >
          <GiScrollQuill className="text-xl" />
          <span className="text-sm sm:text-base">Orders Management</span>
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-3 ${activeTab === 'menu'
              ? 'bg-gradient-to-r from-amber-700 to-yellow-700 text-white shadow-2xl'
              : 'bg-amber-950 text-amber-300 border-2 border-amber-800 hover:border-amber-500 hover:bg-amber-900/50'
            }`}
        >
          <FaUtensils className="text-xl" />
          <span className="text-sm sm:text-base">Menu Management</span>
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {[
              { status: 'pending', label: 'Awaiting', color: 'amber', icon: <FaClock /> },
              { status: 'accepted', label: 'Accepted', color: 'emerald', icon: <FaCheckCircle /> },
              { status: 'completed', label: 'Completed', color: 'sky', icon: <FaFlagCheckered /> },
              { status: 'revenue', label: 'Revenue', color: 'yellow', icon: <GiCrownCoin /> }
            ].map((stat) => (
              <div key={stat.status} className="bg-gradient-to-br from-amber-950 to-amber-900 rounded-xl p-4 sm:p-6 shadow-xl border-2 border-amber-800 royal-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-lg sm:text-2xl font-bold bg-gradient-to-r text-white bg-clip-text text-transparent`}>
                      {stat.status === 'revenue'
                        ? `$${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}`
                        : orders.filter(o => o.status === stat.status).length
                      }
                    </div>
                    <div className={`text-${stat.color}-300 text-xs sm:text-sm mt-1`}>{stat.label}</div>
                  </div>
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-${stat.color}-900/50 to-${stat.color}-800/50 rounded-full flex items-center justify-center border-2 border-${stat.color}-800/50`}>
                    <span className="text-base sm:text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6 sm:mb-8">
            <div className="text-white font-bold mb-3 flex items-center">
              <FaChevronRight className="mr-2 text-amber-400" />
              Filter Orders
            </div>

            <div className="relative">
              <div className="flex overflow-x-auto pb-4 space-x-3 px-2 sm:px-0 sm:space-x-4 sm:flex-wrap sm:overflow-visible hide-scrollbar">
                {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap flex-shrink-0 ${filter === status
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg'
                        : 'bg-amber-950 text-amber-300 border-2 border-amber-800 hover:border-amber-500'
                      }`}
                  >
                    <span className="text-base">{getStatusIcon(status)}</span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span className="text-amber-200 text-xs mt-1">
                        {status === 'all' ? orders.length : orders.filter(o => o.status === status).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center text-amber-400 text-xs mt-2 sm:hidden">
                ← Scroll for more →
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-amber-950/50 to-amber-900/30 rounded-2xl border-2 border-amber-800">
                <GiScrollQuill className="text-5xl sm:text-6xl mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-amber-200 mb-2">No  Orders Found</h3>
                <p className="text-amber-300 text-sm sm:text-base">The kingdom awaits its next  command</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="bg-gradient-to-br from-amber-950 to-amber-900/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-800 overflow-hidden royal-card">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-700 to-yellow-700 rounded-full flex items-center justify-center flex-shrink-0">
                          {order.orderType === 'delivery' ? (
                            <FaMotorcycle className="text-base sm:text-xl" />
                          ) : (
                            <FaUserFriends className="text-base sm:text-xl" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                            {order.orderType === 'delivery' ? ' Delivery' : ' Catering'}
                          </h3>
                          <div className="text-amber-300 text-xs sm:text-sm">
                            {new Date(order._creationTime).toLocaleDateString()} • {new Date(order._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end">
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                            ${order.totalAmount.toFixed(2)}
                          </div>
                          <div className="text-amber-300 text-xs sm:text-sm"> Total</div>
                        </div>
                        <div className="inline-block mt-1 sm:mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)} flex items-center`}>
                            {getStatusIcon(order.status)}
                            <span className="hidden sm:inline">{order.status.toUpperCase()}</span>
                            <span className="sm:hidden">{order.status.charAt(0).toUpperCase()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl p-4 border border-amber-700/50">
                        <h4 className="font-bold text-white mb-3 flex items-center text-sm sm:text-base">
                          <FaUser className="mr-2 text-amber-400" />
                          Customer
                        </h4>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row">
                            <div className="text-amber-300 text-xs sm:text-sm w-16 sm:w-24">Name:</div>
                            <div className="text-white text-sm sm:text-base truncate">{order.customerName}</div>
                          </div>
                          <div className="flex flex-col sm:flex-row">
                            <div className="text-amber-300 text-xs sm:text-sm w-16 sm:w-24">Email:</div>
                            <div className="text-white text-sm sm:text-base truncate">{order.customerEmail}</div>
                          </div>
                          <div className="flex flex-col sm:flex-row">
                            <div className="text-amber-300 text-xs sm:text-sm w-16 sm:w-24">
                              <FaPhone className="inline mr-1" /> Phone:
                            </div>
                            <div className="text-white text-sm sm:text-base">{order.customerPhone}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-900/30 to-amber-800/30 rounded-xl p-4 border border-amber-700/50">
                        <h4 className="font-bold text-white mb-3 flex items-center text-sm sm:text-base">
                          <FaInfoCircle className="mr-2 text-amber-400" />
                          Details
                        </h4>
                        {order.orderType === 'delivery' && order.items && (
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-white text-sm truncate">{item.name} ×{item.quantity}</span>
                                <span className="text-amber-300 text-sm">${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {order.orderType === 'catering' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FaCalendar className="text-amber-300 mr-2 text-sm" />
                                <div className="text-white text-sm">{order.eventDate}</div>
                              </div>
                              <div className="flex items-center">
                                <FaMapMarkerAlt className="text-amber-300 mr-2 text-sm" />
                                <div className="text-white text-sm truncate">{order.eventLocation}</div>
                              </div>
                              <div className="flex items-center">
                                <FaUsers className="text-amber-300 mr-2 text-sm" />
                                <div className="text-white text-sm">{order.guestCount} guests</div>
                              </div>
                            </div>

                            {order.cateringItems && order.cateringItems.length > 0 && (
                              <div className="bg-gradient-to-br from-amber-800/20 to-yellow-800/20 rounded-lg p-3 border border-amber-700/50">
                                <h4 className="font-bold text-white mb-2 flex items-center text-sm">
                                  <FaUtensils className="mr-2 text-amber-400 text-xs" />
                                  Catering Menu Items
                                </h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                  {order.cateringItems.map((cateringItem: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center bg-amber-900/30 rounded-lg p-2">
                                      <div className="flex items-center">
                                        <span className="text-white text-xs font-medium truncate max-w-[120px]">
                                          {cateringItem.item}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <span className="text-amber-300 text-xs">
                                          {cateringItem.quantity} serving{cateringItem.quantity !== 1 ? 's' : ''}
                                        </span>
                                        {cateringItem.perServing && (
                                          <span className="text-white text-xs bg-amber-800/70 px-2 py-1 rounded-full">
                                            ${cateringItem.perServing}/serving
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {order.cateringItems.length > 0 && (
                                  <div className="mt-3 pt-2 border-t border-amber-700/30">
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-amber-300">Total servings:</span>
                                      <span className="text-white font-bold">
                                        {order.cateringItems.reduce((total: number, item: any) => total + (item.quantity || 0), 0)} servings
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-4 mb-4 sm:mb-6 border border-gray-700/50">
                        <h4 className="font-bold text-white mb-2 flex items-center text-sm sm:text-base">
                          <FaStickyNote className="mr-2 text-amber-400" />
                          Notes
                        </h4>
                        <p className="text-amber-200 text-sm sm:text-base">{order.notes}</p>
                      </div>
                    )}

                    {order.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'accepted')}
                          className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-3 sm:py-4 px-6 rounded-xl font-bold hover:from-emerald-800 hover:to-emerald-900 transition-all shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                          <FaCheck />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'rejected')}
                          className="flex-1 bg-gradient-to-r from-rose-700 to-rose-800 text-white py-3 sm:py-4 px-6 rounded-xl font-bold hover:from-rose-800 hover:to-rose-900 transition-all shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                          <FaTimes />
                          <span>Reject Order</span>
                        </button>
                      </div>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'completed')}
                        className="w-full bg-gradient-to-r from-sky-700 to-sky-800 text-white py-3 sm:py-4 px-6 rounded-xl font-bold hover:from-sky-800 hover:to-sky-900 transition-all shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <FaFlagCheckered />
                        <span>Mark as Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Menu Collection</h2>
              <p className="text-amber-300 text-sm sm:text-base">Curate your kingdom's finest delicacies</p>
            </div>
            <button
              onClick={() => setShowAddItem(true)}
              className="bg-gradient-to-r from-amber-700 to-yellow-700 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl flex items-center justify-center space-x-3 text-sm sm:text-base"
            >
              <FaPlus />
              <span>Add Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <div className="text-4xl sm:text-6xl opacity-50">
                      <MdFastfood />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-amber-700 to-yellow-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm">
                    ${item.basePrice}
                  </div>
                  <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 rounded-full font-bold text-xs sm:text-sm ${item.available
                      ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white'
                      : 'bg-gradient-to-r from-rose-700 to-rose-800 text-white'
                    }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white truncate mb-1 sm:mb-0">{item.name}</h3>
                    <span className="text-amber-400 font-semibold text-xs sm:text-sm bg-amber-900/50 px-2 py-1 rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-amber-300 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed line-clamp-2">{item.description}</p>

                  <div className="flex space-x-2 sm:space-x-3">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-2 sm:py-3 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all text-xs sm:text-sm flex items-center justify-center space-x-1 sm:space-x-2"
                    >
                      <FaEdit className="text-xs sm:text-sm" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="flex-1 bg-gradient-to-r from-rose-700 to-rose-800 text-white py-2 sm:py-3 rounded-xl font-bold hover:from-rose-800 hover:to-rose-900 transition-all text-xs sm:text-sm flex items-center justify-center space-x-1 sm:space-x-2"
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAddItem && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
              <div className="bg-gradient-to-br from-amber-950 to-amber-900 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-700 shadow-2xl">
                <div className="p-4 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Add  Menu Item</h3>
                      <p className="text-amber-300 text-sm sm:text-base">Create a new masterpiece</p>
                    </div>
                    <button
                      onClick={() => setShowAddItem(false)}
                      className="text-amber-300 hover:text-white text-2xl sm:text-3xl transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3 flex items-center">
                        <FaCrown className="mr-2" /> Item Name *
                      </label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                        placeholder="Enter item name"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3 flex items-center">
                        <FaTag className="mr-2" /> Type *
                      </label>
                      <select
                        value={newItem.type}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                      >
                        <option value="burger" className="bg-amber-950">Burger</option>
                        <option value="liver" className="bg-amber-950">Liver</option>
                        <option value="sausage" className="bg-amber-950">Sausage</option>
                        <option value="kofta" className="bg-amber-950">Kofta</option>
                        <option value="drinks" className="bg-amber-950">Drinks</option>
                        <option value="desserts" className="bg-amber-950">Desserts</option>
                        <option value="Lasagna" className="bg-amber-950">Lasagna</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3 flex items-center">
                        <GiScrollQuill className="mr-2" /> Description *
                      </label>
                      <textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 h-24 sm:h-32 resize-none text-sm sm:text-base"
                        placeholder="Describe this  delight..."
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3 flex items-center">
                        <GiCrownCoin className="mr-2" /> Price *
                      </label>
                      <input
                        type="number"
                        value={newItem.basePrice}
                        onChange={(e) => setNewItem({ ...newItem, basePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3 flex items-center">
                        <FaImage className="mr-2" /> Image *
                      </label>
                      <input
                        type="file"
                        ref={imageInput}
                        accept="image/*"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3 flex items-center">
                        <FaPlus className="mr-2" /> Customizations
                      </label>
                      {newItem.customizations.map((custom, index) => (
                        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                          <input
                            type="text"
                            value={custom.name}
                            onChange={(e) => {
                              const updated = [...newItem.customizations];
                              updated[index].name = e.target.value;
                              setNewItem({ ...newItem, customizations: updated });
                            }}
                            className="flex-1 px-3 py-2 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                            placeholder="Customization name"
                          />
                          <div className="flex space-x-3">
                            <input
                              type="number"
                              value={custom.price}
                              onChange={(e) => {
                                const updated = [...newItem.customizations];
                                updated[index].price = parseFloat(e.target.value) || 0;
                                setNewItem({ ...newItem, customizations: updated });
                              }}
                              className="w-full sm:w-28 px-3 py-2 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                              placeholder="Price"
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={() => removeCustomization(index)}
                              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-rose-700 to-rose-800 text-white rounded-xl hover:from-rose-800 hover:to-rose-900 transition-all text-sm"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addCustomization()}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-2 text-sm sm:text-base"
                      >
                        <FaPlus />
                        <span>Add Customization</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-amber-800/50">
                    <button
                      onClick={() => setShowAddItem(false)}
                      className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-gray-900 hover:to-black transition-all text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddItem}
                      className="flex-1 bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl text-sm sm:text-base"
                    >
                      Add to Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {editingItem && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
              <div className="bg-gradient-to-br from-amber-950 to-amber-900 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-700 shadow-2xl">
                <div className="p-4 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Edit  Item</h3>
                      <p className="text-amber-300 text-sm sm:text-base">Refine this masterpiece</p>
                    </div>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="text-amber-300 hover:text-white text-2xl sm:text-3xl transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3">Item Name *</label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3">Type *</label>
                      <select
                        value={editingItem.type}
                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                      >
                        <option value="burger" className="bg-amber-950">Burger</option>
                        <option value="liver" className="bg-amber-950">Liver</option>
                        <option value="sausage" className="bg-amber-950">Sausage</option>
                        <option value="kofta" className="bg-amber-950">Kofta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3">Description *</label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 h-24 sm:h-32 resize-none text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3">Price *</label>
                      <input
                        type="number"
                        value={editingItem.basePrice}
                        onChange={(e) => setEditingItem({ ...editingItem, basePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3">Availability</label>
                      <select
                        value={editingItem.available ? 'true' : 'false'}
                        onChange={(e) => setEditingItem({ ...editingItem, available: e.target.value === 'true' })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base"
                      >
                        <option value="true" className="bg-amber-950">Available</option>
                        <option value="false" className="bg-amber-950">Unavailable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3">Image</label>
                      <input
                        type="file"
                        ref={imageInput}
                        accept="image/*"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-950 border-2 border-amber-800 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm sm:text-base mb-3"
                      />
                      {editingItem.imageUrl && (
                        <div className="mt-2">
                          <div className="text-amber-300 mb-2 text-sm">Current Image:</div>
                          <img
                            loading="lazy"
                            src={editingItem.imageUrl}
                            alt="Current"
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl border-2 border-amber-700"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-2 sm:mb-3">Customizations</label>
                      {editingItem.customizations.map((custom: any, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                          <input
                            type="text"
                            value={custom.name}
                            onChange={(e) => {
                              const updated = [...editingItem.customizations];
                              updated[index].name = e.target.value;
                              setEditingItem({ ...editingItem, customizations: updated });
                            }}
                            className="flex-1 px-3 py-2 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                            placeholder="Customization name"
                          />
                          <div className="flex space-x-3">
                            <input
                              type="number"
                              value={custom.price}
                              onChange={(e) => {
                                const updated = [...editingItem.customizations];
                                updated[index].price = parseFloat(e.target.value) || 0;
                                setEditingItem({ ...editingItem, customizations: updated });
                              }}
                              className="w-full sm:w-28 px-3 py-2 bg-amber-950 border-2 border-amber-800 rounded-xl text-white placeholder-amber-400 focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                              placeholder="Price"
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={() => removeCustomization(index, true)}
                              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-rose-700 to-rose-800 text-white rounded-xl hover:from-rose-800 hover:to-rose-900 transition-all text-sm"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addCustomization(true)}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-2 text-sm sm:text-base"
                      >
                        <FaPlus />
                        <span>Add Customization</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-amber-800/50">
                    <button
                      onClick={() => setEditingItem(null)}
                      className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-gray-900 hover:to-black transition-all text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateItem}
                      className="flex-1 bg-gradient-to-r from-amber-700 to-yellow-700 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-amber-800 hover:to-yellow-800 transition-all shadow-xl text-sm sm:text-base"
                    >
                      Update Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}