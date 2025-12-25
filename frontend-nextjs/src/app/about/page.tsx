"use client";

import { motion } from 'framer-motion';
import { Shield, Target, Lock, Eye, Users, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const values = [
    {
        icon: Target,
        title: 'Accuracy First',
        description: 'Our detection algorithms are continuously refined to minimize false positives while catching real threats.',
    },
    {
        icon: Lock,
        title: 'Privacy by Design',
        description: 'We analyze threats without storing your personal data. Your scans stay private and secure.',
    },
    {
        icon: Eye,
        title: 'Transparency',
        description: 'We explain why something is flagged, helping you understand threats and make informed decisions.',
    },
    {
        icon: Users,
        title: 'Accessibility',
        description: 'Security tools should be available to everyone. Our free tier provides essential protection for all.',
    },
];

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                            <Shield className="h-8 w-8 text-accent" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
                            Protecting people from phishing attacks
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            PhishGuard was created with a simple mission: make powerful phishing
                            detection accessible to everyone. In a world where cyber threats are
                            increasingly sophisticated, we believe everyone deserves tools to
                            stay safe online.
                        </p>
                    </motion.div>

                    {/* Mission */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6 text-center">
                                Our Mission
                            </h2>
                            <p className="text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
                                Phishing attacks account for over 90% of data breaches. We're on a
                                mission to change that by providing intelligent, accessible tools
                                that help individuals and organizations identify threats before
                                they cause harm. No security expertise required — just paste, scan,
                                and know.
                            </p>
                        </div>
                    </motion.section>

                    {/* Detection Approach */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4">
                                How We Detect Threats
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Our detection approach combines multiple analysis techniques
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div className="glass-card p-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                                    <Sparkles className="h-5 w-5 text-accent" />
                                </div>
                                <h3 className="font-display font-semibold text-primary mb-2">
                                    Pattern Analysis
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    We analyze URLs for suspicious patterns like typosquatting,
                                    deceptive subdomains, and known phishing indicators.
                                </p>
                            </div>

                            <div className="glass-card p-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                                    <Shield className="h-5 w-5 text-accent" />
                                </div>
                                <h3 className="font-display font-semibold text-primary mb-2">
                                    Reputation Checks
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Domains are checked against reputation databases and analyzed
                                    for age, registration patterns, and historical behavior.
                                </p>
                            </div>

                            <div className="glass-card p-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                                    <Lock className="h-5 w-5 text-accent" />
                                </div>
                                <h3 className="font-display font-semibold text-primary mb-2">
                                    Content Analysis
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Email headers are analyzed for authentication failures (SPF,
                                    DKIM, DMARC) and suspicious content patterns.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Values */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4">
                                Our Values
                            </h2>
                            <p className="text-muted-foreground">
                                The principles that guide everything we build
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-6 flex gap-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <value.icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-primary mb-2">
                                            {value.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Ethics */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20"
                    >
                        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6">
                                Security & Ethics
                            </h2>
                            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                We take your security seriously. All data is processed with
                                encryption, we never sell or share your information, and our
                                detection logic is designed to respect privacy while providing
                                maximum protection. We're committed to ethical security practices
                                and responsible disclosure.
                            </p>
                        </div>
                    </motion.section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
