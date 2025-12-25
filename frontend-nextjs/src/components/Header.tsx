"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Sun, Moon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logout } from '@/lib/authStore';
import { useTheme } from '@/components/ThemeProvider';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const user = getCurrentUser();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <Shield className="h-8 w-8 text-accent transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-display font-bold text-xl text-primary">PhishGuard</span>
                        </Link>
                    </div>

                    {/* Desktop Nav - Center */}
                    <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-accent bg-accent/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Theme Toggle & Auth Buttons - Right */}
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-all scale-hover"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <Sun className="h-5 w-5 text-muted-foreground" />
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {/* Auth Buttons / Profile */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border bg-card/50 hover:bg-muted transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium max-w-[100px] truncate hidden md:block">
                                        {user.name}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl bg-card border border-border/50 shadow-xl backdrop-blur-xl z-50"
                                        >
                                            <div className="p-3 border-b border-border/50 mb-2">
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                <div className="mt-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                                                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Dashboard
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsProfileOpen(false);
                                                        window.location.reload();
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Backdrop to close dropdown */}
                                {isProfileOpen && (
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                )}
                            </div>
                        ) : (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button asChild variant="accent">
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border/50 bg-background"
                    >
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'text-accent bg-accent/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                                {user ? (
                                    <Button asChild variant="accent" className="w-full">
                                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                                Log in
                                            </Link>
                                        </Button>
                                        <Button asChild variant="accent" className="w-full">
                                            <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}

                                {/* Theme Toggle - Mobile */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={toggleTheme}
                                >
                                    {theme === 'light' ? (
                                        <>
                                            <Moon className="h-4 w-4" />
                                            Dark Mode
                                        </>
                                    ) : (
                                        <>
                                            <Sun className="h-4 w-4" />
                                            Light Mode
                                        </>
                                    )}
                                </Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
