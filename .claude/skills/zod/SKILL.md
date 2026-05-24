---
name: zod-form
description: >
  Scaffold a complete form in the Yo'lDosh / AutoGuide CRM frontend: Zod schema in
  src/validators/, typed FormData, useForm wiring with zodResolver, and a form component
  using shadcn Form + custom-ui inputs (Input, NumberInput, PhoneInput, DateInput, Select).
  Use this skill whenever the user says "add a form", "create a form for X", "new dialog
  with inputs", "form schema for Y", "validate this form", or wants to collect and submit
  any structured data in the CRM. Also use when adding cross-field validation (.refine),
  dependent selects, or date relationship rules to an existing form. Covers simple forms,
  multi-field dialogs, and search forms. Always follow this skill — never guess the
  wiring pattern from memory.
---

# Zod Form Skill

## Project conventions (never deviate)

| Concern | Convention |
|---|---|
| Schema location | `src/validators/<resource>.ts` — one file per resource |
| Form component location | Colocated with the page/dialog that uses it |
| Validation mode | `mode: 'onChange'` always |
| Resolver | `zodResolver` from `@hookform/resolvers/zod` |
| Error language | **Russian** for all `.message` strings |
| Required field label suffix | ` *` appended to `<FormLabel>` text |
| Label style | `className="text-[14px] text-[#334155]"` on required fields |
| Grid layout | `<div className="grid grid-cols-2 gap-4">` for most forms |
| Optional string fields | `.optional().or(z.literal(''))` — never just `.optional()` |
| Enum fields | `z.nativeEnum(MyEnum).default(MyEnum.DEFAULT_VALUE)` |
| Exported type | `export type <Name>FormData = z.infer<typeof <name>Schema>` |

---

## Layer 1 — Schema (`src/validators/<resource>.ts`)

```ts
import { z } from 'zod'
import { MyStatusEnum } from '@/types/<resource>'

// ── Field-level regexes (define at top of file) ───────────────────────────
const PHONE_REGEX = /^\+998[0-9]{9}$/

export const create<Resource>Schema = z
  .object({
    // Required string
    name: z
      .string({ required_error: 'Обязательное поле' })
      .min(1, 'Обязательное поле')
      .min(2, 'Минимум 2 символа')
      .max(100, 'Максимум 100 символов'),

    // Required with regex
    phone: z
      .string({ required_error: 'Обязательное поле' })
      .min(1, 'Номер телефона обязателен')
      .regex(PHONE_REGEX, 'Формат: +998XXXXXXXXX'),

    // Required date string (DD.MM.YYYY)
    startDate: z
      .string({ required_error: 'Обязательное поле' })
      .min(1, 'Дата обязательна')
      .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Формат даты: ДД.ММ.ГГГГ'),

    // Optional string — ALWAYS use .optional().or(z.literal(''))
    email: z.string().email('Введите корректный email').optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),

    // Optional foreign key (select field)
    regionId: z.string().optional().or(z.literal('')),

    // Enum with default
    status: z.nativeEnum(MyStatusEnum).default(MyStatusEnum.ACTIVE),
  })
  // Cross-field validation — use .refine() chained on the object
  .refine(
    (data) => {
      // example: endDate must be after startDate
      if (!data.startDate || !data.endDate) return true
      return new Date(data.endDate) > new Date(data.startDate)
    },
    {
      message: 'Дата окончания должна быть позже даты начала',
      path: ['endDate'], // path points to the field that shows the error
    },
  )

export type Create<Resource>FormData = z.infer<typeof create<Resource>Schema>
```

### Schema rules

