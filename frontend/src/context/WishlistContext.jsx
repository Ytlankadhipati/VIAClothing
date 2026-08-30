import React, { createContext, useContext, useState, useEffect } from "react";
import { wishlistService } from "../services/wishlistService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      wishlistService
        .getWishlist()
        .then((res) => {
          if (res.success && res.data.wishlist) {
            setWishlist(res.data.wishlist);
          }
        })
        .catch(() => {});
    } else {
      const local = localStorage.getItem("via_wishlist");
      if (local) {
        try {
          setWishlist(JSON.parse(local));
        } catch {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    const exists = wishlist.some((item) => (item._id || item.id) === productId);

    if (isAuthenticated) {
      try {
        const res = await wishlistService.toggleWishlist(productId);
        if (res.success) {
          setWishlist(res.data.wishlist);
          addToast(res.message, "success");
        }
      } catch (err) {
        addToast(err.message || "Failed to update wishlist", "error");
      }
    } else {
      let updated;
      if (exists) {
        updated = wishlist.filter((item) => (item._id || item.id) !== productId);
        addToast("Removed from wishlist", "info");
      } else {
        updated = [...wishlist, product];
        addToast("Added to wishlist", "success");
      }
      setWishlist(updated);
      localStorage.setItem("via_wishlist", JSON.stringify(updated));
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
