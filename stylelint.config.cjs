module.exports = {
  rules: {
    'declaration-property-value-disallowed-list': {
      'font-family': [
        /var\(--font-pixel\)/,
        /var\(--font-retro\)/,
        /var\(--font-mono\)/,
        /Space Mono/i,
        /Archivo( Black)?/i,
        /Space Grotesk/i,
      ],
    },
  },
};
