import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function ShoppingForm() {
  const { addShoppingItem } = useStore();
  const [newItem, setNewItem] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem || !price) return;

    addShoppingItem({
      id: Date.now().toString(),
      name: newItem,
      price: parseFloat(price),
      addedBy: 'Current User',
    });

    setNewItem('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="input flex-1"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="input w-28"
          step="0.01"
        />
        <button type="submit" className="button button-primary">
          <Plus size={24} />
        </button>
      </div>
    </form>
  );
}