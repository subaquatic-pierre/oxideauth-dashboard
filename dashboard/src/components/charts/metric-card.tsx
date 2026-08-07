"use client"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MetricCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  href?: string
  className?: string
}

export function MetricCard({ title, value, icon, href, className }: MetricCardProps) {
  const content = (
    <Card className={cn("hover:bg-accent/50 transition-colors cursor-pointer", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <Text variant="h2" className="mt-2">{value}</Text>
      </CardHeader>
    </Card>
  )
  if (href) return <Link href={href}>{content}</Link>
  return content
}
