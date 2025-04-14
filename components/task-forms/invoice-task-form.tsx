"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InvoiceTaskForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invoice-number">Invoice Number</Label>
        <Input id="invoice-number" placeholder="e.g., INV-2023-042" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor/Supplier</Label>
          <Input id="vendor" placeholder="Company name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice-date">Invoice Date</Label>
          <Input id="invoice-date" type="date" />
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
        <Label htmlFor="due-date">Due Date</Label>
        <Input id="due-date" type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-type">Invoice Type</Label>
        <Select>
          <SelectTrigger id="invoice-type">
            <SelectValue placeholder="Select invoice type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Invoice details" />
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
