import { Button } from "@/components/ui/Button";

/** Submit button used inside every tool's input form. */
export function CalculateButton({ label = "Calculate" }: { label?: string }) {
  return (
    <div className="pt-2">
      <Button type="submit">{label}</Button>
    </div>
  );
}
