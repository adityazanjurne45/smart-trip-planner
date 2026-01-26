import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import Navbar from '@/components/layout/Navbar';
import ProfileBasicInfo from '@/components/profile/ProfileBasicInfo';
import TravelPreferences from '@/components/profile/TravelPreferences';
import PastTripsSection from '@/components/profile/PastTripsSection';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { profile, pastTrips, loading: profileLoading, updateProfile, deletePastTrip } = useProfile(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information and travel preferences for personalized AI recommendations
            </p>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="basic" className="text-sm">Basic Info</TabsTrigger>
              <TabsTrigger value="preferences" className="text-sm">Travel Preferences</TabsTrigger>
              <TabsTrigger value="history" className="text-sm">Trip History</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="animate-fade-up">
              <ProfileBasicInfo profile={profile} onSave={updateProfile} />
            </TabsContent>

            <TabsContent value="preferences" className="animate-fade-up">
              <TravelPreferences profile={profile} onSave={updateProfile} />
            </TabsContent>

            <TabsContent value="history" className="animate-fade-up">
              <PastTripsSection trips={pastTrips} onDelete={deletePastTrip} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
