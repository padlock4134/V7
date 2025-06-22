// Helper to get the current signed-in user's ID from Supabase
import { supabase } from './supabaseClient';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user.id;
}

// Create a Stripe customer for a given email
export async function createStripeCustomer(email: string) {
  try {
    const customer = await stripe.customers.create({ email });
    return customer.id;
  } catch (error) {
    console.error('Stripe customer creation failed:', error);
    return null;
  }
}
