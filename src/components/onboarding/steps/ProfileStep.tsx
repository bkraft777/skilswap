
import React from 'react';
import { UserRound } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProfileStepProps {
  profileData: {
    avatar?: File;
    bio?: string;
  };
  onUpdate: (data: { avatar?: File; bio?: string }) => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({ profileData, onUpdate }) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ avatar: file });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center">
          <div className="relative group">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary">
                {profileData.avatar ? (
                  <img
                    src={URL.createObjectURL(profileData.avatar)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserRound className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Click to upload a profile picture
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            value={profileData.bio || ''}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
