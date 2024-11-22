import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { parseXMLForm } from '@/utils/xmlParser';
import { router } from 'expo-router';
import { DynamicForm } from '@/components/DynamicForm';
import type { Field } from '@/components/DynamicForm';

export default function HomeScreen() {
  const [formFields, setFormFields] = useState<Field[] | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/xml', 'application/xml'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        console.log('File Content:', fileContent);
        
        const parsedForm = await parseXMLForm(fileContent);
        setFormFields(parsedForm);
        setError('');
      }
    } catch (err) {
      setError('Error loading XML file. Please ensure it\'s a valid XML format.');
      console.error('File loading error:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.title}>XML Form Renderer</ThemedText>
        
        <TouchableOpacity style={styles.button} onPress={handleFileSelect}>
          <ThemedText style={styles.buttonText}>Render Form from XML File</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/custom-form')}>
          <ThemedText style={styles.buttonText}>Render Form from XML Input</ThemedText>
        </TouchableOpacity>

        {error ? (
          <ThemedText style={styles.error}>{error}</ThemedText>
        ) : formFields ? (
          <DynamicForm fields={formFields} />
        ) : (
          <ThemedText style={styles.info}>
            Supported field types:{'\n'}
            • Text fields{'\n'}
            • Date/time fields{'\n'}
            • Radio buttons{'\n'}
            • Drawing field{'\n\n'}
            Note: Please select an XML file with the supported field types.
          </ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
  info: {
    color: '#000',
    marginTop: 24,
    lineHeight: 24,
  },
}); 