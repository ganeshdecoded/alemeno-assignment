import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import ViewShot from 'react-native-view-shot';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

type DrawingFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DrawingField({ label, onChange }: DrawingFieldProps) {
  const viewShotRef = useRef<ViewShot>(null);
  const paths = useSharedValue<Array<{ x: number; y: number }>>([]);
  
  const gesture = Gesture.Pan()
    .onStart((e) => {
      paths.value = [{ x: e.x, y: e.y }];
    })
    .onUpdate((e) => {
      paths.value = [...paths.value, { x: e.x, y: e.y }];
    })
    .onEnd(() => {
      captureDrawing();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  }));

  const captureDrawing = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        onChange(uri);
      } catch (e) {
        console.error('Failed to capture drawing:', e);
      }
    }
  };

  const handleClear = () => {
    paths.value = [];
    onChange('');
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <GestureHandlerRootView style={styles.drawingContainer}>
        <ViewShot ref={viewShotRef} style={styles.drawingArea}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.drawingArea, animatedStyle]} />
          </GestureDetector>
        </ViewShot>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: '#000',
  },
  drawingContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  drawingArea: {
    width: '100%',
    height: 200,
  },
  clearButton: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  clearButtonText: {
    color: '#0a7ea4',
  },
}); 