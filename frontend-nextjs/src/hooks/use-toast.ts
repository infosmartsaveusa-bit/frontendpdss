import { useState, useCallback } from 'react';

type ToastProps = {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
};

export const useToast = () => {
    const [, setToasts] = useState<ToastProps[]>([]);

    const toast = useCallback((props: ToastProps) => {
        // Simple console log for demo - in production, you'd use a proper toast library
        console.log(`[Toast ${props.variant || 'default'}]`, props.title, props.description);

        setToasts(prev => [...prev, props]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.slice(1));
        }, 3000);
    }, []);

    return { toast };
};

export { toast } from './toast-standalone';
