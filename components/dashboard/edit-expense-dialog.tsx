"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DailyExpense } from "@/lib/types/expense"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from "react"

const DAYS = [
    { value: '0', label: 'S' },
    { value: '1', label: 'M' },
    { value: '2', label: 'T' },
    { value: '3', label: 'W' },
    { value: '4', label: 'T' },
    { value: '5', label: 'F' },
    { value: '6', label: 'S' },
  ];
  

const formSchema = z.object({
  description: z.string().min(1),
  amount: z.string().min(1),
  recurringDays: z.array(z.number())
})

interface EditExpenseDialogProps {
  expense: DailyExpense;
  onSubmit: (data: any) => void;
}

export function EditExpenseDialog({ expense, onSubmit }: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: expense.description,
      amount: expense.amount.toString(),
      recurringDays: expense.recurringDays
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await onSubmit(data)
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Daily Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recurringDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurring Days</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      value={field.value.map(String)}
                      onValueChange={(value) => {
                        field.onChange(value.map(Number));
                      }}
                      className="justify-start"
                    >
                      {DAYS.map((day) => (
                        <ToggleGroupItem
                          key={day.value}
                          value={day.value}
                          aria-label={`Toggle ${day.label}`}
                          className="w-8"
                        >
                          {day.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
