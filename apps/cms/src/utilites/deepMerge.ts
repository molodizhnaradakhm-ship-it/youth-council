/**
 * Простая проверка объекта.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Глубокое слияние двух объектов.
 * @param target - Объект, в который сливаются данные.
 * @param source - Объект, из которого сливаются данные.
 */
export default function deepMerge<T extends Record<string, any>, R extends Record<string, any>>(
  target: T,
  source: R,
): R & T {
  const output: Record<string, any> = { ...target }; // Используем Record для индексируемого объекта

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key]; // Разрешаем присваивание для output
        } else {
          // Явное приведение типов для рекурсивного вызова.
          output[key] = deepMerge(
            target[key] as Record<string, any>,
            source[key] as Record<string, any>,
          );
        }
      } else {
        output[key] = source[key]; // Разрешаем присваивание для output
      }
    });
  }

  return output as R & T; // Возвращаем результат с объединенным типом
}
