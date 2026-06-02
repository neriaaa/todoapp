import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export const generateWordReport = async (todos) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  // Создаем структуру документа по новым строгим правилам docx
  const doc = new Document({
    creator: "Smart Todo App",
    title: "Отчет по задачам",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
            children: [new TextRun("Отчет о выполнении задач (Smart Todo)")],
          }),
          
          new Paragraph({
            spacing: { before: 200, after: 120 },
            children: [new TextRun({ text: "Общая статистика", bold: true, size: 28 })],
          }),
          
          new Paragraph({ children: [new TextRun(`Всего задач: ${total}`)] }),
          new Paragraph({ children: [new TextRun(`В процессе: ${active}`)] }),
          new Paragraph({ children: [new TextRun(`Выполнено: ${completed}`)] }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
            children: [new TextRun("Список активных задач")],
          }),
          
          // Проходимся по активным задачам
          ...todos
            .filter((t) => !t.completed)
            .map((t) => new Paragraph({ 
              children: [
                new TextRun(`• [${t.category === 'study' ? 'УЧЕБА' : t.category === 'work' ? 'РАБОТА' : 'ЖИЗНЬ'}] ${t.text} ${t.deadline ? '(Дедлайн: ' + t.deadline + ')' : ''}`)
              ] 
            })),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
            children: [new TextRun("Выполненные задачи")],
          }),
          
          // Проходимся по выполненным задачам
          ...todos
            .filter((t) => t.completed)
            .map((t) => new Paragraph({ 
              children: [new TextRun(`• ${t.text}`)] 
            })),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Otchet_SmartTodo.docx");
};