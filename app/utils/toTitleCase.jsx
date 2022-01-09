function toTitleCase(str) {
  const splitted = str.split('_');
  return splitted.join(' ');
}

export default toTitleCase;
