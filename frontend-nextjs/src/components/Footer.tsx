import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-card/50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Shield className="h-6 w-6 text-accent" />
                            <span className="font-display font-bold text-lg text-primary">PhishGuard</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Protect yourself from phishing attacks with our intelligent detection tools.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-display font-semibold text-sm text-primary mb-4">Product</h4>
                        <ul className="space-y-2">

                            <li>
                                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    URL Scanner
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    QR Scanner
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Email Detector
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-display font-semibold text-sm text-primary mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-display font-semibold text-sm text-primary mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-sm text-muted-foreground">Privacy Policy</span>
                            </li>
                            <li>
                                <span className="text-sm text-muted-foreground">Terms of Service</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} PhishGuard. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Demo application — scans are simulated locally
                    </p>
                </div>
            </div>
        </footer>
    );
}
