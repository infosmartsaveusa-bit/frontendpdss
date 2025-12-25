"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, Upload, X, Loader2, Shield, AlertTriangle, XCircle } from 'lucide-react';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { simulateUrlScan, addToHistory, type ScanResult, type ScanVerdict } from '@/lib/scanSimulator';
import { incrementScansUsed } from '@/lib/authStore';

const verdictConfig: Record<ScanVerdict, { icon: typeof Shield; color: string; bg: string; label: string }> = {
    safe: { icon: Shield, color: 'text-success', bg: 'bg-success/10', label: 'Safe' },
    suspicious: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Suspicious' },
    malicious: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Malicious' },
};

export function QrScanner() {
    const [mode, setMode] = useState<'idle' | 'camera' | 'upload'>('idle');
    const [isScanning, setIsScanning] = useState(false);
    const [decodedUrl, setDecodedUrl] = useState<string | null>(null);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    const startCamera = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setMode('camera');
            scanVideoFrame();
        } catch (err) {
            setCameraError('Camera access denied. Please allow camera permissions or use image upload.');
            setMode('upload');
        }
    };

    const scanVideoFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || mode !== 'camera') return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                handleQrDetected(code.data);
                return;
            }
        }

        requestAnimationFrame(scanVideoFrame);
    }, [mode]);

    const handleQrDetected = async (data: string) => {
        stopCamera();
        setDecodedUrl(data);
        setIsScanning(false);
        setMode('idle');
        // Don't analyze immediately - wait for user to click "Analyze URL" button
    };

    const analyzeDecodedUrl = async () => {
        if (!decodedUrl) return;

        setIsScanning(true);
        setResult(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/scan/url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: decodedUrl }),
            });

            if (!response.ok) throw new Error('Scan failed');

            const data = await response.json();

            const scanResult: ScanResult = {
                id: crypto.randomUUID(),
                type: 'qr',
                url: decodedUrl,
                verdict: data.label === 'phishing' ? 'malicious' : data.label as ScanVerdict,
                score: data.score,
                reasons: data.reasons || [],
                timestamp: new Date().toISOString(),
                domain_age: data.domain_age,
                ssl_certificate: data.ssl_certificate
            };

            setResult(scanResult);
            await addToHistory(scanResult);
            incrementScansUsed();
        } catch (error) {
            console.error('🔍 QR Scanner - Error:', error);
            setCameraError('Failed to connect to scanner service.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        handleQrDetected(code.data);
                    } else {
                        setCameraError('No QR code found in the image. Please try another image.');
                    }
                }
            };
            img.src = reader.result as string;
        };

        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const reset = () => {
        stopCamera();
        setMode('idle');
        setDecodedUrl(null);
        setResult(null);
        setCameraError(null);
    };

    const VerdictIcon = result ? verdictConfig[result.verdict].icon : Shield;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-accent/10">
                    <QrCode className="h-5 w-5 text-accent" />
                </div>
                <div>
                    <h3 className="font-display font-semibold text-primary">QR Scanner</h3>
                    <p className="text-sm text-muted-foreground">Scan QR codes to check for threats</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'idle' && !result && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <Button
                            variant="outline"
                            className="h-32 flex-col gap-3"
                            onClick={startCamera}
                        >
                            <Camera className="h-8 w-8 text-accent" />
                            <span>Use Camera</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-32 flex-col gap-3"
                            onClick={() => {
                                setMode('upload');
                                fileInputRef.current?.click();
                            }}
                        >
                            <Upload className="h-8 w-8 text-accent" />
                            <span>Upload Image</span>
                        </Button>
                    </motion.div>
                )}

                {mode === 'camera' && (
                    <motion.div
                        key="camera"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-primary">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                playsInline
                                muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-48 h-48 border-2 border-accent rounded-2xl relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent animate-scan" />
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute top-4 right-4"
                                onClick={reset}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-4">
                            Position QR code within the frame
                        </p>
                        <canvas ref={canvasRef} className="hidden" />
                    </motion.div>
                )}

                {mode === 'upload' && !result && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging ? 'border-accent bg-accent/5' : 'border-border'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">Drag & drop an image here</p>
                            <p className="text-sm text-muted-foreground mb-4">or</p>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Choose File
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        {cameraError && (
                            <p className="text-sm text-destructive mt-4 text-center">{cameraError}</p>
                        )}
                        <Button variant="ghost" className="w-full mt-4" onClick={reset}>
                            Cancel
                        </Button>
                    </motion.div>
                )}

                {isScanning && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                    >
                        <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Analyzing QR code content...</p>
                        {decodedUrl && (
                            <p className="text-sm text-muted-foreground mt-2 truncate max-w-xs mx-auto">
                                {decodedUrl}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Decoded URL - Show before analysis */}
                {decodedUrl && !result && !isScanning && (
                    <motion.div
                        key="decoded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <div className="p-6 rounded-xl bg-accent/5 border-2 border-accent/20">
                            <div className="flex items-center gap-2 mb-3">
                                <QrCode className="h-5 w-5 text-accent" />
                                <p className="text-sm font-semibold text-primary">QR Code Decoded Successfully!</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50 mb-4">
                                <p className="text-xs text-muted-foreground mb-2">Decoded Content:</p>
                                <p className="text-sm font-mono text-foreground break-all">{decodedUrl}</p>
                            </div>
                            <Button
                                className="w-full bg-accent hover:bg-accent/90"
                                size="lg"
                                onClick={analyzeDecodedUrl}
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                <span className="text-accent-foreground">Analyze URL for Threats</span>
                            </Button>
                        </div>
                        <Button variant="ghost" className="w-full" onClick={reset}>
                            Scan Another QR Code
                        </Button>
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Verdict Badge */}
                        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-xl ${verdictConfig[result.verdict].bg} border-l-4 border-${verdictConfig[result.verdict].color.replace('text-', '')} mb-4`}>
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <VerdictIcon className={`h-10 w-10 ${verdictConfig[result.verdict].color}`} />
                                <div>
                                    <p className={`font-display font-bold text-2xl ${verdictConfig[result.verdict].color} uppercase`}>
                                        {verdictConfig[result.verdict].label}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Scan completed • {new Date().toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`inline-flex items-center px-6 py-3 ${verdictConfig[result.verdict].bg} border-2 border-${verdictConfig[result.verdict].color.replace('text-', '')} rounded-full`}>
                                    <span className={`font-bold text-xl ${verdictConfig[result.verdict].color}`}>
                                        Risk Score: {result.score}/100
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Decoded URL Display */}
                        <div className="p-4 rounded-xl bg-muted/50 mb-4">
                            <p className="text-sm font-semibold text-primary mb-2">Decoded URL:</p>
                            <a
                                href={decodedUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:text-accent/80 underline break-all text-sm"
                            >
                                {decodedUrl}
                            </a>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/50">
                            <p className="text-sm font-medium text-primary mb-2">Findings</p>
                            <ul className="space-y-1">
                                {result.reasons.map((reason, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-accent">•</span>
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button variant="outline" className="w-full mt-4" onClick={reset}>
                            Scan Another
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
