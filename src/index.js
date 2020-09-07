import logger from './logger';

/**
 * @typedef RichTextSpan
 * @property {number} start
 * @property {number} end
 * @property {string} type
 *
 * @typedef RichTextBlock
 * @property {string} type
 * @property {string} [text]
 * @property {string} [url]
 * @property {string} [alt]
 * @property {RichTextSpan[]} [spans]
 *
 * @typedef MarkdownSpan
 * @property {number} index
 * @property {string} type
 * 
 * @typedef Document
 * @property {string} id
 * @property {string} uid
 * @property {string} type
 * @property {string} lang
 * @property {string[]} tags
 * @property {boolean} isBroken
 * 
 * @callback LinkResolver
 * @param {Document} doc
 * @returns {string}
 */

/**
 * adds the value at the index of string
 * @param {string} value
 * @param {number} index
 * @param {string} str
 * @returns {string}
 */
const insert = (value, index, str) => {
  return str.substr(0, index) + value + str.substr(index);
};

/**
 * relaces any text between the start and end of string with the value
 * @param {number} start
 * @param {number} end
 * @param {string} value
 * @param {string} str
 * @returns {string}
 */
const replaceBetween = (start, end, value, str) => {
  return str.substr(0, start) + value + str.substr(end);
};

const knownSpans = ['strong', 'em', 'hyperlink'];
const knownLinks = ['web', 'image', 'document'];

/**
 * converts an array of rich text spans into an array of markdown spans
 * @param {RichTextSpan[]} spans
 * @returns {MarkdownSpan[]}
 */
const convertSpans = (spans) => {
  if (!spans) {
    return [];
  }

  return spans
    .reduce((acc, { start, end, type, data }) => {
      if (!knownSpans.includes(type)) {
        logger.warn(`Span type "${type}" is unknown. Returning text as a paragragh`);
        return acc;
      }
      acc.push({
        type,
        index: start,
        data: {
          start,
          end,
          ...data
        }
      });
      if (type !== "hyperlink") {
        acc.push({
          type,
          index: end,
          data: {
            start,
            end,
            ...data
          }
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.index - b.index)
    .reverse();
};

/**
 * adds any tags or additional information that are in spans to the text
 * @param {string} text
 * @param {RichTextSpan[]} spans
 * @param {LinkResolver} [linkResolver]
 * @returns {string}
 */
const convertString = (text, spans, linkResolver) =>
  convertSpans(spans).reduce((acc, { index, type, data }) => {
    let tag = "";

    if (type === 'strong') {
      tag = "**";
    }

    if (type === 'em') {
      tag = "*";
    }

    if (type === 'hyperlink') {
      const dataType = data.type;
      const [_, linkType] = dataType.split('.');

      if (!knownLinks.includes(linkType)) {
        logger.warn(`Link type "${dataType}" is unknown. Returning texting as paragraph.`)
        return text;
      }

      const length = data.end - data.start;
      let url = data.value.url;

      if (dataType === 'Link.document') {
        if (!linkResolver) {
          logger.warn('Unable to resolve a document link as no link resolver method was passed in.');
          return text;
        }
        url = linkResolver({
          ...data.value.document,
          isBroken: data.value.isBroken,
        });
      }

      return replaceBetween(
        data.start,
        data.end,
        `[${text.substr(data.start, length)}](${url})`,
        text
      );
    }

    return insert(tag, index, acc);
  }, text);

/**
 * converts a rich text block into a markdown string
 * @param {RichTextBlock}
 * @param {LinkResolver} [linkResolver]
 * @returns {string}
 */
const convertRichTextBlock = ({ type, text, spans, url, alt }, linkResolver) => {
  const convertedText = convertString(text, spans, linkResolver);

  switch (type) {
    case "heading1":
    case "heading2":
    case "heading3":
    case "heading4":
    case "heading5":
    case "heading6": {
      const count = type.replace("heading", "");
      const hash = "#".repeat(count);

      return `${hash} ${convertedText}`;
    }

    case "image": {
      return `![${alt ? alt : ""}](${url})`;
    }

    case "preformatted": {
      const ticks = "```";
      return `${ticks}\n${text}\n${ticks}`;
    }

    case "o-list-item": {
      return `1. ${text}`;
    }

    case "list-item": {
      return `- ${text}`;
    }

    default: {
      if (type !== "paragraph") {
        logger.warn(`Text type "${type}" is unknown. Returning text as a paragragh`);
      }
      if (type === "paragraph" && !text) {
        return "&nbsp;";
      }
      return convertedText;
    }
  }
};

/**
 * converts an array of Prismic rich text blocks into a single markdown string
 * @param {RichTextBlock[]} richText
 * @param {LinkResolver} [linkResolver]
 * @returns {string}
 */
const richTextToMarkdown = (richText, linkResolver) => {
  const markdownArray = richText.map(richTextBlock => convertRichTextBlock(richTextBlock, linkResolver));
  return markdownArray.join("\n\n");
};

export default richTextToMarkdown;
export const _tests = {
  convertRichTextBlock,
  convertString,
  convertSpans,
  insert,
  replaceBetween
};
