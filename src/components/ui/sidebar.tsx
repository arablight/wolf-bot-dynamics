
import * as React from "react"
import { cn } from "@/lib/utils"

type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
)

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function Sidebar({ children, className, ...props }: SidebarProps) {
  const { collapsed } = useSidebarContext()

  return (
    <div
      data-collapsed={collapsed}
      className={cn(
        "flex flex-col gap-4 h-screen bg-background/95 py-4 data-[collapsed=true]:items-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SidebarHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center px-4", className)} {...props}>
      {children}
    </div>
  )
}

function SidebarContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto", className)} {...props}>
      {children}
    </div>
  )
}

function SidebarFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

function SidebarGroup({ title, children, className, ...props }: SidebarGroupProps) {
  return (
    <div className={cn("px-4 py-2", className)} {...props}>
      {title && (
        <h3 className="mb-2 text-xs font-semibold text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

function SidebarGroupContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

function SidebarGroupLabel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebarContext()

  if (collapsed) {
    return null
  }

  return (
    <div
      className={cn("text-xs font-semibold text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function SidebarMenu({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  )
}

function SidebarMenuItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn(className)} {...props}>
      {children}
    </li>
  )
}

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ asChild, className, ...props }, ref) => {
  const { collapsed } = useSidebarContext()

  if (asChild) {
    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-2",
          className
        )}
        {...props}
      />
    )
  }

  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { collapsed, setCollapsed } = useSidebarContext()

  return (
    <button
      className={cn("inline-flex items-center justify-center", className)}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200"
        style={{
          transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        <path d="m15 6-6 6 6 6" />
      </svg>
    </button>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebarContext,
}
