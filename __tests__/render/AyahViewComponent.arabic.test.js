// Regression: Arabic verse display reads Platform at render time.
// Before the Phase 1 fix this threw "Platform is not defined" on the core Quran reading screen.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import store from '../../src/containers/Quran/redux/reduxToolkit/store';
import AyahViewComponent from '../../src/containers/Quran/components/AyahViewComponent';
import {setStorageItem} from '../../src/containers/Quran/mmkvStorage/storeData';

test('Arabic verse view renders without a Platform reference error', () => {
  setStorageItem('isArabic', true);
  let renderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <Provider store={store}>
        <AyahViewComponent ayahItem={{id: 1, words: [{textUthmani: 'بِسْمِ'}, {textUthmani: 'ٱللَّهِ'}]}} />
      </Provider>,
    );
  });
  expect(JSON.stringify(renderer.toJSON())).toContain('بِسْمِ ٱللَّهِ');
});
