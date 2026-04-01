import { page1FieldSchema, type Page1FieldSpec, type Page1FieldType, type Page1ZoneId } from './page1FieldSchema';

export interface Page1FieldComponentBinding {
  type: Page1FieldType;
  schemaFields: Page1FieldSpec[];
}

export const page1FieldRegistry = page1FieldSchema.reduce<Record<Page1FieldType, Page1FieldComponentBinding>>(
  (registry, field) => {
    registry[field.type].schemaFields.push(field);
    return registry;
  },
  {
    line_text: { type: 'line_text', schemaFields: [] },
    line_text_long: { type: 'line_text_long', schemaFields: [] },
    checkbox_group: { type: 'checkbox_group', schemaFields: [] },
    checkbox_group_inline: { type: 'checkbox_group_inline', schemaFields: [] },
    radio_group: { type: 'radio_group', schemaFields: [] },
    radio_group_inline: { type: 'radio_group_inline', schemaFields: [] },
    checkbox: { type: 'checkbox', schemaFields: [] },
    date: { type: 'date', schemaFields: [] },
    segmented_date_visual: { type: 'segmented_date_visual', schemaFields: [] },
    tel: { type: 'tel', schemaFields: [] },
    time: { type: 'time', schemaFields: [] },
    time_optional: { type: 'time_optional', schemaFields: [] },
    compound_time_or_flags: { type: 'compound_time_or_flags', schemaFields: [] },
    textarea_lined: { type: 'textarea_lined', schemaFields: [] },
    matrix_checkbox: { type: 'matrix_checkbox', schemaFields: [] },
    compound_rr: { type: 'compound_rr', schemaFields: [] },
    scale_line: { type: 'scale_line', schemaFields: [] },
    computed_number: { type: 'computed_number', schemaFields: [] },
    body_map: { type: 'body_map', schemaFields: [] },
    signature: { type: 'signature', schemaFields: [] },
  },
);

export function getPage1FieldsByType(type: Page1FieldType, schema: Page1FieldSpec[] = page1FieldSchema) {
  return schema.filter((field) => field.type === type);
}

export function getPage1FieldsByZone(zoneId: Page1ZoneId, schema: Page1FieldSpec[] = page1FieldSchema) {
  return schema.filter((field) => field.zoneId === zoneId);
}
