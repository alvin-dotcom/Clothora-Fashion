
'use server';

import { currentUser } from '@clerk/nextjs/server';
import { query } from '@/lib/db';
import type { AppUser, OrderItem as ClientOrderItem } from '@/types';

/**
 * Checks if the currently authenticated user is an admin.
 * Relies on ADMIN_USER_ID environment variable.
 */
export async function isAdminUser(): Promise<boolean> {
  const user = await currentUser();
  if (!user) {
    console.log('Admin check: No user authenticated.');
    return false;
  }
  if (!process.env.ADMIN_USER_ID) {
    console.warn('Admin check: ADMIN_USER_ID environment variable is not set.');
    return false;
  }
  const isAdmin = user.id === process.env.ADMIN_USER_ID;
  console.log(`Admin check: User ID ${user.id}, Is Admin: ${isAdmin}`);
  return isAdmin;
}

/**
 * Fetches all users from the app_users table.
 * Requires admin privileges.
 */
export async function getAllAppUsers(): Promise<AppUser[]> {
  if (!(await isAdminUser())) {
    console.warn('Attempt to fetch all users by non-admin.');
    // Consider throwing an error or returning a specific response
    // For now, returning empty array to prevent data leakage but signal auth failure.
    // throw new Error('Unauthorized: Admin access required.'); 
    return [];
  }
  try {
    const result = await query('SELECT id, email, full_name, phone_number, created_at, updated_at FROM app_users ORDER BY created_at DESC');
    return result.rows as AppUser[];
  } catch (error) {
    console.error('Error fetching all app users:', error);
    return [];
  }
}

/**
 * Fetches all orders from the orders table.
 * Requires admin privileges.
 */
export async function getAllOrdersAdmin(): Promise<ClientOrderItem[]> {
   if (!(await isAdminUser())) {
    console.warn('Attempt to fetch all orders by non-admin.');
    // throw new Error('Unauthorized: Admin access required.');
    return [];
  }
  try {
    const result = await query(
      `SELECT 
        id, user_id, design_prompt, design_base_prompt, design_image_url, design_size, design_material, 
        shipping_address_full_name, shipping_address_street, shipping_address_city, shipping_address_state, shipping_address_zip_code, shipping_address_country, 
        payment_method, payment_card_last4, order_date, total_amount, status 
       FROM orders 
       ORDER BY order_date DESC`
    );

    return result.rows.map(dbRow => ({
      id: dbRow.id,
      user_id: dbRow.user_id,
      design: {
        id: dbRow.design_image_url, // Using image_url as a stand-in for design ID
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
      status: dbRow.status,
    }));
  } catch (error) {
    console.error('Error fetching all orders for admin:', error);
    return [];
  }
}

/**
 * Updates the status of a specific order.
 * Requires admin privileges.
 */
export async function updateOrderStatusAdmin(orderId: string, newStatus: string): Promise<ClientOrderItem | null> {
  if (!(await isAdminUser())) {
    console.warn(`Attempt to update order ${orderId} status by non-admin.`);
    // throw new Error('Unauthorized: Admin access required.');
    return null;
  }
  if (!orderId || !newStatus) {
    console.error('Order ID and new status are required to update order status.');
    return null;
  }

  try {
    const result = await query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, user_id, design_prompt, design_base_prompt, design_image_url, design_size, design_material, shipping_address_full_name, shipping_address_street, shipping_address_city, shipping_address_state, shipping_address_zip_code, shipping_address_country, payment_method, payment_card_last4, order_date, total_amount, status`,
      [newStatus, orderId]
    );

    if (result.rows.length > 0) {
      const dbRow = result.rows[0];
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
        status: dbRow.status,
      };
    }
    console.error(`Order not found or failed to update status for ID: ${orderId}`);
    return null;
  } catch (error) {
    console.error(`Error updating order status for order ID ${orderId}:`, error);
    return null;
  }
}

