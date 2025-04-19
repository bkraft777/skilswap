
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { teacherApplicationSchema, TeacherApplicationForm as TeacherApplicationFormType } from './schema/teacherApplicationSchema';
import { useTeacherApplicationSubmit } from './hooks/useTeacherApplicationSubmit';
import { PersonalInfoFields } from './components/PersonalInfoFields';
import { ExpertiseFields } from './components/ExpertiseFields';
import { TeachingDetailsFields } from './components/TeachingDetailsFields';

const expertiseOptions = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Language',
  'Music',
  'Cooking',
  'Photography',
  'Writing',
  'Fitness'
];

const TeacherApplicationForm = () => {
  const form = useForm<TeacherApplicationFormType>({
    resolver: zodResolver(teacherApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      expertise: [],
      experienceYears: 0,
      teachingStyle: '',
      motivation: ''
    }
  });

  const { handleSubmit } = useTeacherApplicationSubmit();
  const watchTeachingStyle = form.watch('teachingStyle');
  const watchMotivation = form.watch('motivation');
  const teachingStyleLength = watchTeachingStyle?.length || 0;
  const motivationLength = watchMotivation?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <ExpertiseFields form={form} expertiseOptions={expertiseOptions} />
        <TeachingDetailsFields 
          form={form} 
          teachingStyleLength={teachingStyleLength}
          motivationLength={motivationLength}
        />
        <Button type="submit" className="w-full">Submit Application</Button>
      </form>
    </Form>
  );
};

export default TeacherApplicationForm;
