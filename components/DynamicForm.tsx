import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FormField } from './FormField';
import { RadioGroup } from './RadioGroup';
import { DrawingField } from './DrawingField';
import { ThemedText } from '@/components/ThemedText';

export type Field = {
  type: 'text' | 'date' | 'radio' | 'drawing';
  label: string;
  id: string;
  options?: string[]; // for radio buttons
};

export type DynamicFormProps = {
  fields: Field[];
};

export function DynamicForm({ fields }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>('');

  if (!fields || !Array.isArray(fields)) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.error}>No form fields available</ThemedText>
      </View>
    );
  }

  const handleFieldChange = (id: string, value: any) => {
    try {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      setError('');
    } catch (err) {
      setError('Error updating form field');
      console.error(err);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.error}>{error}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {fields?.map((field) => {
        try {
          switch (field.type) {
            case 'radio':
              return (
                <RadioGroup
                  key={field.id}
                  label={field.label}
                  options={field.options || []}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              );
            case 'drawing':
              return (
                <DrawingField
                  key={field.id}
                  label={field.label}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              );
            default:
              return (
                <FormField
                  key={field.id}
                  label={field.label}
                  value={formData[field.id] || ''}
                  onChangeText={(text) => handleFieldChange(field.id, text)}
                  type={field.type}
                />
              );
          }
        } catch (err) {
          console.error(`Error rendering field ${field.id}:`, err);
          return null;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 