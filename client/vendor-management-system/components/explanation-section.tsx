import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExplanationSectionProps {
  explanation: string
}

export default function ExplanationSection({ explanation }: ExplanationSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Ranking Explanation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{explanation}</p>
      </CardContent>
    </Card>
  )
}

