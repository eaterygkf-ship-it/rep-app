"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, Clock, User, Phone, Mail, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDoctors, saveAppointment, type Appointment } from "@/lib/storage"

export default function BookAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctors = getDoctors()

  const [formData, setFormData] = useState({
    repName: "",
    repCompany: "",
    repPhone: "",
    repEmail: "",
    doctorId: "",
    date: "",
    time: "",
    purpose: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const doctorId = searchParams.get("doctorId")
    if (doctorId) {
      setFormData((prev) => ({ ...prev, doctorId }))
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const selectedDoctor = doctors.find((d) => d.id === formData.doctorId)

    const appointment: Appointment = {
      id: Date.now().toString(),
      repName: formData.repName,
      repCompany: formData.repCompany,
      repPhone: formData.repPhone,
      repEmail: formData.repEmail,
      doctorId: formData.doctorId,
      doctorName: selectedDoctor?.name || "",
      date: formData.date,
      time: formData.time,
      purpose: formData.purpose,
      notes: formData.notes,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    saveAppointment(appointment)

    setTimeout(() => {
      router.push("/appointments")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Book New Appointment</h1>
          <p className="text-slate-600">Schedule a visit with a doctor</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Medical Representative Details
              </CardTitle>
              <CardDescription>Your contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repName">Full Name *</Label>
                  <Input
                    id="repName"
                    placeholder="John Doe"
                    required
                    value={formData.repName}
                    onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repCompany">Company *</Label>
                  <Input
                    id="repCompany"
                    placeholder="Pharma Corp"
                    required
                    value={formData.repCompany}
                    onChange={(e) => setFormData({ ...formData, repCompany: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repPhone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="repPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="pl-10"
                      required
                      value={formData.repPhone}
                      onChange={(e) => setFormData({ ...formData, repPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repEmail">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="repEmail"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                      value={formData.repEmail}
                      onChange={(e) => setFormData({ ...formData, repEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-cyan-600" />
                Appointment Details
              </CardTitle>
              <CardDescription>Select doctor and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor *</Label>
                <Select
                  required
                  value={formData.doctorId}
                  onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                >
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{doctor.name}</span>
                          <span className="text-xs text-slate-500">
                            {doctor.specialty} - {doctor.hospital}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Appointment Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="time"
                      type="time"
                      className="pl-10"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Input
                  id="purpose"
                  placeholder="Product presentation, follow-up, etc."
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or information..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-6">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
