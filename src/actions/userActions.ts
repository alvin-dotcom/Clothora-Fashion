// src/actions/userActions.ts
'use server';

import { query } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import type { AppUser } from '@/types'; // Ensure AppUser type includes phone_number

/**
 * Retrieves user profile data from the database.
 * If the user doesn't exist, it creates a new entry using Clerk user data obtained server-side.
 */
export async function getOrSyncUserProfile(): Promise<AppUser | null> {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.id) {
    console.error('Clerk user or user ID is missing when fetched on server.');
    return null;
  }

  try {
    // Try to find the user
    let dbUserResult = await query('SELECT id, email, full_name, phone_number, created_at, updated_at FROM app_users WHERE id = $1', [clerkUser.id]);
    
    if (dbUserResult.rows.length > 0) {
      // If user exists, check if phone number needs update from Clerk
      const dbUser = dbUserResult.rows[0] as AppUser;
      const clerkPrimaryPhoneNumber = clerkUser.phoneNumbers.find(pn => pn.id === clerkUser.primaryPhoneNumberId)?.phoneNumber || null;
      if (clerkPrimaryPhoneNumber && dbUser.phone_number !== clerkPrimaryPhoneNumber) {
        const updatedUser = await updateUserProfile(clerkUser.id, { phone_number: clerkPrimaryPhoneNumber });
        return updatedUser || dbUser; // Return updated or original if update failed
      }
      return dbUser;
    } else {
      // User not found, create them
      const primaryEmail = clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId)?.emailAddress || null;
      const fullName = clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null;
      const primaryPhoneNumber = clerkUser.phoneNumbers.find(pn => pn.id === clerkUser.primaryPhoneNumberId)?.phoneNumber || null;

      const insertResult = await query(
        'INSERT INTO app_users (id, email, full_name, phone_number) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, phone_number, created_at, updated_at',
        [clerkUser.id, primaryEmail, fullName, primaryPhoneNumber]
      );
      if (insertResult.rows.length > 0) {
        console.log('New user created in DB:', insertResult.rows[0]);
        return insertResult.rows[0] as AppUser;
      } else {
        console.error('Failed to create user in DB after insert.');
        return null;
      }
    }
  } catch (error) {
    console.error('Error in getOrSyncUserProfile:', error);
    return null;
  }
}

/**
 * Updates user profile data in the database.
 */
export async function updateUserProfile(userId: string, data: Partial<Pick<AppUser, 'full_name' | 'email' | 'phone_number'>>): Promise<AppUser | null> {
  if (!userId) {
    console.error('User ID is required to update profile.');
    return null;
  }

  const fieldsToUpdate: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.full_name !== undefined) {
    fieldsToUpdate.push(`full_name = $${paramIndex++}`);
    values.push(data.full_name);
  }
  if (data.email !== undefined) { 
    fieldsToUpdate.push(`email = $${paramIndex++}`);
    values.push(data.email);
  }
  if (data.phone_number !== undefined) {
    fieldsToUpdate.push(`phone_number = $${paramIndex++}`);
    values.push(data.phone_number);
  }


  if (fieldsToUpdate.length === 0) {
    console.log('No fields to update for user:', userId);
    const currentUserData = await query('SELECT id, email, full_name, phone_number, created_at, updated_at FROM app_users WHERE id = $1', [userId]);
    return currentUserData.rows.length > 0 ? currentUserData.rows[0] as AppUser : null;
  }

  values.push(userId); // For the WHERE clause

  const queryString = `UPDATE app_users SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING id, email, full_name, phone_number, created_at, updated_at`;

  try {
    const result = await query(queryString, values);
    if (result.rows.length > 0) {
      return result.rows[0] as AppUser;
    } else {
      console.error('User not found or failed to update for ID:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}
