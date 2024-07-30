import { Prisma, PrismaClient, CodeLanguage } from '@prisma/client';

const dbClient = new PrismaClient();

const templates = [
  {
    language: CodeLanguage.C,
    source: `#include <stdio.h>
int main(){
  puts("hello world");
  return 0;
} `,
  },
  {
    language: CodeLanguage.HTML,
    source: `<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
  },
  {
    language: CodeLanguage.CSS,
    source: `body {

}`
  },
  {
    language: CodeLanguage.LISP,
    source: `(print "hello world")`
  },
  {
    language: CodeLanguage.JS,
    source: `console.log('hello world')`
  },
];

const seed = async (codeLanguage:CodeLanguage, source:string): Promise<void> => {
    const templateData: Prisma.CodeTemplateCreateInput = {
        language: codeLanguage,
        source: source
    };
    const template = await dbClient.codeTemplate.upsert({
        where: { language: codeLanguage },
        create: templateData,
        update: templateData
    });
    console.log({ template });
}

export const codeTemplateSeed = async (): Promise<void> => {
  for(let t of templates){
    seed(t.language, t.source);
  }
}
