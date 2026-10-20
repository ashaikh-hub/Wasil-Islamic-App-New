import React from 'react';
import { Text } from 'react-native';

// Renders a paragraph where every "Wasil…" brand mention is highlighted.
export default function InfoText({ children, style, highlightStyle }) {
  const parts = String(children).split(/(Wasil(?:: Islamic App| Islamic App)?)/g);
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        /^Wasil/.test(part) ? (
          <Text key={i} style={highlightStyle}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
