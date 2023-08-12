import { htmlToText } from "html-to-text";

import { type Maybe } from "~/types/util";

export const trimToLength = (
  str: Maybe<string>,
  length: number,
  overflowCharacter = "…",
) => {
  if (!str) {
    return undefined;
  }

  if (str.length <= length) {
    return str;
  }

  return `${str.slice(0, length - 1).trim()}${overflowCharacter}`;
};

export const trimHtmlToTextOfLength = (
  html: Maybe<string>,
  length: number,
  overflowCharacter = "…",
) => {
  if (!html) {
    return undefined;
  }

  const text = htmlToText(html);

  return trimToLength(text, length, overflowCharacter);
};
