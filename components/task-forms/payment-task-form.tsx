"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function PaymentTaskForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="payment-id">Payment ID</Label>
        <Input id="payment-id" placeholder="e.g., PAY-2023-015" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-reference">Invoice Reference</Label>
        <Input id="invoice-reference" placeholder="Related invoice number" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payee">Payee</Label>
          <Input id="payee" placeholder="Company or individual name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment-date">Payment Date</Label>
          <Input id="payment-date" type="date" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select defaultValue="usd">
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
              <SelectItem value="jpy">JPY</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <RadioGroup defaultValue="bank-transfer" className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
            <Label htmlFor="bank-transfer">Bank Transfer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card">Credit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="check" id="check" />
            <Label htmlFor="check">Check</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other-payment" />
            <Label htmlFor="other-payment">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-details">Payment Details</Label>
        <Textarea id="payment-details" placeholder="Additional payment information" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assign To</Label>
        <Select>
          <SelectTrigger id="assignee">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="john">John Smith</SelectItem>
            <SelectItem value="sarah">Sarah Johnson</SelectItem>
            <SelectItem value="emily">Emily Davis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select defaultValue="medium">
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
