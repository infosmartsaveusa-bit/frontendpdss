"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

const CONTACT_STORAGE_KEY = 'phishguard_contact_submissions';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast({
                title: 'Missing fields',
                description: 'Please fill in all fields',
                variant: 'destructive',
            });
            return;
        }

        if (!validateEmail(email)) {
            toast({
                title: 'Invalid email',
                description: 'Please enter a valid email address',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate submission delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save to localStorage for demo
        const submissions = JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY) || '[]');
        submissions.push({
            id: crypto.randomUUID(),
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
        });
        localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(submissions));

        setIsSubmitting(false);
        setIsSubmitted(true);

        toast({
            title: 'Message sent',
            description: "Thank you for reaching out. We'll get back to you soon!",
        });
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-primary mb-2">
                            Message Sent!
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Thank you for reaching out. We'll get back to you within 24 hours.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                            Send Another Message
                        </Button>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
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
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                            <MessageSquare className="h-8 w-8 text-accent" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
                            Get in touch
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Have a question, feedback, or need help? We'd love to hear from you.
                        </p>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-lg mx-auto"
                    >
                        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-primary mb-1.5">
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-primary mb-1.5">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    maxLength={255}
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-primary mb-1.5">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="How can we help you?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    maxLength={1000}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {message.length}/1000 characters
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                variant="accent"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Contact Info */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                                Or reach us directly
                            </p>
                            <a
                                href="mailto:hello@phishguard.example"
                                className="inline-flex items-center gap-2 text-accent hover:underline"
                            >
                                <Mail className="h-4 w-4" />
                                hello@phishguard.example
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
