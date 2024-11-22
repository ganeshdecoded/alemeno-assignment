import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'date' | 'signature';
};

export function FormField({ label, value, onChangeText, type = 'text' }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {type === 'signature' ? (
        <View style={styles.signatureBox} />
      ) : (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={type === 'date' ? 'DD/MM/YYYY' : ''}
          placeholderTextColor="#666"
        />
      )}
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
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
    borderRadius: 4,
    height: 40,
    backgroundColor: '#fff',
    color: '#000',
  },
  signatureBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
}); 