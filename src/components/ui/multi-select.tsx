import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ReactNode, useState } from "react"
import { Badge } from "./badge"
import { ChevronDownIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "./button"

export function MultiSelect<T extends number | string>(
    { value, onValueChange, options } : {
        value: T[],
        onValueChange: (value: T[]) => {},
        options: { value: T, label?: ReactNode }[]
    }
) {
    const optionsByValue: Record<T, typeof options[number]> = Object.fromEntries(options.map(x => [x.value, x])) as Record<T, typeof options[number]>;
    const [uniqueKey] = useState(Math.random().toString().substring(2))
    const valueSet = value instanceof Set ? value : new Set(value)

    function handleValueChange(key: T, selected: boolean) {
        let newValueSet = new Set(valueSet);
        if (selected) {
            newValueSet.add(key);
        } else {
            newValueSet.delete(key);
        }
        console.log(key, newValueSet);
        onValueChange([...newValueSet]);
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" className="border-input bg-background w-full flex gap-4 h-auto min-h-10 py-2s">
                    <span  className="flex flex-wrap flex-1 gap-2">
                        {
                            value.map((item, index) => (
                                <Badge variant="secondary" key={index}>
                                    {optionsByValue[item].label || optionsByValue[item].value}
                                </Badge>
                            ))
                        }
                    </span>
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                    <div className="flex flex-col gap-3">
                {
                        options.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <Checkbox 
                                    checked={valueSet.has(item.value)}
                                    onCheckedChange={(checked) => handleValueChange(item.value, !!checked)}
                                    id={`multi-select-${uniqueKey}-checkbox-${index}`}></Checkbox>
                                <label 
                                    htmlFor={`multi-select-${uniqueKey}-checkbox-${index}`}
                                >
                                    {item.label || item.value}
                                </label>
                            </div>
                        ))
                }
                    </div>
            </PopoverContent>
        </Popover>
    )
}