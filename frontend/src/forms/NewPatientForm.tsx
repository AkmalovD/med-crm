'use client'

import { FormEvent, useState } from "react"
import { UserPlus } from "lucide-react"

type NewPatientValues = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "" | "Female" | "Male" | "Other";
  address: string;
};
const initialValues: NewPatientValues = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
};

export function NewPatientCard() {
  const [values, setValues] = useState<NewPatientValues>(initialValues)

  return (
    <section className="border rounded-[14px] bg-(--panel) p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-8 h-8 rounded-full bg-[#edfaf3] text-[#4acf7f] flex items-center justify-center">
          <UserPlus size={16} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">Add Patient</h2>
          <p className="text-xs text-(soft-text)">Fill patient basic information</p>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={ }>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Full Name</span>
          <input
            type="text"
            value={values.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Ivan Ivanov"
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Email</span>
          <input 
            type="email" 
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email"
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Phone</span>
          <input 
            type="text"
            value={values.phone}
            onChange={(e) => handelChange("phone", e.target.value)}
            placeholder="+ 998 90 000 00 00"
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Phone</span>
          <input 
            type="date"
            value={values.birthDate}
            onChange={(e) => handelChange("birthDate", e.target.value)}
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
      </form>
    </section>
  )
}