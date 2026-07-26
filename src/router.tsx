import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/components/layout/RootLayout'
import { SimulationFormPage } from '@/pages/SimulationFormPage'
import { SimulationHistoryPage } from '@/pages/SimulationHistoryPage'
import { SimulationsResultsPage } from '@/pages/SimulationsResultsPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationFormPage />,
      },
      {
        path: '/resultado/:id',
        element: <SimulationsResultsPage />,
      },
      {
        path: '/historico',
        element: <SimulationHistoryPage />,
      },
    ],
  },
])
