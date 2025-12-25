"use client";

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import type { User } from '@/lib/authStore';

interface UsageMeterProps {
    user: User | null;
}

export function UsageMeter({ user }: UsageMeterProps) {
    if (!user) return null;

    const percentage = Math.min((user.scansUsed / user.scansLimit) * 100, 100);
    const remaining = Math.max(user.scansLimit - user.scansUsed, 0);

    const getColor = () => {
        if (percentage >= 90) return 'bg-destructive';
        if (percentage >= 70) return 'bg-warning';
        return 'bg-accent';
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-accent/10">
                    <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                    <h3 className="font-display font-semibold text-primary">Usage</h3>
                    <p className="text-sm text-muted-foreground capitalize">{user.plan} Plan</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Scans Used</span>
                    <span className="font-medium text-primary">
                        {user.scansUsed.toLocaleString()} / {user.scansLimit.toLocaleString()}
                    </span>
                </div>

                <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${getColor()} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                <p className="text-xs text-muted-foreground">
                    {remaining.toLocaleString()} scans remaining this month
                </p>
            </div>
        </div>
    );
}
