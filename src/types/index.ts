
export interface ClothingFilters {
  size: string;
  material: string; 
}

export interface Design extends ClothingFilters {
  id: string; // Can be the imageURL for transient designs, or a generated ID for saved ones
  prompt: string; // This is the full prompt including filters
  imageUrl: string; // data URI or URL
  basePrompt?: string; // The user's original prompt text
  _sourceInformation?: 'fromDesignFlow' | 'fromWishlist'; // Used during checkout
}

export interface WishlistItem extends Design {}

export interface Address {
  // id?: string; // Optional: client-side ID or DB ID (UUID string)
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string; // Kept as zipCode for frontend consistency, mapped to zip_code for DB
  country: string;
}

// For DB interactions, addresses will have a mandatory string ID (UUID)
export type DatabaseAddress = Address & { 
  id: string; 
  user_id: string;
  // DB might use snake_case, ensure mapping if necessary, though actions handle it
  // e.g. zip_code: string; 
};


export interface PaymentDetails {
  method: string; // e.g., 'Credit Card', 'PayPal'
  cardNumber?: string; // last 4 digits
  expiryDate?: string;
}

export interface OrderItem {
  id: string; // This will be the DB order ID (UUID) when fetched
  user_id?: string; // Present if fetched from DB
  design: Design; 
  address: Address; 
  payment: PaymentDetails;
  orderDate: string; // ISO string
  totalAmount: number;
  status?: string; // Added order status
  // DB fields that map to the above structure, fetched from DB
  design_prompt?: string;
  design_base_prompt?: string;
  design_image_url?: string;
  design_size?: string;
  design_material?: string;
  shipping_address_full_name?: string;
  shipping_address_street?: string;
  shipping_address_city?: string;
  shipping_address_state?: string;
  shipping_address_zip_code?: string;
  shipping_address_country?: string;
  payment_method?: string;
  payment_card_last4?: string;
}


// For managing the multi-step design process
export interface DesignProgressState {
  basePrompt: string; // User's initial textual prompt
  filters: ClothingFilters;
  selectedImageUrl: string | null; // Stores the URL of the user-selected image, this IS persisted.
  currentStep: number; // e.g., 1 for prompt, 2 for filters, 3 for generate
  generatedImageUrls?: string[] | null; 
}

// Add phone_number to AppUser, matching DB schema
export interface AppUser {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number?: string | null; // Added phone_number
  created_at?: Date;
  updated_at?: Date;
}

