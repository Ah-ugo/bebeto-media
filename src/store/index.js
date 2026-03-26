import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Auth store (persisted) ────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      adminEmail: null,
      adminName: null,
      isAuthenticated: false,
      setAuth: (token, refreshToken, adminEmail, adminName) =>
        set({ token, refreshToken, adminEmail, adminName, isAuthenticated: true }),
      logout: () =>
        set({ token: null, refreshToken: null, adminEmail: null, adminName: null, isAuthenticated: false }),
    }),
    { name: 'bebeto-auth' }
  )
);

// ─── Booking flow store ────────────────────────────────────────────────────────
export const useBookingStore = create((set, get) => ({
  step: 0,
  selectedCategory: null,
  selectedPackage: null,
  selectedDate: null,
  selectedExtras: [],
  clientInfo: null,

  setStep:     (s)    => set({ step: s }),
  setCategory: (cat)  => set({ selectedCategory: cat, selectedPackage: null, step: 1 }),
  setPackage:  (pkg)  => set({ selectedPackage: pkg, step: 2 }),
  setDate:     (d)    => set({ selectedDate: d }),
  setClientInfo: (i)  => set({ clientInfo: i, step: 4 }),

  toggleExtra: (extra) => {
    const curr = get().selectedExtras;
    const exists = curr.find((e) => e.name === extra.name);
    set({ selectedExtras: exists
      ? curr.filter((e) => e.name !== extra.name)
      : [...curr, extra]
    });
  },

  getTotalPrice: () => {
    const { selectedPackage, selectedExtras } = get();
    if (!selectedPackage) return 0;
    return (selectedPackage.base_price || 0) +
      selectedExtras.reduce((s, e) => s + e.price, 0);
  },

  reset: () => set({
    step: 0, selectedCategory: null, selectedPackage: null,
    selectedDate: null, selectedExtras: [], clientInfo: null,
  }),
}));

// ─── UI store ─────────────────────────────────────────────────────────────────
export const useUIStore = create((set) => ({
  mobileOpen: false,
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
}));
