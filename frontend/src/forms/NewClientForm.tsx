'use client'

import { FormEvent, useState } from "react"
import { Building2 } from "lucide-react"
import { DropdownSelect } from "../components/custom-ui/dropdown"

type NewClientValues = {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  status: '' | 'Active' | 'Inactive'
  address: string
}

const initialValues: NewClientValues = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  status: '',
  address: ''
}

export function NewClientForm() {
  const [values, setValues] = useState<NewClientValues>(initialValues)

  const handleChange = <K extends keyof NewClientValues>(key: K, value: NewClientValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Client payload:', values);
    // to do
  }

  return (
    <section className="border border-(--border) rounded-[14px] bg-(--panel) p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-8 h-8 rounded-full bg-[#edfaf3] text-[#4acf7f] flex items-center justify-center">
          <Building2 size={16} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">Add Client</h2>
          <p className="text-xs text-(--soft-text)">Fill client basic information</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Company Name</span>
          <input
            type="text"
            value={values.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Acme Healthcare LLC"
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Contact Person</span>
          <input
            type="text"
            value={values.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
            placeholder="John Doe"
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="client@example.com"
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Phone</span>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+998 90 000 00 00"
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Status</span>
          <DropdownSelect
            value={values.status}
            onChange={(e) => handleChange("status", e.target.value as NewClientValues["status"])}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
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
            rows={3}
            value={values.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Client address"
            className="px-3 py-2 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
        <div className="md:col-span-2 flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => setValues(initialValues)}
            className="h-10 px-4 rounded-[10px] border border-(--border) text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            className="h-10 px-4 rounded-[10px] bg-[#4acf7f] text-white text-sm font-semibold hover:bg-[#3fbe72] transition-colors"
          >
            Save Client
          </button>
        </div>
      </form>
    </section>
  )
}