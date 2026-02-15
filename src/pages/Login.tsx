import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, LayoutDashboard } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(email, password, remember);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Login Here</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Username</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email or Phone"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors"
            >
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
