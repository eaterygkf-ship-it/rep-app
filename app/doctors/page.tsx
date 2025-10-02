"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, MapPin, Phone, Mail, Building2, Stethoscope, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getDoctors } from "@/lib/storage"

export default function DoctorsPage() {
  const doctors = getDoctors()
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")

  // Get unique specialties
  const specialties = useMemo(() => {
    const unique = Array.from(new Set(doctors.map((d) => d.specialty)))
    return unique.sort()
  }, [doctors])

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        searchQuery === "" ||
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSpecialty = specialtyFilter === "all" || doctor.specialty === specialtyFilter

      return matchesSearch && matchesSpecialty
    })
  }, [doctors, searchQuery, specialtyFilter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Doctors Directory</h1>
          <p className="text-slate-600">Browse and search for doctors to schedule appointments</p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name, hospital, or specialty..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Stethoscope className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No doctors found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 text-balance">{doctor.name}</h3>
                      <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                        <Stethoscope className="w-3 h-3 mr-1" />
                        {doctor.specialty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-pretty">{doctor.hospital}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-pretty">{doctor.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{doctor.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doctor.email}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link href={`/book-appointment?doctorId=${doctor.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
