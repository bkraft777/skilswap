
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

const EmailInput = ({ email, onChange, error, disabled }: EmailInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className={`absolute left-3 top-2.5 h-5 w-5 ${error ? 'text-destructive' : 'text-gray-400'}`} />
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          className={`pl-10 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          value={email}
          onChange={onChange}
          disabled={disabled}
          required
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default EmailInput;
