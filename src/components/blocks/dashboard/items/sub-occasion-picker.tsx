import { AdminContext } from "@/components/providers/contexts/admin-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubOccasionService from "@/lib/api/SubOccasionService";
import { useContext, useEffect } from "react";

export function SubOccasionPicker({
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof Select>) {

  const context = useContext(AdminContext);

  useEffect(() => {
    if (context.subOccasions == null) {
      context.set.subOccasions([]);
      SubOccasionService.list().then(({data}) => {
        context.set.subOccasions(data);
      }).catch();
    }
  }, [])

  console.log(props.value);

  return (
    <Select disabled={disabled || !context.subOccasions} {...props}>
      <SelectTrigger className="w-[180px]"> 
        <SelectValue placeholder="Select item..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {
            !!context.subOccasions && context.subOccasions.map(item => {
              const id = item._id ?? item.id ?? "";
              return <SelectItem key={id} value={id}>{item.name}</SelectItem>
            })
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
