"use client"

import { useEffect, useState } from "react"
import { Calendar, Building2, User, Printer, Download, CheckCircle2, XCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAppointments, getDoctors, type Appointment } from "@/lib/storage"

export default function HistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const doctors = getDoctors()

  useEffect(() => {
    setAppointments(getAppointments())
  }, [])

  const filteredAppointments = appointments
    .filter((apt) => statusFilter === "all" || apt.status === statusFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    window.print()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Calendar className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          nav,
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .print-card {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header - Hidden on print */}
          <div className="flex items-center justify-between mb-8 no-print">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Appointment History</h1>
              <p className="text-slate-600">View and manage all your appointments</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Print Header - Only visible when printing */}
          <div className="print-only mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Appointment History Report</h1>
            <p className="text-sm text-slate-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Filter - Hidden on print */}
          <Card className="bg-white border-slate-200 mb-6 no-print">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Appointments</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-slate-600">
                  Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <Card className="bg-white border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No appointments found</h3>
                <p className="text-slate-600">Try adjusting your filters or book a new appointment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const doctor = getDoctor(appointment.doctorId)

                return (
                  <Card key={appointment.id} className="bg-white border-slate-200 print-card">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-slate-900">{doctor?.name}</h3>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <p className="text-sm text-slate-600">{doctor?.specialty}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-slate-900">{formatDate(appointment.date)}</div>
                            <div className="text-sm text-slate-600">{formatTime(appointment.time)}</div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-3 md:grid-cols-2 pt-3 border-t border-slate-100">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                              Medical Representative
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <User className="w-4 h-4 text-slate-400" />
                                <span>{appointment.repName}</span>
                              </div>
                              <div className="text-sm text-slate-600 ml-6">{appointment.repCompany}</div>
                              <div className="text-sm text-slate-600 ml-6">{appointment.repPhone}</div>
                              <div className="text-sm text-slate-600 ml-6">{appointment.repEmail}</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Doctor Information</h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span>{doctor?.hospital}</span>
                              </div>
                              <div className="text-sm text-slate-600 ml-6">{doctor?.address}</div>
                              <div className="text-sm text-slate-600 ml-6">{doctor?.phone}</div>
                              <div className="text-sm text-slate-600 ml-6">{doctor?.email}</div>
                            </div>
                          </div>
                        </div>

                        {/* Purpose and Notes */}
                        <div className="pt-3 border-t border-slate-100">
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Purpose of Visit</h4>
                            <p className="text-sm text-slate-700">{appointment.purpose}</p>
                          </div>
                          {appointment.notes && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Additional Notes</h4>
                              <p className="text-sm text-slate-700">{appointment.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-500">
                            Appointment ID: {appointment.id} • Created:{" "}
                            {new Date(appointment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Print Footer */}
          <div className="print-only mt-8 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Medical Representative Appointment System • Confidential Document
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
