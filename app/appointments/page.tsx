"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Building2, Phone, CheckCircle2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAppointments, getDoctors, type Appointment } from "@/lib/storage"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const doctors = getDoctors()

  useEffect(() => {
    setAppointments(getAppointments())
  }, [])

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "scheduled" && new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getDoctor = (doctorId: string) => doctors.find((d) => d.id === doctorId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Appointments</h1>
            <p className="text-slate-600">Upcoming scheduled visits</p>
          </div>
          <Link href="/book-appointment">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming appointments</h3>
              <p className="text-slate-600 mb-6">Schedule your first appointment with a doctor</p>
              <Link href="/book-appointment">
                <Button className="bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => {
              const doctor = getDoctor(appointment.doctorId)

              return (
                <Card key={appointment.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Date Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg bg-blue-100 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">
                            {new Date(appointment.date).getDate()}
                          </span>
                          <span className="text-xs font-medium text-blue-600 uppercase">
                            {new Date(appointment.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-1">{doctor?.name}</h3>
                            <p className="text-sm text-slate-600">{doctor?.specialty}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Scheduled
                          </Badge>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{formatTime(appointment.time)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span>{doctor?.hospital}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{doctor?.phone}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-sm font-medium text-slate-700 mb-1">Purpose:</p>
                          <p className="text-sm text-slate-600">{appointment.purpose}</p>
                          {appointment.notes && (
                            <>
                              <p className="text-sm font-medium text-slate-700 mt-2 mb-1">Notes:</p>
                              <p className="text-sm text-slate-600">{appointment.notes}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
