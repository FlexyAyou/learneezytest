
import React from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

const Login = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showPassword, setShowPassword, isLoading, handleLogin } = useAuthForm();

  const onSubmit = async (data: any) => {
    try {
      await handleLogin(data.email, data.password);
      toast({
        title: t('auth.connectionSuccess'),
        description: t('auth.nowConnected'),
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: t('auth.connectionError'),
        description: t('auth.checkCredentials'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-pink-600 via-orange-700 to-pink-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">
            {t('auth.welcomeBack')}
          </h2>
          <p className="text-pink-100 mb-8 text-lg leading-relaxed">
            {t('auth.loginDescription')}
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">{t('auth.instantAccess')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">{t('auth.progressTracking')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">{t('auth.certificates')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-pink-200">✓</div>
              <span className="text-pink-100">{t('auth.community')}</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-pink-100">{t('auth.satisfaction')}</span>
              <div className="flex items-center space-x-1">
                <span className="ml-2 font-semibold text-2xl">98%</span>
              </div>
            </div>
            <p className="text-sm text-pink-200">
              "{t('auth.testimonial')}"
            </p>
            <p className="text-xs text-pink-300 mt-2">- {t('auth.testimonialAuthor')}</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img 
                src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png" 
                alt="Learneezy" 
                className="h-24 w-auto"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.welcome')}
            </h1>
            <p className="text-gray-600">
              {t('auth.enterInfo')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-10"
                  {...register('email', { required: t('auth.email') + ' requis' })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password')}
                  className="pr-10"
                  {...register('password', { required: t('auth.password') + ' requis' })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  {t('auth.rememberMe')}
                </label>
              </div>
              <Link to="/mot-de-passe-oublie" className="text-sm text-pink-600 hover:text-pink-700">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? t('auth.connectingText') : t('auth.login')}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('auth.continueWith')}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <img src="/lovable-uploads/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <img src="/lovable-uploads/microsoft-logo.png" alt="Microsoft" className="w-5 h-5 mr-2" />
                Microsoft
              </Button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.noAccount')}{' '}
              <Link to="/inscription" className="text-pink-600 hover:text-pink-700 font-medium">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
