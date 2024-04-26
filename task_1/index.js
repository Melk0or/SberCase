import {encoded, translations} from './data.js'
// Функция для расшифровки полей с суффиксом "Id"
function decodeFields(encoded, translations) {
    // Ключи полей, которые нуж но исключить из расшифровки
    const excludeFields = ["groupId", "service", "formatSize", "ca"];
  
    // Создаем новый список объектов для хранения расшифрованных данных
    const decoded = encoded.map((item) => {
      // Для каждого объекта создаем новый объект для сохранения результатов
      const decodedItem = {};
      // Проходимся по ключам объекта
      for (const key in item) {
        // Проверяем, нужно ли исключить поле из расшифровки
        if (!excludeFields.includes(key)) {
          // Если поле не нужно исключить, проверяем, есть ли в словаре translations соответствующий ключ
          if (translations[item[key]]) {
            // Если есть, записываем расшифрованное значение
            decodedItem[key] = translations[item[key]];
          } else {
            // Если нет, оставляем исходное значение
            decodedItem[key] = item[key] === '0' ? '' : item[key];
          }
        } else {
          // Если поле нужно исключить, просто копируем его без изменений
          decodedItem[key] = item[key];
        }
      }
      // Возвращаем расшифрованный объект
      return decodedItem;
    });
  
    return decoded;
  }
  
  // Вызываем функцию для расшифровки
  const decodedData = decodeFields(encoded, translations);
  
  // Выводим результат
  console.log(decodedData);