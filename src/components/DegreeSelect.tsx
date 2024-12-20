import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { getDegreesByCategory } from "@/data/degreePrograms";

interface DegreeSelectProps {
  form: UseFormReturn<any>;
}

export function DegreeSelect({ form }: DegreeSelectProps) {
  const categorizedDegrees = getDegreesByCategory();

  return (
    <FormField
      control={form.control}
      name="degreeProgram"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Degree Program</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a degree program" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px]">
              {Array.from(categorizedDegrees.entries()).map(([_, subcategories]) => (
                Array.from(subcategories.entries()).map(([subcategory, programs]) => (
                  <SelectGroup key={subcategory}>
                    <SelectLabel className="font-bold">{subcategory}</SelectLabel>
                    {programs.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              )).flat()}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}