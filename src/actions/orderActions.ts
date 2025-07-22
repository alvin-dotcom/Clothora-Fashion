// src/actions/orderActions.ts
'use server';

import { query } from '@/lib/db';
import type { OrderItem as ReduxOrderItem, Design, Address, PaymentDetails } from '@/types'; // Renaming to avoid conflict
import { currentUser } from '@clerk/nextjs/server';

// This type will be used when returning data to the client, matching Redux OrderItem structure
export type ClientOrderItem = ReduxOrderItem; 

// Interface for data to be saved to DB (more aligned with table columns)
interface DatabaseOrderPayload {
    userId: string;
    designPrompt: string;
    designBasePrompt?: string | null;
    designImageUrl: string;
    designSize: string;
    designMaterial: string;
    shippingAddressFullName: string;
    shippingAddressStreet: string;
    shippingAddressCity: string;
    shippingAddressState: string;
    shippingAddressZipCode: string;
    shippingAddressCountry: string;
    paymentMethod: string;
    paymentCardLast4?: string | null;
    orderDate: string; // ISO string
    totalAmount: number;
    status?: string; // Added status, will default in DB if not provided
}


/**
 * Saves a new order to the database.
 */
export async function saveOrderToDb(orderData: DatabaseOrderPayload): Promise<ClientOrderItem | null> {
  const {
    userId, designPrompt, designBasePrompt, designImageUrl, designSize, designMaterial,
    shippingAddressFullName, shippingAddressStreet, shippingAddressCity, shippingAddressState, shippingAddressZipCode, shippingAddressCountry,
    paymentMethod, paymentCardLast4, orderDate, totalAmount, status // status is optional here, DB handles default
  } = orderData;

  try {
    // Status will be handled by DB default if not provided here
    const result = await query(
      `INSERT INTO orders (
        user_id, design_prompt, design_base_prompt, design_image_url, design_size, design_material,
        shipping_address_full_name, shipping_address_street, shipping_address_city, shipping_address_state, shipping_address_zip_code, shipping_address_country,
        payment_method, payment_card_last4, order_date, total_amount, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, user_id, design_prompt, design_base_prompt, design_image_url, design_size, design_material, shipping_address_full_name, shipping_address_street, shipping_address_city, shipping_address_state, shipping_address_zip_code, shipping_address_country, payment_method, payment_card_last4, order_date, total_amount, status, created_at, updated_at`,
      [
        userId, designPrompt, designBasePrompt, designImageUrl, designSize, designMaterial,
        shippingAddressFullName, shippingAddressStreet, shippingAddressCity, shippingAddressState, shippingAddressZipCode, shippingAddressCountry,
        paymentMethod, paymentCardLast4, orderDate, totalAmount, status || 'Processing' // Provide default if not set
      ]
    );

    if (result.rows.length > 0) {
      const dbRow = result.rows[0];
      // Transform DB row to ClientOrderItem structure
      return {
        id: dbRow.id,
        user_id: dbRow.user_id,
        design: {
          id: dbRow.design_image_url, 
          prompt: dbRow.design_prompt,
          basePrompt: dbRow.design_base_prompt || undefined,
          imageUrl: dbRow.design_image_url,
          size: dbRow.design_size,
          material: dbRow.design_material,
        },
        address: {
          fullName: dbRow.shipping_address_full_name,
          street: dbRow.shipping_address_street,
          city: dbRow.shipping_address_city,
          state: dbRow.shipping_address_state,
          zipCode: dbRow.shipping_address_zip_code,
          country: dbRow.shipping_address_country,
        },
        payment: {
          method: dbRow.payment_method,
          cardNumber: dbRow.payment_card_last4 || undefined,
        },
        orderDate: new Date(dbRow.order_date).toISOString(),
        totalAmount: parseFloat(dbRow.total_amount),
        status: dbRow.status, // Include status
      };
    }
    return null;
  } catch (error) {
    console.error('Error saving order to DB:', error);
    return null;
  }
}

/**
 * Fetches all orders for the currently authenticated user from the database.
 */
export async function getUserOrdersFromDb(): Promise<ClientOrderItem[]> {
  const clerkUser = await currentUser();
  if (!clerkUser || !clerkUser.id) {
    console.error('User not authenticated. Cannot fetch orders.');
    return [];
  }
  const userId = clerkUser.id;

  try {
    const result = await query(
      `SELECT 
        id, user_id, design_prompt, design_base_prompt, design_image_url, design_size, design_material, 
        shipping_address_full_name, shipping_address_street, shipping_address_city, shipping_address_state, shipping_address_zip_code, shipping_address_country, 
        payment_method, payment_card_last4, order_date, total_amount, status 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY order_date DESC`,
      [userId]
    );

    return result.rows.map(dbRow => {
      // Transform DB row to ClientOrderItem structure
      return {
        id: dbRow.id,
        user_id: dbRow.user_id,
        design: {
          id: dbRow.design_image_url, 
          prompt: dbRow.design_prompt,
          basePrompt: dbRow.design_base_prompt || undefined,
          imageUrl: dbRow.design_image_url,
          size: dbRow.design_size,
          material: dbRow.design_material,
        },
        address: {
          fullName: dbRow.shipping_address_full_name,
          street: dbRow.shipping_address_street,
          city: dbRow.shipping_address_city,
          state: dbRow.shipping_address_state,
          zipCode: dbRow.shipping_address_zip_code,
          country: dbRow.shipping_address_country,
        },
        payment: {
          method: dbRow.payment_method,
          cardNumber: dbRow.payment_card_last4 || undefined,
        },
        orderDate: new Date(dbRow.order_date).toISOString(),
        totalAmount: parseFloat(dbRow.total_amount),
        status: dbRow.status, // Include status
      };
    });
  } catch (error) {
    console.error('Error fetching user orders from DB:', error);
    return [];
  }
}
