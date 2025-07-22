
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DesignProgressState, ClothingFilters, Design } from '@/types';

// Default initial state matching the structure from useLocalStorage hook
const initialDesignProgress: DesignProgressState = {
  basePrompt: '',
  filters: {
    size: 'm',
    material: 'cotton',
  },
  generatedImageUrls: null, // Transient state, might not need Redux if not persisted across sessions heavily
  selectedImageUrl: null,
  currentStep: 1,
};

const designSlice = createSlice({
  name: 'design',
  initialState: initialDesignProgress,
  reducers: {
    setBasePrompt: (state, action: PayloadAction<string>) => {
      state.basePrompt = action.payload;
    },
    setFilters: (state, action: PayloadAction<ClothingFilters>) => {
      state.filters = action.payload;
    },
    setGeneratedImageUrls: (state, action: PayloadAction<string[] | null>) => {
        state.generatedImageUrls = action.payload;
        // Also clear selection when new images are generated
        state.selectedImageUrl = null;
    },
    setSelectedImageUrl: (state, action: PayloadAction<string | null>) => {
      state.selectedImageUrl = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setFullDesignProgress: (state, action: PayloadAction<DesignProgressState>) => {
      // Allows completely replacing the state, useful for initialization or reset
      return action.payload;
    },
    resetDesignProgress: () => {
      // Resets to the initial state
      return initialDesignProgress;
    },
  },
});

export const {
  setBasePrompt,
  setFilters,
  setGeneratedImageUrls,
  setSelectedImageUrl,
  setCurrentStep,
  setFullDesignProgress,
  resetDesignProgress,
} = designSlice.actions;

export default designSlice.reducer;

