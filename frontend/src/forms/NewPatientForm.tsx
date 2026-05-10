'use client'

import { FormEvent, useState } from "react"
import { UserPlus } from "lucide-react"
import { DropdownSelect } from "@/components/custom-ui/dropdown"
import { useCreatePatient } from "@/hooks/usePatients"

type NewPatientValues = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "" | "Female" | "Male" | "Other";
  address: string;
};
const initialValues: NewPatientValues = {
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  address: "",
};

type NewPatientFormProps = {
  isOpen: boolean;
};

export function NewPatientForm({ isOpen }: NewPatientFormProps) {
  const [values, setValues] = useState<NewPatientValues>(initialValues)
  const { mutateAsync, isPending, isError, error, reset } = useCreatePatient()

  const handleChange = <K extends keyof NewPatientValues>(key: K, value: NewPatientValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value}))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    reset()
    try {
      await mutateAsync({
        fullName: values.fullName.trim(),
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        birthDate: values.birthDate || undefined,
      })
      setValues(initialValues)
    } catch {
      // Error is available via isError / error for display
    }
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
          <UserPlus size={16} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">Add Patient</h2>
          <p className="text-xs text-(--soft-text)">Fill patient basic information</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Full Name</span>
          <input
            type="text"
            value={values.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
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
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="example@email.com"
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
          <span className="text-xs font-semibold text-slate-600">Date of Birth</span>
          <input
            type="date"
            value={values.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            className="h-10 px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Gender</span>
          <DropdownSelect
            value={values.gender}
            onChange={(e) => handleChange("gender", e.target.value as NewPatientValues["gender"])}
            placeholder="Select gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            triggerClassName="h-10 w-full px-3 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 justify-between"
            contentClassName="w-full"
          />
        </label>
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-xs font-semibold text-slate-600">Address</span>
          <textarea
            rows={3}
            value={values.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Patient address"
            className="px-3 py-2 rounded-[10px] border border-(--border) bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
            required
          />
        </label>
        <div className="md:col-span-2 flex flex-col items-end gap-2 pt-1">
          {isError && (
            <p className="w-full text-right text-sm text-red-600" role="alert">
              {error?.message ?? "Could not save patient."}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                reset()
                setValues(initialValues)
              }}
              disabled={isPending}
              className="h-10 px-4 rounded-[10px] border border-(--border) text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-4 rounded-[10px] bg-[#4acf7f] text-white text-sm font-semibold hover:bg-[#3fbe72] transition-colors disabled:opacity-60 disabled:pointer-events-none"
            >
              {isPending ? "Saving…" : "Save Patient"}
            </button>
          </div>
        </div>
      </form>
    </section>
    </div>
    </div>
  )
}