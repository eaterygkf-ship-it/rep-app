// Client-side storage utilities for appointments and doctors

export interface Doctor {
  id: string
  name: string
  specialty: string
  hospital: string
  phone: string
  email: string
  address: string
}

export interface Appointment {
  id: string
  repName: string
  repCompany: string
  repPhone: string
  repEmail: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  purpose: string
  notes: string
  status: "scheduled" | "completed" | "cancelled"
  createdAt: string
}

// Sample doctors data
const sampleDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    hospital: "City General Hospital",
    phone: "(555) 123-4567",
    email: "sarah.johnson@hospital.com",
    address: "123 Medical Center Dr, Suite 200",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Orthopedics",
    hospital: "Regional Medical Center",
    phone: "(555) 234-5678",
    email: "michael.chen@rmc.com",
    address: "456 Healthcare Blvd, Floor 3",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    hospital: "Children's Hospital",
    phone: "(555) 345-6789",
    email: "emily.rodriguez@childrens.com",
    address: "789 Kids Care Ave, Building A",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Neurology",
    hospital: "University Medical Center",
    phone: "(555) 456-7890",
    email: "james.wilson@umc.edu",
    address: "321 University Way, Tower B",
  },
  {
    id: "5",
    name: "Dr. Lisa Anderson",
    specialty: "Dermatology",
    hospital: "Skin Care Clinic",
    phone: "(555) 567-8901",
    email: "lisa.anderson@skincare.com",
    address: "654 Wellness St, Suite 100",
  },
]

export function getDoctors(): Doctor[] {
  if (typeof window === "undefined") return sampleDoctors

  const stored = localStorage.getItem("doctors")
  if (!stored) {
    localStorage.setItem("doctors", JSON.stringify(sampleDoctors))
    return sampleDoctors
  }
  return JSON.parse(stored)
}

export function getDoctor(id: string): Doctor | undefined {
  return getDoctors().find((d) => d.id === id)
}

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("appointments")
  return stored ? JSON.parse(stored) : []
}

export function saveAppointment(appointment: Appointment): void {
  const appointments = getAppointments()
  appointments.push(appointment)
  localStorage.setItem("appointments", JSON.stringify(appointments))
}

export function updateAppointment(id: string, updates: Partial<Appointment>): void {
  const appointments = getAppointments()
  const index = appointments.findIndex((a) => a.id === id)
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates }
    localStorage.setItem("appointments", JSON.stringify(appointments))
  }
}

export function deleteAppointment(id: string): void {
  const appointments = getAppointments().filter((a) => a.id !== id)
  localStorage.setItem("appointments", JSON.stringify(appointments))
}
