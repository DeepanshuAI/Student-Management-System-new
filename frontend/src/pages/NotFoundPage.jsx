import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card hoverLift className="text-center">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Page not found
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              The page you’re looking for doesn’t exist or was moved.
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                className="gap-2"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="h-4 w-4" />
                Go to dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
