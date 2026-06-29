import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Save, Loader2, Upload, Trash2, Camera } from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { toast } from 'sonner';

interface ProfileBasicInfoProps {
  profile: UserProfile | null;
  onSave: (data: Partial<UserProfile>) => Promise<{ error: any }>;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Compress to max 512px, JPEG ~0.85
const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 512;
        let { width, height } = img;
        if (width > height && width > maxDim) { height = (height * maxDim) / width; width = maxDim; }
        else if (height > maxDim) { width = (width * maxDim) / height; height = maxDim; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ProfileBasicInfo = ({ profile, onSave }: ProfileBasicInfoProps) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [homeCity, setHomeCity] = useState(profile?.home_city || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) { toast.error('❌ Unsupported format. Use JPG, PNG or WEBP.'); return; }
    if (file.size > MAX_BYTES) { toast.error('❌ File too large. Max 5MB.'); return; }
    setUploading(true);
    try {
      const dataUrl = await compressImage(file);
      setAvatarUrl(dataUrl);
      toast.success('📷 Photo ready — click Save Changes.');
    } catch {
      toast.error('Could not process the image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await onSave({
      full_name: fullName, email, phone, home_city: homeCity, avatar_url: avatarUrl,
    });
    setSaving(false);
    if (!error) toast.success('✅ Profile updated successfully.');
    else toast.error('Could not save profile.');
  };

  const removeAvatar = () => { setAvatarUrl(''); toast('🗑 Profile picture removed.'); };

  const getInitials = () =>
    fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="travel-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Basic Information
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
            onClick={() => fileRef.current?.click()}
            className={`relative group cursor-pointer rounded-full p-1 transition-all duration-300 ${
              dragging ? 'ring-4 ring-primary scale-105' : 'hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-travel-coral to-travel-gold opacity-70 group-hover:opacity-100 blur-sm transition" />
            <Avatar className="w-28 h-28 relative ring-2 ring-background">
              <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div className="flex gap-2">
            <Button size="sm" variant="outline" type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {avatarUrl ? 'Change' : 'Upload'}
            </Button>
            {avatarUrl && (
              <Button size="sm" variant="ghost" type="button" onClick={removeAvatar} className="text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground text-center max-w-[180px]">
            Drag & drop or click. JPG, PNG, WEBP · max 5MB
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input id="fullName" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </Label>
            <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input id="phone" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeCity" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Home City
            </Label>
            <Input id="homeCity" placeholder="e.g., New York, USA" value={homeCity} onChange={(e) => setHomeCity(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="travel" onClick={handleSave} disabled={saving || uploading}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileBasicInfo;
