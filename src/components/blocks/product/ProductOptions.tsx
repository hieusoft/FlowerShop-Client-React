import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface ProductOptionsProps {
  options: ProductOption[];
  selectedOptions: Record<string, string>;
  onOptionChange: (optionId: string, value: string) => void;
}

export default function ProductOptions({
  options,
  selectedOptions,
  onOptionChange,
}: ProductOptionsProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id} className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            {option.name}
            <span className="text-sm font-normal text-muted-foreground">
              (Required)
            </span>
          </Label>
          <RadioGroup
            value={selectedOptions[option.id]}
            onValueChange={(value) => onOptionChange(option.id, value)}
            className="flex flex-wrap gap-3"
          >
            {option.values.map((value, idx) => (
              <div key={idx} className="relative">
                <RadioGroupItem
                  value={value}
                  id={`${option.id}-${idx}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`${option.id}-${idx}`}
                  className={`
                    cursor-pointer border-2 rounded-lg px-4 py-3
                    transition-all duration-200 flex items-center justify-center
                    min-w-[100px]
                    peer-data-[state=checked]:border-primary
                    peer-data-[state=checked]:bg-primary/5
                    peer-data-[state=checked]:ring-2
                    peer-data-[state=checked]:ring-primary/20
                    hover:border-muted-foreground/30
                    hover:bg-muted/50
                  `}
                >
                  {value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}