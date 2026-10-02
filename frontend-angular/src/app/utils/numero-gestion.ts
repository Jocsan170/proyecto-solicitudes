/** Agrupa los códigos de gestión de cuatro en cuatro, manteniendo compatibilidad con códigos anteriores. */
export function formatearNumeroGestion(numero: string): string {
  const limpio = String(numero || '').replace(/[-\s]/g, '').toUpperCase();
  return limpio.match(/.{1,4}/g)?.join('-') ?? numero;
}
