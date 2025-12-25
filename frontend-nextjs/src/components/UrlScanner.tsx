"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Shield, AlertTriangle, XCircle, Loader2, ChevronDown, ExternalLink, Save, Calendar, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { incrementScansUsed } from '@/lib/authStore';
import { addToHistory } from '@/lib/scanSimulator';

// Backend Types
interface ScanResult {
    url: string;
    label: 'safe' | 'suspicious' | 'phishing';
    score: number;
    reasons: string[];
    domain_age?: {
        created: string;
        age_days: number;
    } | null;
    ssl_certificate?: {
        valid_from: string;
        valid_to: string;
        valid: boolean;
        issuer: string;
    } | null;
}

interface DeepScanResponse {
    scan_result: ScanResult;
    redirect_chain: {
        chain: Array<{
            url: string;
            status: string;
            duration_ms?: number;
            error?: string;
        }>;
    };
    screenshot?: string;
}

const verdictConfig = {
    safe: { icon: Shield, color: 'text-success', bg: 'bg-success/10', label: 'Safe' },
    suspicious: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Suspicious' },
    phishing: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Malicious' },
};

interface UrlScannerProps {
    compact?: boolean;
    onScanComplete?: (result: ScanResult) => void;
}

export function UrlScanner({ compact = false, onScanComplete }: UrlScannerProps) {
    const [mode, setMode] = useState<'quick' | 'deep'>('quick');
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [redirectChain, setRedirectChain] = useState<DeepScanResponse['redirect_chain'] | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValidUrl = (input: string) => {
        try {
            const urlToTest = input.startsWith('http') ? input : `https://${input}`;
            new URL(urlToTest);
            return true;
        } catch {
            return false;
        }
    };

    const handleQuickScan = async () => {
        if (!url.trim() || !isValidUrl(url)) return;

        setIsScanning(true);
        setResult(null);
        setRedirectChain(null);
        setShowPreview(false);
        setSaved(false);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8002/scan/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data: ScanResult = await response.json();
            setResult(data);

            // Add to client-side history using the simulator's format
            await addToHistory({
                id: crypto.randomUUID(),
                url: data.url,
                verdict: data.label === 'phishing' ? 'malicious' : data.label as 'safe' | 'suspicious',
                score: data.score,
                reasons: data.reasons || [],
                timestamp: new Date().toISOString(),
                domain_age: data.domain_age || undefined,
                ssl_certificate: data.ssl_certificate || undefined
            });

            incrementScansUsed();
            setSaved(true);
            onScanComplete?.(data);

        } catch (err: any) {
            setError('Failed to connect to scanner service. Please ensure the backend is running.');
            console.error('Scan error:', err);
        } finally {
            setIsScanning(false);
        }
    };

    const handleDeepScan = async () => {
        if (!url.trim() || !isValidUrl(url)) return;

        setIsScanning(true);
        setResult(null);
        setRedirectChain(null);
        setShowPreview(false);
        setSaved(false);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8002/api/url/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data: DeepScanResponse = await response.json();
            setResult(data.scan_result);
            setRedirectChain(data.redirect_chain);
            setShowPreview(true);

            await addToHistory({
                id: crypto.randomUUID(),
                url: data.scan_result.url,
                verdict: data.scan_result.label === 'phishing' ? 'malicious' : data.scan_result.label as 'safe' | 'suspicious',
                score: data.scan_result.score,
                reasons: data.scan_result.reasons || [],
                timestamp: new Date().toISOString(),
                domain_age: data.scan_result.domain_age || undefined,
                ssl_certificate: data.scan_result.ssl_certificate || undefined
            });

            incrementScansUsed();
            setSaved(true);
            onScanComplete?.(data.scan_result);

        } catch (err: any) {
            setError('Failed to generate full report. Please ensure the backend is running.');
            console.error('Report error:', err);
        } finally {
            setIsScanning(false);
        }
    };

    const handleScan = () => {
        if (mode === 'quick') {
            handleQuickScan();
        } else {
            handleDeepScan();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleScan();
        }
    };

    const VerdictIcon = result ? verdictConfig[result.label].icon : Shield;

    const getFlaggingSources = (result: ScanResult) => {
        const sources: string[] = [];
        if (result.reasons?.some(reason => reason.includes('Google Safe Browsing'))) sources.push('GSB');
        if (result.reasons?.some(reason => reason.includes('Domain is newly registered') || reason.includes('young'))) sources.push('Domain Age');
        if (result.reasons?.some(reason => reason.includes('SSL'))) sources.push('SSL Issues');
        if (result.reasons?.some(reason => reason.includes('OpenPhish') || reason.includes('Blocklist'))) sources.push('OpenPhish');
        if (result.label === 'phishing' && sources.length === 0) sources.push('Threat Intelligence');
        return sources;
    };

    return (
        <div className={`${compact ? '' : 'glass-card p-6'}`}>
            {!compact && (
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-accent/10">
                        <Link2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-display font-semibold text-primary">URL Scanner</h3>
                        <p className="text-sm text-muted-foreground">Check any URL for phishing threats</p>
                    </div>
                </div>
            )}

            <Tabs value={mode} onValueChange={(v) => setMode(v as 'quick' | 'deep')}>
                <TabsList className="w-full mb-4">
                    <TabsTrigger value="quick" className="flex-1">Quick Scan</TabsTrigger>
                    <TabsTrigger value="deep" className="flex-1">Deep Scan</TabsTrigger>
                </TabsList>

                <TabsContent value="quick" className="space-y-4">
                    <div className="flex gap-3">
                        <Input
                            type="text"
                            placeholder="Enter URL to scan (e.g., example.com)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                            disabled={isScanning}
                        />
                        <Button
                            onClick={handleScan}
                            disabled={!url.trim() || !isValidUrl(url) || isScanning}
                            variant="accent"
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Scanning
                                </>
                            ) : (
                                'Scan'
                            )}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="deep" className="space-y-4">
                    <div className="flex gap-3">
                        <Input
                            type="text"
                            placeholder="Enter URL for deep analysis..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                            disabled={isScanning}
                        />
                        <Button
                            onClick={handleScan}
                            disabled={!url.trim() || !isValidUrl(url) || isScanning}
                            variant="default"
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deep Scanning
                                </>
                            ) : (
                                'Deep Scan'
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Deep scan includes redirect chain analysis, SSL validation, domain age check, and live preview.</p>
                </TabsContent>
            </Tabs>

            {!isValidUrl(url) && url.trim() && (
                <p className="text-sm text-destructive mt-2">Please enter a valid URL</p>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                >
                    <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-destructive">Error</p>
                            <p className="text-sm text-destructive/80 mt-1">{error}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6"
                    >
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-accent"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: mode === 'deep' ? 4 : 2, ease: 'easeInOut' }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                            {mode === 'deep'
                                ? 'Performing deep analysis: checking redirects, SSL, domain age, and reputation...'
                                : 'Analyzing URL patterns and checking threat databases...'}
                        </p>
                    </motion.div>
                )}

                {result && !isScanning && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                    >
                        {/* Verdict Badge */}
                        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-xl ${verdictConfig[result.label].bg} border-l-4 border-${verdictConfig[result.label].color.replace('text-', '')}`}>
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <VerdictIcon className={`h-10 w-10 ${verdictConfig[result.label].color}`} />
                                <div>
                                    <p className={`font-display font-bold text-2xl ${verdictConfig[result.label].color} uppercase`}>
                                        {verdictConfig[result.label].label}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Scan completed • {new Date().toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`inline-flex items-center px-6 py-3 ${verdictConfig[result.label].bg} border-2 border-${verdictConfig[result.label].color.replace('text-', '')} rounded-full`}>
                                    <span className={`font-bold text-xl ${verdictConfig[result.label].color}`}>
                                        Risk Score: {result.score}/100
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                        await addToHistory({
                                            id: crypto.randomUUID(),
                                            url: result.url,
                                            verdict: result.label === 'phishing' ? 'malicious' : result.label as any,
                                            score: result.score,
                                            reasons: result.reasons || [],
                                            timestamp: new Date().toISOString(),
                                            domain_age: result.domain_age || undefined,
                                            ssl_certificate: result.ssl_certificate || undefined
                                        });
                                        setSaved(true);
                                    }}
                                    disabled={saved}
                                >
                                    <Save className="h-4 w-4" />
                                    {saved ? 'Saved' : 'Save'}
                                </Button>
                            </div>
                        </div>

                        {/* Scanned URL Display */}
                        <div className="p-4 rounded-xl bg-muted/50">
                            <p className="text-sm font-semibold text-primary mb-2">Scanned URL:</p>
                            <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:text-accent/80 underline break-all text-sm"
                            >
                                {result.url}
                            </a>
                        </div>

                        {/* Domain Age & SSL Info (Deep Scan Only) */}
                        {mode === 'deep' && (result.domain_age || result.ssl_certificate) && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Domain Age */}
                                {result.domain_age && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="p-4 rounded-xl bg-muted/50"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="h-4 w-4 text-accent" />
                                            <p className="text-sm font-semibold text-primary">Domain Age</p>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-muted-foreground">
                                                <span className="font-medium text-foreground">Created:</span> {result.domain_age.created}
                                            </p>
                                            <p className="text-muted-foreground">
                                                <span className="font-medium text-foreground">Age:</span> {result.domain_age.age_days} days
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* SSL Certificate */}
                                {result.ssl_certificate && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="p-4 rounded-xl bg-muted/50"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lock className="h-4 w-4 text-accent" />
                                            <p className="text-sm font-semibold text-primary">SSL Certificate</p>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-muted-foreground">
                                                <span className="font-medium text-foreground">Issuer:</span> {result.ssl_certificate.issuer || 'Unknown'}
                                            </p>
                                            <p className="text-muted-foreground">
                                                <span className="font-medium text-foreground">Valid From:</span> {result.ssl_certificate.valid_from}
                                            </p>
                                            <p className="text-muted-foreground">
                                                <span className="font-medium text-foreground">Valid To:</span> {result.ssl_certificate.valid_to}
                                            </p>
                                            <p className="text-muted-foreground">
                                                <span className="font-medium text-foreground">Status:</span>{' '}
                                                <span className={result.ssl_certificate.valid ? 'text-success' : 'text-destructive'}>
                                                    {result.ssl_certificate.valid ? 'Valid ✓' : 'Invalid ✗'}
                                                </span>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Redirect Chain (Deep Scan Only) */}
                        {mode === 'deep' && redirectChain && redirectChain.chain && redirectChain.chain.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-4 rounded-xl bg-muted/50"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowRight className="h-4 w-4 text-accent" />
                                    <p className="text-sm font-semibold text-primary">Redirect Chain Analysis</p>
                                </div>
                                <div className="space-y-3">
                                    {redirectChain.chain.map((step, i) => (
                                        <div key={i} className="p-3 bg-background rounded-lg border border-border/50">
                                            <div className="flex items-start gap-3">
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-accent/10 text-accent rounded-full text-xs font-bold flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-primary">{step.status}</p>
                                                    <p className="text-xs text-muted-foreground break-all mt-1">{step.url}</p>
                                                    {step.duration_ms && (
                                                        <p className="text-xs text-accent mt-1">{step.duration_ms}ms</p>
                                                    )}
                                                    {step.error && (
                                                        <p className="text-xs text-destructive mt-1">Error: {step.error}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Preview Logic Update: Backend doesn't return block/allow explicitly for preview, so we use verdict */}
                        {mode === 'deep' && showPreview && result.label === 'safe' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-4 rounded-xl bg-gradient-to-br from-success/5 to-success/10 border border-success/20"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <ExternalLink className="h-4 w-4 text-success" />
                                    <p className="text-sm font-semibold text-primary">Website Preview</p>
                                </div>
                                <div className="border-2 border-border/50 rounded-lg overflow-hidden bg-background shadow-lg">
                                    <iframe
                                        src={result.url.startsWith('http') ? result.url : `https://${result.url}`}
                                        className="w-full h-96"
                                        sandbox="allow-scripts allow-same-origin"
                                        title="Website Preview"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {mode === 'deep' && showPreview && result.label !== 'safe' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="rounded-xl overflow-hidden border border-destructive/20 shadow-lg"
                            >
                                {/* Header */}
                                <div className="bg-destructive p-4 flex items-center justify-center gap-2 text-destructive-foreground">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-bold text-lg">Preview Blocked for Your Safety</span>
                                </div>

                                {/* Body */}
                                <div className="p-6 bg-red-50 dark:bg-red-950/10 space-y-6">
                                    <p className="text-destructive text-center sm:text-left">
                                        This website has been flagged as <span className="font-bold">phishing</span> with a risk score of {result.score}/100.
                                    </p>

                                    {/* Reasons Blocked */}
                                    <div className="space-y-2">
                                        <p className="font-bold text-destructive text-sm">Reasons blocked:</p>
                                        <div className="bg-destructive/10 p-3 rounded-md text-destructive font-bold text-sm">
                                            {getFlaggingSources(result).join(', ') || "Heuristic Analysis"}
                                        </div>
                                    </div>

                                    {/* Security Prevention List */}
                                    <div className="space-y-3">
                                        <p className="text-destructive font-bold text-sm">For security reasons, the live preview is disabled to prevent:</p>
                                        <ul className="space-y-2">
                                            {[
                                                'Malware infection',
                                                'Credential theft',
                                                'Browser exploits',
                                                'Social engineering attacks'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-destructive text-sm font-medium">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Footer Link */}
                                    <div className="pt-4 border-t border-destructive/10 text-center">
                                        <button className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                            Why is preview blocked?
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Details Toggle */}
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                            {showDetails ? 'Hide' : 'Show'} analysis details
                        </button>

                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-muted/50">
                                            <p className="text-sm font-medium text-primary mb-2">Analysis Details</p>
                                            {result.reasons && result.reasons.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {result.reasons.map((reason, i) => (
                                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                            <span className="text-accent mt-1">•</span>
                                                            {reason}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-success flex items-center gap-2">
                                                    <Shield className="h-4 w-4" />
                                                    No suspicious indicators found
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
