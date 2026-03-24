import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Card>
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            Page not found
          </div>
          <div className="mt-2 text-sm text-slate-600">
            The page you’re looking for doesn’t exist.
          </div>
          <div className="mt-5">
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

