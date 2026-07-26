import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/features/Historico/Card'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationHistoryPage() {
  const { getSimulationHistory, deleteSimulation } = useSimulationStorage()
  const [simulationHistory, setSimulationHistory] = useState(getSimulationHistory())
  const navigate = useNavigate()

  const handleDelete = (simulationId: string) => {
    deleteSimulation(simulationId)
    setSimulationHistory(getSimulationHistory())
  }

  if (!simulationHistory) return <p>Erro ao buscar histórico de simulações</p>

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros"
      />
      <div className="flex flex-col gap-4">
        {simulationHistory.length === 0 && (
          <p className="mx-auto py-6 text-center">Ainda não há nenhuma simulação salva</p>
        )}
        {simulationHistory.length > 0 &&
          simulationHistory.map(simulation => (
            <Card
              key={simulation.id}
              history={simulation}
              onDelete={() => handleDelete(simulation.id)}
              onDetail={() => void navigate(`/resultado/${simulation.id}`)}
            />
          ))}
      </div>
    </main>
  )
}
