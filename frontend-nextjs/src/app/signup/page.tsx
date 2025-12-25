"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signup, getPasswordStrength } from '@/lib/authStore';
import { toast } from '@/hooks/use-toast';

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password) {
            toast({
                title: 'Missing fields',
                description: 'Please fill in all fields',
                variant: 'destructive',
            });
            return;
        }

        if (passwordStrength.score < 2) {
            toast({
                title: 'Weak password',
                description: 'Please use a stronger password',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = signup(email, password, name);

        if (result.success) {
            toast({
                title: 'Account created!',
                description: 'Please sign in to continue.',
            });
            router.push('/login');
        } else {
            toast({
                title: 'Signup failed',
                description: result.error,
                variant: 'destructive',
            });
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <Shield className="h-8 w-8 text-accent" />
                    <span className="font-display font-bold text-xl text-primary">PhishGuard</span>
                </Link>

                {/* Card */}
                <div className="glass-card p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-display font-bold text-primary mb-2">
                            Create your account
                        </h1>
                        <p className="text-muted-foreground">
                            Start protecting yourself from phishing attacks
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-primary mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-primary mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-primary mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength.score
                                                    ? passwordStrength.color === 'destructive'
                                                        ? 'bg-destructive'
                                                        : passwordStrength.color === 'warning'
                                                            ? 'bg-warning'
                                                            : 'bg-success'
                                                    : 'bg-muted'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs ${passwordStrength.color === 'destructive'
                                        ? 'text-destructive'
                                        : passwordStrength.color === 'warning'
                                            ? 'text-warning'
                                            : 'text-success'
                                        }`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            variant="accent"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Social Buttons (UI Only) */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <Button variant="outline" disabled className="opacity-50">
                                Google
                            </Button>
                            <Button variant="outline" disabled className="opacity-50">
                                GitHub
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            Social login coming soon
                        </p>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-accent hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
}
