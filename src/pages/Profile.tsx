import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import Navbar from '@/components/layout/Navbar';
import ProfileBasicInfo from '@/components/profile/ProfileBasicInfo';
import TravelPreferences from '@/components/profile/TravelPreferences';
import PastTripsSection from '@/components/profile/PastTripsSection';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, Settings, User as UserIcon, Heart, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

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

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <Card className="mb-8 border-border shadow-soft overflow-hidden animate-fade-up">
            <div className="h-24 bg-gradient-to-r from-primary via-primary/80 to-accent" />
            <CardContent className="relative pt-0 pb-6 px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-card shadow-lg">
                    <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Info */}
                <div className="flex-1 pt-2 sm:pb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile?.full_name || 'Welcome, Traveler!'}
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-6 pt-2 sm:pb-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{pastTrips?.length || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {pastTrips?.reduce((acc, trip) => acc + trip.duration, 0) || 0}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="basic" className="space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <TabsList className="grid w-full grid-cols-3 h-14 bg-card border border-border rounded-xl p-1">
              <TabsTrigger 
                value="basic" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Basic Info</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
                <span className="sm:hidden">Prefs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Trip History</span>
                <span className="sm:hidden">Trips</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="border-border shadow-soft">
                <CardContent className="p-6">
                  <ProfileBasicInfo profile={profile} onSave={updateProfile} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="border-border shadow-soft">
                <CardContent className="p-6">
                  <TravelPreferences profile={profile} onSave={updateProfile} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="border-border shadow-soft">
                <CardContent className="p-6">
                  <PastTripsSection trips={pastTrips} onDelete={deletePastTrip} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
