import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    orderType: 'Delivery',
    currentAddress: 'Av. Javier Prado Este 2050, San Borja',
  }),
  actions: {
    addItem(item) {
      const existing = this.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
        existing.customizations = item.customizations;
        existing.price = item.price;
      } else {
        this.items.push({ ...item });
      }
    },
    removeItem(id) {
      this.items = this.items.filter(i => i.id !== id);
    },
    updateItem(updated) {
      const index = this.items.findIndex(i => i.id === updated.id);
      if (index !== -1) this.items[index] = updated;
    },
    clearCart() {
      this.items = [];
    }
  },
  getters: {
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
});