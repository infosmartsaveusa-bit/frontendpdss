"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link2, QrCode, Mail, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UrlScanner } from '@/components/UrlScanner';
import { QrScanner } from '@/components/QrScanner';
import { EmailScanner } from '@/components/EmailScanner';
import { ScanHistory } from '@/components/ScanHistory';
import { UsageMeter } from '@/components/UsageMeter';
import { getCurrentUser, logout, updatePlan, type User } from '@/lib/authStore';
import { clearHistory } from '@/lib/scanSimulator';
import { toast } from '@/hooks/use-toast';

const tools = [
    { id: 'url', label: 'URL Scanner', icon: Link2 },
    { id: 'qr', label: 'QR Scanner', icon: QrCode },
    { id: 'email', label: 'Email Detector', icon: Mail },
];

const plans: User['plan'][] = ['free', 'starter', 'pro', 'business'];

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('url');
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.push('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    const refreshUser = () => {
        setUser(getCurrentUser());
    };

    const handleLogout = () => {
        logout();
        toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
        router.push('/');
    };

    const handlePlanChange = (plan: User['plan']) => {
        updatePlan(plan);
        refreshUser();
        toast({ title: 'Plan updated', description: `You are now on the ${plan} plan.` });
    };

    const handleClearData = () => {
        clearHistory();
        toast({ title: 'Data cleared', description: 'All demo data has been cleared.' });
    };

    if (!user) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">
                                Welcome back, {user.name.split(' ')[0]}
                            </h1>
                            <p className="text-muted-foreground">
                                Start scanning to detect phishing threats
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSettings(!showSettings)}
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="glass-card p-6">
                                <h3 className="font-display font-semibold text-primary mb-4">Settings</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Plan Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-2">
                                            Current Plan
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {plans.map((plan) => (
                                                <Button
                                                    key={plan}
                                                    variant={user.plan === plan ? 'accent' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePlanChange(plan)}
                                                    className="capitalize"
                                                >
                                                    {plan}
                                                </Button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Demo mode — switch plans to see different usage limits
                                        </p>
                                    </div>

                                    {/* Data Management */}
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-2">
                                            Demo Data
                                        </label>
                                        <Button variant="outline" size="sm" onClick={handleClearData}>
                                            Clear All Demo Data
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Clears scan history and resets counters
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Tools */}
                        <div className="lg:col-span-2 space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="w-full grid grid-cols-3">
                                    {tools.map((tool) => (
                                        <TabsTrigger
                                            key={tool.id}
                                            value={tool.id}
                                            className="flex items-center gap-2"
                                        >
                                            <tool.icon className="h-4 w-4" />
                                            <span className="hidden sm:inline">{tool.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                <TabsContent value="url" className="mt-6">
                                    <UrlScanner onScanComplete={refreshUser} />
                                </TabsContent>

                                <TabsContent value="qr" className="mt-6">
                                    <QrScanner />
                                </TabsContent>

                                <TabsContent value="email" className="mt-6">
                                    <EmailScanner />
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <UsageMeter user={user} />
                            <ScanHistory />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
