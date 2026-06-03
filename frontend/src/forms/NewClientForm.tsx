'use client'

import { FormEvent, useState } from "react"
import { Building2 } from "lucide-react"
import { DropdownSelect } from "../components/custom-ui/dropdown"
import { useCreateClient } from "../hooks/useClients"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type NewClientFormValues = {
  contactPerson: string
  companyName: string
  email: string
  phone: string
  status: '' | 'active' | 'inactive'
  address: string
}

const initialValues: NewClientFormValues = {
  contactPerson: '',
  companyName: '',
  email: '',
  phone: '',
  status: '',
  address: '',
}

type NewClientFormProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewClientForm({ isOpen, onClose }: NewClientFormProps) {
  const [values, setValues] = useState<NewClientFormValues>(initialValues)
  const createClient = useCreateClient()

  const handleChange = <K extends keyof NewClientFormValues>(key: K, value: NewClientFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createClient.mutateAsync({
      fullName: values.contactPerson,
      email: values.email,
      number: values.phone,
      organization: values.companyName || undefined,
      address: values.address || undefined,
      status: values.status || 'active',
    })
    setValues(initialValues)
    onClose()
  }

  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isOpen
          ? "grid-rows-[1fr] opacity-100 translate-y-0"
          : "grid-rows-[0fr] opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
    <div className="overflow-hidden">
    <section className="border border-(--border) rounded-[14px] bg-(--panel) p-5 md:p-6 mb-0.5">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-8 h-8 rounded-full bg-[#edfaf3] text-[#4acf7f] flex items-center justify-center">
          <Building2 size={16} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">Add Client</h2>
          <p className="text-xs text-(--soft-text)">Fill client basic information</p>
        </div>
      </div>

      {createClient.isError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {createClient.error?.message ?? 'Failed to create client. Please try again.'}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Contact Person</span>
          <Input
            value={values.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
            placeholder="John Doe"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Company Name</span>
          <Input
            value={values.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Acme Healthcare LLC"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Email</span>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="client@example.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Phone</span>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+998 90 000 00 00"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Status</span>
          <DropdownSelect
            value={values.status}
            onChange={(e) => handleChange("status", e.target.value as NewClientFormValues["status"])}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            placeholder="Select status"
            aria-label="Client status"
            triggerClassName="h-10 w-full px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700"
            contentClassName="w-full"
            itemClassName="text-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-xs font-semibold text-slate-600">Address</span>
          <textarea
            rows={1}
            value={values.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Client address"
            className="px-3 py-2 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
          />
        </label>
        <div className="md:col-span-2 flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => { setValues(initialValues); onClose(); }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="md"
            disabled={createClient.isPending}
          >
            {createClient.isPending ? 'Saving…' : 'Save Client'}
          </Button>
        </div>
      </form>
    </section>
    </div>
    </div>
  )
}
