import React, { memo, useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ShortItemNew from './ShortItemNew';

const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };

function ShortsNew({ items, onEndReached, onRefresh }) {
  const flatListRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [layout, setLayout] = useState(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) setVisibleIndex(viewableItems[0].index);
  });

  const scrollToNext = useCallback(() => {
    if (visibleIndex < items.length - 1) {
      flatListRef.current?.scrollToIndex({ index: visibleIndex + 1, animated: true });
    }
  }, [visibleIndex, items.length]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <View style={{ width: layout.width, height: layout.height }}>
        <ShortItemNew
          url={item.url}
          layout={layout}
          playing={index === visibleIndex}
          visible={index === visibleIndex}
          isLast={index === items.length - 1}
          onNext={scrollToNext}
        />
      </View>
    ),
    [layout, visibleIndex, items.length, scrollToNext],
  );

  const getItemLayout = useCallback(
    (_, index) => ({ length: layout.height, offset: layout.height * index, index }),
    [layout],
  );

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (!layout || layout.width !== width || layout.height !== height) setLayout({ width, height });
      }}>
      {/* Render only once the real viewport size is known so every page is exactly one screen tall. */}
      {layout ? (
        <FlatList
          ref={flatListRef}
          data={items}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id || String(index)}
          refreshing={false}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          decelerationRate="fast"
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewabilityConfig}
          pagingEnabled
          windowSize={5}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          removeClippedSubviews
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignSelf: 'stretch', backgroundColor: '#000000' },
});

export default memo(ShortsNew);
