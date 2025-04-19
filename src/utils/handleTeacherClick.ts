
import { supabase } from "@/integrations/supabase/client";
import { TeacherHandleClickProps } from "@/types/teacher-stats";

export const handleTeacherClick = async ({
  teacher,
  userId,
  onSuccess,
  onError
}: TeacherHandleClickProps) => {
  if (!userId) {
    onError("You need to be signed in to connect with a teacher");
    return;
  }

  if (!teacher.id) {
    onError("Unable to connect with this teacher. Please try another teacher.");
    return;
  }

  try {
    console.log('Starting connection process with teacher:', teacher.name, 'ID:', teacher.id);

    // Create a help request
    const { data: requestData, error: requestError } = await supabase
      .from('skill_help_requests')
      .insert({
        learner_id: userId,
        skill_category: teacher.skills[0] || 'General',
        specific_need: 'Live help session',
        status: 'pending'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating help request:', requestError);
      throw requestError;
    }

    console.log('Help request created:', requestData);

    // Create a teacher connection
    const { data: connectionData, error: connectionError } = await supabase
      .from('teacher_connections')
      .insert({
        teacher_id: teacher.id,
        request_id: requestData.id,
        status: 'connected'
      })
      .select();

    if (connectionError) {
      console.error('Error creating teacher connection:', connectionError);
      throw connectionError;
    }

    console.log('Teacher connection created:', connectionData);
    onSuccess(requestData.id);
  } catch (error) {
    console.error('Error connecting with teacher:', error);
    onError("Failed to connect with teacher. Please try again.");
  }
};
