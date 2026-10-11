import { pipeline, env } from "@huggingface/transformers";
import ts from "typescript";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";

env.cacheDir = ".cache/translation-model";
const model = "Xenova/m2m100_418M";
const generationVersion = 2;
const segmenter = new Intl.Segmenter("es", { granularity: "sentence" });
const output = "content/translations.generated.json";
const sources = ["content/data.ts", "app/en/page.tsx"];
const dataFields = new Set(["role", "tagline", "bioShort", "location", "label", "category", "description", "format"]);
for (const entry of await readdir("components")) {
  if (entry.endsWith(".tsx")) sources.push(`components/${entry}`);
}
const texts = new Set();
for (const path of sources) {
  const source = ts.createSourceFile(path, await readFile(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === "t" && ts.isStringLiteral(node.arguments[1])) {
      texts.add(node.arguments[1].text);
    }
    if (path === "content/data.ts" && ts.isPropertyAssignment(node) && dataFields.has(node.name.getText(source)) && ts.isStringLiteral(node.initializer)) {
      if (node.name.getText(source) !== "role" || !/Frontend (Developer|Intern)/.test(node.initializer.text)) texts.add(node.initializer.text);
    }
    if (path === "content/data.ts" && ts.isStringLiteral(node)) {
      let parent = node.parent;
      while (parent && !ts.isVariableDeclaration(parent)) parent = parent.parent;
      if (parent?.name.getText(source) === "education" && ts.isPropertyAssignment(node.parent) && node.parent.name.getText(source) === "title") texts.add(node.text);
      if (ts.isArrayLiteralExpression(node.parent) && ts.isPropertyAssignment(node.parent.parent) && node.parent.parent.name.getText(source) === "items" && /[áéíóúñ]|Agentes|Accesibilidad/.test(node.text)) texts.add(node.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const sortedTexts = [...texts].sort();
const sourceHash = createHash("sha256").update(JSON.stringify({ generationVersion, texts: sortedTexts })).digest("hex");
let previous = { model, translations: {} };
try {
  previous = JSON.parse(await readFile(output, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (process.argv.includes("--check")) {
  if (previous.sourceHash !== sourceHash || previous.model !== model || sortedTexts.some(text => typeof previous.translations[text] !== "string" || !previous.translations[text].trim())) {
    throw new Error("Traducciones desactualizadas. Ejecuta npm run translate y revisa el resultado antes de publicar.");
  }
  console.log("Traducciones actualizadas.");
} else {
  const missing = sortedTexts.filter(text => previous.model !== model || previous.generationVersion !== generationVersion || !previous.translations[text]);
  const translator = missing.length ? await pipeline("translation", model, { dtype: "q8" }) : null;
  const translations = {};
  for (const text of sortedTexts) {
    if (!missing.includes(text)) {
      translations[text] = previous.translations[text];
      continue;
    }
    const sentences = [];
    const leadingDot = text.startsWith(". ");
    for (const { segment } of segmenter.segment(leadingDot ? text.slice(2) : text)) {
      const result = await translator(segment.trim(), { src_lang: "es", tgt_lang: "en", max_new_tokens: 256 });
      const sentence = result[0]?.translation_text?.trim();
      if (!sentence) throw new Error(`Traducción vacía: ${text}`);
      sentences.push(sentence);
    }
    const translated = `${leadingDot ? ". " : ""}${sentences.join(" ")}`;
    translations[text] = translated;
    console.log(`${text} -> ${translated}`);
  }
  await mkdir("content", { recursive: true });
  await writeFile(output, `${JSON.stringify({ model, generationVersion, sourceHash, translations }, null, 2)}\n`);
  console.log(`Generado ${output}. Revisa especialmente cargos y descripciones.`);
}