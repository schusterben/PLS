import { page1FieldSchema, type Page1FieldSpec, type Page1FieldType, type Page1ZoneId } from './page1FieldSchema';
import { page1FieldRegistry, getPage1FieldsByType, getPage1FieldsByZone } from './page1FieldRegistry';

export function resolvePage1FieldBinding(field: Page1FieldSpec) {
  const bucket = page1FieldRegistry[field.type as keyof typeof page1FieldRegistry];
  const schemaFields = getPage1FieldsByType(field.type, page1FieldSchema);

  return {
    type: field.type as Page1FieldType,
    bind: field.bind,
    label: field.label,
    schemaFields,
    bucket,
  };
}

export function resolvePage1ZoneBindings(zoneId: Page1ZoneId) {
  return getPage1FieldsByZone(zoneId, page1FieldSchema);
}
