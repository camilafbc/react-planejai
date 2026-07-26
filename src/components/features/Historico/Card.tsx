import { ExternalLink, Goal, Trash2 } from 'lucide-react'

import { Button } from '@/components/shared/Button'
import type { SimulationRecord } from '@/data/simulation'
import { calcMonthlySavings } from '@/utils/simulation'

interface CardProps {
  history: SimulationRecord
  onDelete: () => void
  onDetail: () => void
}

function SectionData({ title, data }: { title: string; data: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs uppercase">{title}</p>
      <p className="text-md font-bold">{data}</p>
    </div>
  )
}

export function Card({ history, onDelete, onDetail }: CardProps) {
  if (!history) {
    return null
  }

  const monthlySavings = calcMonthlySavings(history)

  return (
    <div className="bg-card grid grid-cols-1 gap-4 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:grid-cols-5 lg:items-center lg:gap-0">
      <div className="mr-4 flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-fuchsia-100 p-1.5">
          <Goal className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold">{history.goalName}</p>
          <p className="text-muted-foreground text-xs">{history?.createdAt}</p>
        </div>
      </div>
      <SectionData title="Custo da meta" data={`R$ ${history.goalAmount}`} />
      <SectionData title="Prazo" data={`${history.goalDeadline} meses`} />
      <SectionData
        title="Economia mensal"
        data={`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      />
      <div className="border-border flex items-center justify-between border-t pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pr-10 lg:pl-4">
        <Button icon={Trash2} className="text-red-600" variant="ghost" onClick={onDelete} />
        <Button
          variant="secondary"
          icon={ExternalLink}
          className="whitespace-nowrap"
          onClick={onDetail}
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  )
}
