"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Shield, AlertTriangle, XCircle, Download, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getScanHistory, clearHistory, exportHistoryCSV, type ScanResult, type EmailScanResult, type ScanVerdict } from '@/lib/scanSimulator';
import { toast } from '@/hooks/use-toast';

const verdictConfig: Record<ScanVerdict, { icon: typeof Shield; color: string; bg: string }> = {
    safe: { icon: Shield, color: 'text-success', bg: 'bg-success/10' },
    suspicious: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    malicious: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function ScanHistory() {
    const [history, setHistory] = useState<(ScanResult | EmailScanResult)[]>([]);
    const [filter, setFilter] = useState<'all' | ScanVerdict>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getScanHistory();
            setHistory(data);
        };
        fetchHistory();

        // Refresh history every 2 seconds to show new scans
        const interval = setInterval(fetchHistory, 2000);

        return () => clearInterval(interval);
    }, []);

    const filteredHistory = history.filter(item => {
        if (filter !== 'all' && item.verdict !== filter) return false;
        if (search) {
            const searchLower = search.toLowerCase();
            if ('url' in item) {
                return item.url.toLowerCase().includes(searchLower);
            }
            return item.reasons.some(r => r.toLowerCase().includes(searchLower));
        }
        return true;
    });

    const handleExport = () => {
        const csv = exportHistoryCSV(history);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `phishguard-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Exported', description: 'History exported as CSV' });
    };

    const handleClear = () => {
        clearHistory();
        setHistory([]);
        toast({ title: 'Cleared', description: 'Scan history has been cleared' });
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10">
                        <History className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-display font-semibold text-primary">Scan History</h3>
                        <p className="text-sm text-muted-foreground">{history.length} scans recorded</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={history.length === 0}>
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClear} disabled={history.length === 0}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                    <SelectTrigger className="w-36">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="safe">Safe</SelectItem>
                        <SelectItem value="suspicious">Suspicious</SelectItem>
                        <SelectItem value="malicious">Malicious</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* History List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                    {filteredHistory.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-muted-foreground"
                        >
                            {history.length === 0 ? 'No scans yet' : 'No matching results'}
                        </motion.div>
                    ) : (
                        filteredHistory.map((item, index) => {
                            // Safety check for verdict
                            const verdict = item.verdict as ScanVerdict;
                            const config = verdictConfig[verdict] || verdictConfig.safe;
                            const VerdictIcon = config.icon;
                            const isUrl = 'url' in item;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                                >
                                    <div className={`p-2 rounded-lg ${config.bg}`}>
                                        <VerdictIcon className={`h-4 w-4 ${config.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-primary truncate">
                                            {isUrl ? (item as ScanResult).url : 'Email Scan'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-medium ${config.color}`}>
                                            {item.score}%
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {item.verdict}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
