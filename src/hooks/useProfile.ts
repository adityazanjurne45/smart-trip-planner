import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, PastTrip } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pastTrips, setPastTrips] = useState<PastTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchPastTrips();
    }
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastTrips = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('past_trips')
        .select('*')
        .eq('user_id', userId)
        .order('trip_date', { ascending: false });

      if (error) throw error;
      setPastTrips((data || []) as PastTrip[]);
    } catch (error: any) {
      console.error('Error fetching past trips:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return { error: 'No user ID' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved successfully.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const addPastTrip = async (trip: Omit<PastTrip, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return { error: 'No user ID' };

    try {
      const { data, error } = await supabase
        .from('past_trips')
        .insert({ ...trip, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      
      setPastTrips(prev => [data as PastTrip, ...prev]);
      toast({
        title: 'Trip saved',
        description: 'Your trip has been added to your history.',
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save trip',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const deletePastTrip = async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('past_trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
      
      setPastTrips(prev => prev.filter(t => t.id !== tripId));
      toast({
        title: 'Trip deleted',
        description: 'The trip has been removed from your history.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete trip',
        variant: 'destructive',
      });
      return { error };
    }
  };

  return {
    profile,
    pastTrips,
    loading,
    updateProfile,
    addPastTrip,
    deletePastTrip,
    refetch: fetchProfile,
  };
}
