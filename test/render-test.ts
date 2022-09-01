import { assert } from 'chai';

import { createCarota } from './test-utils';

describe('Text', function () {
  // ======================================================
  it('empty editor', function () {
    const editor = createCarota();
    editor.load([]);
  });

  it('try long word wrap', function () {
    const editor = createCarota();
    // if width is limited, it should automatically wrap word
    // and it shouldn't make canvas bigger
    editor.load([
      {
        text: 'VeryVeryVeryLongWordWillBePlacedHereItShouldWrapAtSomePointOfTime',
      },
    ]);
  });
});
