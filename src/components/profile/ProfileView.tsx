
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MessageSquare, Clock, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AvailabilityStatusIndicator } from './AvailabilityStatusIndicator';
import { Database } from '@/integrations/supabase/types';
import { AvailabilityStatus } from '@/lib/constants';

type Profile = Database['public']['Tables']['profiles']['Row'];

const ProfileView = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Type assertion for user.id
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch profile",
          variant: "destructive",
        });
        return;
      }

      // Type assertion to ensure data is a Profile
      setProfile(data as Profile);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p>Profile not found</p>
      </div>
    );
  }

  // Ensure availability_status is a valid enum value
  const statusValue = (profile.availability_status as AvailabilityStatus) || 'messaging';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>
              <UserRound className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.username || 'Anonymous User'}</h1>
            <AvailabilityStatusIndicator status={statusValue} />
          </div>
          <Button onClick={() => navigate('/edit-profile')} variant="outline">
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile.bio && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string) => (
                  <Badge key={interest} variant="outline">{interest}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
            {profile.rating && (
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{profile.total_ratings || 0} ratings</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
