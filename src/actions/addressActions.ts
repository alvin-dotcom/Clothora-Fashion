// src/actions/addressActions.ts
'use server';

import { query } from '@/lib/db';
import type { Address } from '@/types';

export type ManagedAddress = Address & { id: string }; // Address with DB ID (UUID)

/**
 * Fetches saved shipping addresses for a user from the database.
 */
export async function getSavedAddresses(userId: string): Promise<ManagedAddress[]> {
  if (!userId) {
    console.error('User ID is required to fetch addresses.');
    return [];
  }
  try {
    const result = await query('SELECT id, user_id, full_name, street, city, state, zip_code, country FROM user_addresses WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows as ManagedAddress[];
  } catch (error) {
    console.error('Error fetching saved addresses:', error);
    return [];
  }
}

/**
 * Adds a new shipping address for a user to the database.
 */
export async function addShippingAddress(userId: string, addressData: Address): Promise<ManagedAddress | null> {
  if (!userId) {
    console.error('User ID is required to add an address.');
    return null;
  }
  const { fullName, street, city, state, zipCode, country } = addressData;
  try {
    const result = await query(
      'INSERT INTO user_addresses (user_id, full_name, street, city, state, zip_code, country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, fullName, street, city, state, zipCode, country]
    );
    return result.rows[0] as ManagedAddress;
  } catch (error) {
    console.error('Error adding shipping address:', error);
    return null;
  }
}

/**
 * Updates an existing shipping address in the database.
 */
export async function updateShippingAddress(addressId: string, addressData: Partial<Address>): Promise<ManagedAddress | null> {
   if (!addressId) {
    console.error('Address ID is required to update an address.');
    return null;
  }
  // Construct SET clause dynamically
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  Object.entries(addressData).forEach(([key, value]) => {
    // Map frontend Address keys to DB column names if they differ, though here they match
    const dbKey = key === 'zipCode' ? 'zip_code' : key; 
    if (value !== undefined && ['fullName', 'street', 'city', 'state', 'zipCode', 'country'].includes(key)) {
      fields.push(`${dbKey} = $${paramCount++}`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    console.warn('No fields to update for address ID:', addressId);
    // Optionally fetch and return current address or throw error
    const currentAddress = await query('SELECT * FROM user_addresses WHERE id = $1', [addressId]);
    return currentAddress.rows.length > 0 ? currentAddress.rows[0] : null;
  }
  
  values.push(addressId); // Add addressId for WHERE clause
  const queryString = `UPDATE user_addresses SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
  
  try {
    const result = await query(queryString, values);
    if (result.rows.length > 0) {
      return result.rows[0] as ManagedAddress;
    }
    console.error('Address not found or failed to update for ID:', addressId);
    return null;
  } catch (error) {
    console.error('Error updating shipping address:', error);
    return null;
  }
}

/**
 * Deletes a shipping address from the database.
 */
export async function deleteShippingAddress(addressId: string): Promise<{ success: boolean; message?: string }> {
  if (!addressId) {
    console.error('Address ID is required to delete an address.');
    return { success: false, message: 'Address ID is required.' };
  }
  try {
    const result = await query('DELETE FROM user_addresses WHERE id = $1 RETURNING id', [addressId]);
    if (result.rowCount && result.rowCount > 0) {
        return { success: true };
    } else {
        return { success: false, message: 'Address not found or already deleted.'};
    }
  } catch (error) {
    console.error('Error deleting shipping address:', error);
    return { success: false, message: 'Failed to delete address due to a server error.' };
  }
}
