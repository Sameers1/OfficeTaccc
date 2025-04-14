"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ShipmentTaskForm() {
  const [shipmentType, setShipmentType] = useState("sea")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Shipment Type</Label>
        <RadioGroup defaultValue="sea" className="flex space-x-4" onValueChange={setShipmentType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sea" id="sea" />
            <Label htmlFor="sea">Sea</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="air" id="air" />
            <Label htmlFor="air">Air</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="land" id="land" />
            <Label htmlFor="land">Land</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shipment-id">Shipment ID</Label>
        <Input id="shipment-id" placeholder="e.g., SH-2023-001" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input id="origin" placeholder="City, Country" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input id="destination" placeholder="City, Country" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure-date">Departure Date</Label>
          <Input id="departure-date" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arrival-date">Expected Arrival Date</Label>
          <Input id="arrival-date" type="date" />
        </div>
      </div>

      {shipmentType === "sea" && (
        <div className="space-y-2">
          <Label htmlFor="container-type">Container Type</Label>
          <Select>
            <SelectTrigger id="container-type">
              <SelectValue placeholder="Select container type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20ft">20ft Standard</SelectItem>
              <SelectItem value="40ft">40ft Standard</SelectItem>
              <SelectItem value="40hc">40ft High Cube</SelectItem>
              <SelectItem value="reefer">Reefer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {shipmentType === "air" && (
        <div className="space-y-2">
          <Label htmlFor="airline">Airline</Label>
          <Input id="airline" placeholder="Airline name" />
        </div>
      )}

      {shipmentType === "land" && (
        <div className="space-y-2">
          <Label htmlFor="carrier">Carrier</Label>
          <Input id="carrier" placeholder="Carrier name" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="cargo-description">Cargo Description</Label>
        <Textarea id="cargo-description" placeholder="Describe the cargo contents" />
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
