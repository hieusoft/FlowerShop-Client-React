import { AdminContext } from "@/components/providers/contexts/admin-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OccasionService from "@/lib/api/OccasionService";
import { useContext, useEffect } from "react";

export function OccasionPicker({
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof Select>) {

  const context = useContext(AdminContext);

  useEffect(() => {
    if (context.occasions == null) {
      context.set.occasions([]);
      OccasionService.list().then(({data}) => {
        context.set.occasions(data);
      }).catch();
    }
  }, [])

  console.log(props.value);

  return (
    <Select disabled={disabled || !context.occasions} {...props}>
      <SelectTrigger className="w-[180px]"> 
        <SelectValue placeholder="Select item..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {
            !!context.occasions && context.occasions.map(item => {
              const id = item.id ?? "";
              return <SelectItem key={id} value={id}>{item.name}</SelectItem>
            })
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
