import { create } from 'zustand';

interface AuthState {
  pseudo: string | null;
  avatar: string | null;
  isInitialized: boolean;

  // Actions
  init: () => void;
  setPseudo: (pseudo: string) => void;
  setAvatar: (avatar: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  pseudo: null,
  avatar: null,
  isInitialized: false,

  init: () => {
    const storedPseudo = localStorage.getItem('bba_pseudo');
    const storedAvatar = localStorage.getItem('bba_avatar');
    
    set({
      pseudo: storedPseudo || null,
      avatar: storedAvatar || null,
      isInitialized: true,
    });
  },

  setPseudo: (pseudo: string) => {
    localStorage.setItem('bba_pseudo', pseudo);
    set({ pseudo });
  },

  setAvatar: (avatar: string | null) => {
    if (avatar) {
      localStorage.setItem('bba_avatar', avatar);
    } else {
      localStorage.removeItem('bba_avatar');
    }
    set({ avatar });
  },

  logout: () => {
    localStorage.removeItem('bba_pseudo');
    localStorage.removeItem('bba_avatar');
    localStorage.removeItem('bba_progress');
    localStorage.removeItem('bba_badges');
    set({ pseudo: null, avatar: null });
  },
}));
