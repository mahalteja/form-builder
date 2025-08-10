import type { FieldSchema } from "../types";

export function evaluateDerivedField(
  field: FieldSchema,
  allValues: Record<string, any>
): any {
  if (!field.derived) return allValues[field.id];
  try {
    // Build object of parent field values
    const parentValues: Record<string, any> = {};
    field.derived.parents.forEach(pid => {
      parentValues[pid] = allValues[pid];
    });

    // Dynamically evaluate formula
    // ⚠️ In production, a safer parser should be used instead of eval/new Function
    const fn = new Function("parentValues", `return ${field.derived!.formula};`);
    return fn(parentValues);
  } catch (err) {
    console.error("Error evaluating derived field:", err);
    return "";
  }
}
