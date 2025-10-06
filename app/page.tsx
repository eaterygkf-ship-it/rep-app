import Link from "next/link"
import { Calendar, Users, History, Plus } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 text-balance">Medical Rep Portal</h1>
          <p className="text-lg text-slate-600">Manage your doctor appointments efficiently</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Link href="/book-appointment" className="group">
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-blue-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-slate-900">Book Appointment</CardTitle>
                <CardDescription>Schedule a new doctor visit</CardDescription>
              </CardHeader>
            </Card>
          </Link>
      
          <Link href="/doctors" className="group">
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-cyan-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle className="text-slate-900">Doctors Directory</CardTitle>
                <CardDescription>Browse and search doctors</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/appointments" className="group">
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-teal-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-slate-900">My Appointments</CardTitle>
                <CardDescription>View upcoming visits</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/history" className="group">
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-slate-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                  <History className="w-6 h-6 text-slate-600" />
                </div>
                <CardTitle className="text-slate-900">History</CardTitle>
                <CardDescription>Past appointments & reports</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">12</CardTitle>
              <CardDescription>Appointments This Month</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-cyan-600">8</CardTitle>
              <CardDescription>Doctors Visited</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-teal-600">3</CardTitle>
              <CardDescription>Upcoming This Week</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
