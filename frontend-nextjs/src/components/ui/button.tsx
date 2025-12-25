import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-border bg-transparent hover:bg-muted",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-muted hover:text-foreground",
                link: "text-accent underline-offset-4 hover:underline",
                accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20",
                hero: "bg-gradient-to-r from-accent to-purple-500 text-white hover:shadow-xl hover:shadow-accent/30 hover:scale-105",
                "hero-outline": "border-2 border-accent text-accent hover:bg-accent hover:text-white",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        if (asChild) {
            return (
                <span className={cn(buttonVariants({ variant, size, className }))}>
                    {props.children}
                </span>
            )
        }
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
