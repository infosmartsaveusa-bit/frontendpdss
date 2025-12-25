type ToastProps = {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
};

export const toast = (props: ToastProps) => {
    console.log(`[Toast ${props.variant || 'default'}]`, props.title, props.description);

    // In a real app, this would trigger a toast notification
    // For now, we'll just log to console
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('toast', { detail: props });
        window.dispatchEvent(event);
    }
};