- Always chain `.refine()` on the `.object()`, never inside individual fields.
- Cross-field date validation: parse with a helper, return `true` if either value is empty (don't block submit with partial data).
- Each `.refine()` gets its own `path` pointing to the field that should show the error.
- For "either A or (B and C)" required logic, use `.refine()` with a clear Russian message and `path: ['firstField']`.
- `required_error` fires when the field is `undefined`; `.min(1, ...)` fires when it's an empty string — always include both for required fields.

### Common field patterns (copy-paste)

```ts
// PINFL (14 digits)
pinfl: z.string({ required_error: 'Обязательное поле' })
  .min(1, 'ПИНФЛ обязателен')
  .regex(/^[0-9]{14}$/, 'ПИНФЛ должен содержать 14 цифр'),

// Passport series (2 uppercase letters)
passportSeries: z.string({ required_error: 'Обязательное поле' })
  .min(1, 'Серия обязательна')
  .regex(/^[A-Z]{2}$/, 'Серия: 2 заглавные буквы'),

// Passport number (7 digits)
passportNumber: z.string({ required_error: 'Обязательное поле' })
  .min(1, 'Номер обязателен')
  .regex(/^[0-9]{7}$/, 'Номер: 7 цифр'),

// Uzbek phone
phone: z.string({ required_error: 'Обязательное поле' })
  .min(1, 'Телефон обязателен')
  .regex(/^\+998[0-9]{9}$/, 'Формат: +998XXXXXXXXX'),

// Optional email
email: z.string().email('Введите корректный email').optional().or(z.literal('')),

// DD.MM.YYYY date
someDate: z.string({ required_error: 'Обязательное поле' })
  .min(1, 'Дата обязательна')
  .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Формат даты: ДД.ММ.ГГГГ'),

// Foreign key (select)
branchId: z.string({ required_error: 'Обязательное поле' }).min(1, 'Выберите филиал'),

// Optional foreign key
regionId: z.string().optional().or(z.literal('')),
```

---

## Layer 2 — Default values helper

Always define a `getDefaultValues` function **outside** the component:

```ts
const getDefaultValues = (
  initialValues?: Partial<Create<Resource>FormData>,
): Create<Resource>FormData => ({
  name:      initialValues?.name      || '',
  phone:     initialValues?.phone     || '',
  startDate: initialValues?.startDate || '',
  email:     initialValues?.email     || '',
  address:   initialValues?.address   || '',
  regionId:  initialValues?.regionId  || '',
  status:    initialValues?.status    || MyStatusEnum.ACTIVE,
})
```

Rules:
- Every field must have an explicit default — never omit a field.
- Enums default to the "active/default" variant, not empty string.
- Boolean fields default to `false`.
- Array fields default to `[]`.

---

## Layer 3 — Form component

### `useForm` setup

```ts
const form = useForm<Create<Resource>FormData>({
  resolver: zodResolver(create<Resource>Schema),
  defaultValues: getDefaultValues(initialValues),
  mode: 'onChange',   // always onChange, never onBlur or onSubmit
})
```

### Reset on open (dialogs)

```ts
useEffect(() => {
  if (open) {
    form.reset(getDefaultValues(initialValues))
  }
}, [open, initialValues, form])
```

### Submit handler

```ts
const onSubmit = (data: Create<Resource>FormData) => {
  mutate(data, {
    onSuccess: (created) => {
      onCreated?.(created, data)
      setOpen(false)
      form.reset(getDefaultValues())
    },
  })
}
```

Never put toast calls in `onSubmit` — they belong in the mutation hook (`onSuccess`/`onError`).

### Close handler

```ts
const handleClose = () => {
  setOpen(false)
  form.reset(getDefaultValues())
  onCancel?.()
}
```

---

## Layer 4 — FormField patterns

Wrap the entire form in `<Form {...form}>` (which is `FormProvider`), then `<form onSubmit={form.handleSubmit(onSubmit)}>`.

### Plain text input

```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[14px] text-[#334155]">Название *</FormLabel>
      <FormControl>
        <Input {...field} placeholder="Ввести" className="w-full" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Letters-only input (names, series)

```tsx
const lettersOnly = (value: string) =>
  value.replace(/[^\p{L}\s\p{P}]/gu, '').toUpperCase()

<FormField
  control={form.control}
  name="lastName"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[14px] text-[#334155]">Фамилия *</FormLabel>
      <FormControl>
        <Input
          {...field}
          placeholder="Ввести"
          className="w-full"
          onChange={(e) => field.onChange(lettersOnly(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### NumberInput (digits only — PINFL, passport number, amounts)

```tsx
<FormField
  control={form.control}
  name="pinfl"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[14px] text-[#334155]">ПИНФЛ *</FormLabel>
      <FormControl>
        <NumberInput
          value={field.value}
          onChange={field.onChange}
          decimalPlaces={0}
          placeholder="00000000000000"
          className="w-full"
          maxLength={14}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Use `decimalPlaces={2}` for money fields.

### PhoneInput

```tsx
<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[14px] text-[#334155]">Номер телефона *</FormLabel>
      <FormControl>
        <PhoneInput value={field.value} onChange={field.onChange} className="w-full" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### DateInput (DD.MM.YYYY)

```tsx
<FormField
  control={form.control}
  name="startDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[14px] text-[#334155]">Дата начала *</FormLabel>
      <FormControl>
        <DateInput
          value={field.value}
          onChange={(value) => {
            field.onChange(value)
            form.trigger('startDate')  // re-validate on change
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

For cross-validated date pairs (e.g. issue date must be after birth date), trigger the **dependent** field when the **source** field changes:

```tsx
// In birthDate field onChange:
onChange={(value) => {
  field.onChange(value)
  if (form.getValues('passportStartDate')) {
    form.trigger('passportStartDate')   // re-run refine that depends on birthDate
  }
}}

// In passportStartDate field onChange:
onChange={(value) => {
  field.onChange(value)
  form.trigger('passportStartDate')
}}
```

### Select (custom-ui — for API-driven options)

```tsx
<FormField
  control={form.control}
  name="regionId"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[14px] text-[#334155]">Регион</FormLabel>
      <FormControl>
        <Select
          value={field.value}
          onChange={(value) => {
            field.onChange(value)
            form.setValue('districtId', '')  // reset dependent field
          }}
          options={regionsOptions}
          loading={isLoadingRegions}
          placeholder="Выберите регион"
          className="w-full"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Dependent select (disabled until parent selected):

```tsx
<Select
  value={field.value}
  onChange={field.onChange}
  options={districtsOptions}
  loading={isLoadingDistricts}
  disabled={!selectedRegionId}   // form.watch('regionId')
  placeholder="Выберите район"
  className="w-full"
/>
```

### Select (shadcn — for static/enum options)

```tsx
<FormField
  control={form.control}
  name="source"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[14px] text-[#334155]">Источник</FormLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <FormControl>
          <SelectTrigger className="h-9 w-full text-xs text-[#334155]">
            <SelectValue placeholder="Выбрать" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="INTERNAL">Внутренний</SelectItem>
          <SelectItem value="EXTERNAL">Внешний</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Layer 5 — Submit button

```tsx
<Button type="submit" disabled={isPending}>
  {isPending ? (
    <>
      Сохранение... <Loader2 className="h-4 w-4 animate-spin" />
    </>
  ) : (
    submitLabel   // prop, default 'Сохранить' or 'Далее'
  )}
</Button>
```

Cancel button (inside Radix Dialog):

```tsx
<Dialog.Close asChild>
  <Button type="button" variant="ghost" onClick={handleClose}>
    Отменить
  </Button>
</Dialog.Close>
```

---

## Dialog shell

Always use `@radix-ui/react-dialog` directly (not shadcn's `<Dialog>`):

```tsx
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <Dialog.Content className="fixed top-1/2 left-1/2 z-[51] max-h-[90vh] w-[95vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md bg-white p-6 shadow-lg">
      <Dialog.Title className="mb-4 text-lg font-semibold">Заголовок</Dialog.Title>
      {/* form goes here */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

## Component props interface (standard shape)

```ts
interface <Resource>FormDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialValues?: Partial<Create<Resource>FormData>
  onCreated?: (created: ServerCreated, submitted: Create<Resource>FormData) => void
  submitMode?: 'create' | 'continue'
  onContinue?: () => void
  onCancel?: () => void
  submitLabel?: string
}
```

---

## Checklist

- [ ] Schema in `src/validators/<resource>.ts` with Russian error messages
- [ ] `export type <Name>FormData = z.infer<typeof ...>` at bottom of schema file
- [ ] `getDefaultValues()` helper defined outside component, covers every field
- [ ] `useForm` with `zodResolver`, `mode: 'onChange'`
- [ ] `useEffect` reset on `open` change (dialogs)
- [ ] Every `FormField` has `FormItem > FormLabel > FormControl > [input] > FormMessage`
- [ ] Required labels have ` *` suffix and `className="text-[14px] text-[#334155]"`
- [ ] Cross-validated date fields call `form.trigger()` on each other's change
- [ ] Dependent selects reset child on parent change via `form.setValue`
- [ ] Submit button shows `isPending` spinner + Russian loading text
- [ ] `onSubmit` does NOT call toast — mutation hook handles it
- [ ] `handleClose` resets form to `getDefaultValues()`
