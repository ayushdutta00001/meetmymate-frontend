import { supabase } from '../../supabase';
import { useState } from 'react';
import { Button } from '../Button';

interface ResetPasswordScreenProps {
  onSuccess: () => void;
}

export default function ResetPasswordScreen({
  onSuccess,
}: ResetPasswordScreenProps) {

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleResetPassword() {
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
  password: password,
});

if (!error) {
  alert('Password reset successful');
  onSuccess(); // ✅ THIS IS REQUIRED
}

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Password updated successfully');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F4F7]">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border mb-3"
        />

        {message && (
          <p className="text-sm mb-3">{message}</p>
        )}

        <Button
          variant="primary"
          fullWidth
          loading={loading}
          onClick={handleResetPassword}
        >
          Update Password
        </Button>
      </div>
    </div>
  );
}
