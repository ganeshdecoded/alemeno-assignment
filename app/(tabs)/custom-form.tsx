import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DynamicForm, type Field } from '@/components/DynamicForm';
import { parseXMLForm } from '@/utils/xmlParser';

export default function CustomFormScreen() {
  const [xmlInput, setXmlInput] = useState('');
  const [formFields, setFormFields] = useState<Field[] | null>(null);
  const [error, setError] = useState('');
  
  const handleSubmit = async () => {
    try {
      const parsedForm = await parseXMLForm(xmlInput);
      setFormFields(parsedForm);
      setError('');
    } catch (err) {
      setError('Error parsing XML. Please ensure it\'s a valid format.');
      console.error(err);
    }
  };

  // Add this sample XML for testing
  const sampleXML = `
<?xml version="1.0" encoding="UTF-8"?>
<div>
  <div id="formSide1" class="formSide">
    <g id="formSide1Main">
      <g fdtType="iso" fdtFieldName="CustomerName1">
        <rect width="19" height="23" />
      </g>
      <g fdtType="radioList" fdtFieldName="Stages" fdtGroupName="Stages">
        <rect width="24" height="24" />
      </g>
      <g fdtType="cursiveSignature" fdtFieldName="Signature4">
        <rect width="315" height="135" />
      </g>
    </g>
  </div>
</div>
`;

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}>
        {!formFields ? (
          <>
            <ThemedText style={styles.title}>XML Form Input</ThemedText>
            <ThemedText style={styles.label}>Enter XML Form Definition:</ThemedText>
            <TextInput
              style={styles.xmlInput}
              multiline
              value={xmlInput}
              onChangeText={setXmlInput}
              placeholder="Paste your XML here..."
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <ThemedText style={styles.buttonText}>Generate Form</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { marginTop: 8 }]} 
              onPress={() => setXmlInput(sampleXML)}>
              <ThemedText style={styles.buttonText}>Use Sample XML</ThemedText>
            </TouchableOpacity>
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.button, { marginBottom: 16 }]} 
              onPress={() => {
                setFormFields(null);
                setError('');
              }}>
              <ThemedText style={styles.buttonText}>Back to XML Input</ThemedText>
            </TouchableOpacity>
            <DynamicForm fields={formFields} />
          </>
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
    paddingTop: 60, // Add top padding to move content down
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginBottom: 8,
    color: '#000',
    fontSize: 16,
  },
  xmlInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    minHeight: 200,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
    textAlignVertical: 'top', // Makes multiline input start from top
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
}); 