import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface ProfileBasicInfoProps {
  profile: UserProfile | null;
  onSave: (data: Partial<UserProfile>) => Promise<{ error: any }>;
}

const ProfileBasicInfo = ({ profile, onSave }: ProfileBasicInfoProps) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [homeCity, setHomeCity] = useState(profile?.home_city || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      full_name: fullName,
      email,
      phone,
      home_city: homeCity,
      avatar_url: avatarUrl,
    });
    setSaving(false);
  };

  const getInitials = () => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="travel-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Basic Information
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <Input
            placeholder="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="text-sm max-w-[200px]"
          />
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeCity" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Home City
            </Label>
            <Input
              id="homeCity"
              placeholder="e.g., New York, USA"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="travel" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileBasicInfo;
