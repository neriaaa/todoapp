const path = require('path');

module.exports = function override(config, env) {
  // Находим правило для обработки JS-файлов
  const rule = config.module.rules.find((r) => r.oneOf);
  
  if (rule) {
    rule.oneOf.forEach((loader) => {
      if (loader.test && loader.test.toString().includes('js')) {
        loader.exclude = [
          ...(Array.isArray(loader.exclude) ? loader.exclude : [loader.exclude]),
          path.resolve(__dirname, 'node_modules/docx'),
        ];
      }
    });
  }
  
  return config;
};