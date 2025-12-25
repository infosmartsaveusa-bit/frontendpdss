"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Link2, QrCode, Mail, ArrowRight, CheckCircle, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UrlScanner } from '@/components/UrlScanner';

const features = [
  {
    icon: Link2,
    title: 'URL Scanner',
    description: 'Instantly analyze any URL for phishing indicators, suspicious patterns, and known threats.',
  },
  {
    icon: QrCode,
    title: 'QR Scanner',
    description: 'Scan QR codes with your camera or upload images to decode and check hidden URLs.',
  },
  {
    icon: Mail,
    title: 'Email Detector',
    description: 'Analyze email headers, sender reputation, and embedded links for phishing attempts.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Input',
    description: 'Enter a URL, scan a QR code, or paste email content',
  },
  {
    number: '02',
    title: 'Analyze',
    description: 'Our engine checks patterns, domains, and threat databases',
  },
  {
    number: '03',
    title: 'Report',
    description: 'Get instant results with detailed threat assessment',
  },
];

const stats = [
  { value: '99.2%', label: 'Detection Rate' },
  { value: '<1s', label: 'Scan Time' },
  { value: '50M+', label: 'Threats Blocked' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8">
                <Shield className="h-4 w-4" />
                Trusted by 10,000+ security teams
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary mb-6 leading-tight">
                Detect phishing —{' '}
                <span className="gradient-text">URL, QR & Email</span>{' '}
                in seconds
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Protect yourself and your organization from phishing attacks with our
                intelligent detection tools. Scan URLs, decode QR codes, and analyze
                emails instantly.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="hero" className="whitespace-nowrap">
                  <Link href="/dashboard" className="inline-flex items-center gap-2">
                    Try Live Scanner
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-display font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                Three powerful tools, one mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive protection against phishing attacks across all vectors
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-8 hover-lift"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <feature.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                How it works
              </h2>
              <p className="text-lg text-muted-foreground">
                Three simple steps to stay protected
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-display font-bold text-accent/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Demo */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                  Try it now
                </h2>
                <p className="text-lg text-muted-foreground">
                  Enter any URL to see instant threat analysis
                </p>
              </div>

              <UrlScanner />

              <p className="text-center text-sm text-muted-foreground mt-6">
                Demo mode — scans are simulated locally for demonstration purposes
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="glass-card p-12 text-center max-w-4xl mx-auto">
              <div className="flex justify-center gap-6 mb-8">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4">
                Ready to protect your organization?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of security-conscious teams using PhishGuard to
                stay protected from phishing attacks.
              </p>

              <Button asChild size="lg" variant="hero" className="whitespace-nowrap">
                <Link href="/signup" className="inline-flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
