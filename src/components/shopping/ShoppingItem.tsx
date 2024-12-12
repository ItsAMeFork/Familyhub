import React from 'react';
import { Trash2 } from 'lucide-react';
import { ShoppingItem as ShoppingItemType } from '../../types';
import { useStore } from '../../store/useStore';

interface ShoppingItemProps {
  item: ShoppingItemType;
}

export function ShoppingItem({ item }: ShoppingItemProps) {
  const { removeShoppingItem } = useStore();

  return (
    <div className="card flex items-center justify-between">
      <div>
        <h3 className="font-medium text-lg">{item.name}</h3>
        <p className="text-emerald-500 font-semibold">${item.price.toFixed(2)}</p>
      </div>
      <button
        onClick={() => removeShoppingItem(item.id)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}