import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './reduxHooks';
import {
  addItem as addItemAction,
  removeItem as removeItemAction,
  selectWishlistItems,
  selectWishlistItemCount,
} from '../features/wishlist/wishlistSlice';
import type { ProductDetailData } from '../types/ProductsTypes';

interface UseWishlistReturn {
  items: ProductDetailData[];
  itemCount: number;
  addItem: (product: ProductDetailData) => void;
  removeItem: (id: string) => void;
  isOnWishlist: (id: string) => boolean;
}

export const useWishlist = (): UseWishlistReturn => {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectWishlistItems);
  const itemCount = useAppSelector(selectWishlistItemCount);

  const addItem = useCallback(
    (product: ProductDetailData) => {
      dispatch(addItemAction(product));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch(removeItemAction(id));
    },
    [dispatch]
  );

  const isOnWishlist = useCallback(
    (id: string) => {
      return items.some(item => item.id === id);
    },
    [items]
  );

  return { items, itemCount, addItem, removeItem, isOnWishlist };
};