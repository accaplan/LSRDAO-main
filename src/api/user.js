import { get } from 'svelte/store';
import { db } from './index';
import { user } from '@/stores/auth';
import { gettingPrivateUserProfile, updatingMailPreferences } from '@/stores/user';
import User from '@/models/User';

export const getPublicUserProfile = async (uid) => {
  const profile = await db.collection('users').doc(uid).get();
  if (!profile.exists) throw new Error('This person does not have an account.');
  return profile.data();
};

export const getPrivateUserProfile = async () => {
  gettingPrivateUserProfile.set(true);
  const profile = await db.collection('users-private').doc(get(user).id).get();
  const updatedUser = new User(get(user));
  updatedUser.setPrivateInformation(profile.data());
  user.set(updatedUser);
  gettingPrivateUserProfile.set(false);
  return profile.data();
};

export const updateMailPreferences = async (preferenceName, preference) => {
  updatingMailPreferences.set(true);
  await db
    .collection('users-private')
    .doc(get(user).id)
    .update({ [`emailPreferences.${preferenceName}`]: preference });
  updatingMailPreferences.set(false);
};
