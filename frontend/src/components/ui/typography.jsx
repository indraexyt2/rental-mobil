import { cn } from "@/lib/utils";

export function TypographyH1({ children }) {
    return (
        <h1 className="scroll-m-20 text-3xl md:text-4xl lg:text-5xl pb-2 font-extrabold tracking-tight">
            {children}
        </h1>
    )
}

export function TypographyH2({ children, className }) {
    return (
        <h2 className={cn(
            "scroll-m-20 pb-2 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight first:mt-0",
            className
        )}>
            {children}
        </h2>
    )
}

export function TypographyH3({ children, className }) {
    return (
        <h3 className={cn(
            "scroll-m-20 text-md md:text-lg font-semibold tracking-tight",
            className
        )}>
            {children}
        </h3>
    )
}

export function TypographyP({ children }) {
    return (
        <p className="leading-6 [&:not(:first-child)]:mt-2 sm:text-base text-sm">
            {children}
        </p>
    )
}


