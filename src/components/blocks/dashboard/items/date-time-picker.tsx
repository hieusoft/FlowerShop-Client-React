import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { ChangeEvent, useState } from "react"

export function DateTimePicker(
    { value, onValueChange, disabled }: {
        value: Date,
        onValueChange: (value: Date) => void,
        disabled?: boolean
    }
) {
    const [open, setOpen] = useState(false)

    function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
        const time = e.target.value.split(":");
        const newDate = new Date(value);
        newDate.setHours(+time[0]);
        newDate.setMinutes(+time[1]);
        newDate.setSeconds(+time[2]);
        onValueChange(newDate);
    }

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="flex-1 justify-between font-normal"
                        disabled={disabled}
                    >
                        {value ? value.toLocaleDateString("en-US") : "Select date"}
                        <CalendarIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        startMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
                        endMonth={new Date(new Date().getFullYear() + 5, new Date().getMonth())}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            onValueChange(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Input
                type="time"
                id="time-picker"
                step="1"
                value={value.toLocaleTimeString("en-US", {
                    hour12: false,
                })}
                onChange={handleTimeChange}
                disabled={disabled}
                className="w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
        </div>
    )
}