"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, AlertTriangle, XCircle, Loader2, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { addToHistory, simulateEmailScan, type ScanVerdict, type EmailScanResult } from '@/lib/scanSimulator';
import { incrementScansUsed } from '@/lib/authStore';

const verdictConfig: Record<ScanVerdict, { icon: typeof Shield; color: string; bg: string; label: string }> = {
    safe: { icon: Shield, color: 'text-success', bg: 'bg-success/10', label: 'Safe' },
    suspicious: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Suspicious' },
    malicious: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Malicious' },
};

export function EmailScanner() {
    const [from, setFrom] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<EmailScanResult | null>(null);

    const handleScan = async () => {
        if (!from && !subject && !body) {
            toast({
                title: "Empty Request",
                description: "Please provide at least a sender, subject, or body to scan.",
                variant: "destructive",
            });
            return;
        }

        setIsScanning(true);
        setResult(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            // Extract links from body (simple regex for simulation)
            const linkRegex = /(https?:\/\/[^\s]+)/g;
            const links = body.match(linkRegex) || [];

            const emailResult = simulateEmailScan(from, subject, links, body);

            setResult(emailResult);
            // Auto-save to history
            await addToHistory(emailResult);
            incrementScansUsed();

        } catch (error) {
            console.error('Scan failed:', error);
            toast({
                title: 'Scan Failed',
                description: 'Could not complete the scan. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsScanning(false);
        }
    };

    const reset = () => {
        setResult(null);
        setFrom('');
        setSubject('');
        setBody('');
    };

    // Safe getter for verdict config with fallback
    const getVerdictConfig = () => {
        if (!result || !result.verdict || !verdictConfig[result.verdict]) {
            return verdictConfig.safe; // fallback to safe
        }
        return verdictConfig[result.verdict];
    };

    const currentVerdictConfig = getVerdictConfig();
    const VerdictIcon = currentVerdictConfig.icon;

    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-accent/10">
                        <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-display font-semibold text-primary">Email Scanner</h3>
                        <p className="text-sm text-muted-foreground">Analyze emails for phishing indicators</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="text-sm font-medium text-primary mb-1.5 block">From (Sender)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        placeholder="security@example.com"
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-primary mb-1.5 block">Subject Line</label>
                                <div className="relative">
                                    <AlertOctagon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Urgent: Verify your account"
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-primary mb-1.5 block">Email Body / Content</label>
                                <Textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Paste the suspicious email content here..."
                                    rows={5}
                                />
                            </div>

                            <Button
                                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                size="lg"
                                onClick={handleScan}
                                disabled={isScanning || (!from && !subject && !body)}
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Scanning...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Scan Email
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Unified Verdict Display (Matching UrlScanner) */}
                            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-xl ${currentVerdictConfig.bg} border-l-4 border-${currentVerdictConfig.color.replace('text-', '')}`}>
                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                    <VerdictIcon className={`h-10 w-10 ${currentVerdictConfig.color}`} />
                                    <div>
                                        <p className={`font-display font-bold text-2xl ${currentVerdictConfig.color} uppercase`}>
                                            {currentVerdictConfig.label}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Scan completed • {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`inline-flex items-center px-6 py-3 ${currentVerdictConfig.bg} border-2 border-${currentVerdictConfig.color.replace('text-', '')} rounded-full`}>
                                        <span className={`font-bold text-xl ${currentVerdictConfig.color}`}>
                                            Risk Score: {result.score}/100
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" disabled>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Saved
                                    </Button>
                                </div>
                            </div>

                            {/* Scanned Info Summary */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">From</p>
                                    <p className="text-sm font-medium text-foreground break-all">{from || 'Not provided'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Subject</p>
                                    <p className="text-sm font-medium text-foreground break-words">{subject || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Analysis Findings */}
                            <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                                <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-accent" />
                                    Security Analysis
                                </h4>

                                {result.reasons.length > 0 ? (
                                    <ul className="space-y-3">
                                        {result.reasons.map((reason, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <AlertOctagon className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                        No specific threats detected.
                                    </p>
                                )}
                            </div>

                            {/* Suspicious Links (if any) */}
                            {result.suspiciousLinks && result.suspiciousLinks.length > 0 && (
                                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                                    <h4 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Suspicious Links Found
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.suspiciousLinks.map((link, idx) => (
                                            <li key={idx} className="text-sm font-mono text-muted-foreground bg-background/50 p-2 rounded border break-all">
                                                {link}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button variant="outline" className="w-full" onClick={reset}>
                                Scan Another Email
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default EmailScanner;
