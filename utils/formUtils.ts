// utils/formUtils.ts
export function getTargetInfo(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  const target = e.target as HTMLInputElement | HTMLSelectElement;
  const { name, value, type } = target;
  const checked = 'checked' in target ? target.checked : false;
  return { name, value, type, checked };
}
