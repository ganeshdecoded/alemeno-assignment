import { XMLParser } from 'fast-xml-parser';
import type { Field } from '@/components/DynamicForm';

export async function parseXMLForm(xmlContent: string): Promise<Field[]> {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      attributesGroupName: 'attributes',
      parseAttributeValue: true,
      trimValues: true,
    });
    
    const result = parser.parse(xmlContent);
    
    // Navigate through the XML structure to find form elements
    const formElements = [];
    
    const findFormElements = (obj: any) => {
      if (!obj) return;
      
      // Handle arrays
      if (Array.isArray(obj)) {
        obj.forEach(item => findFormElements(item));
        return;
      }
      
      // Handle objects
      if (typeof obj === 'object') {
        // Check for form field attributes
        if (obj.attributes && obj.attributes.fdtType) {
          switch (obj.attributes.fdtType) {
            case 'iso':
              formElements.push({
                id: obj.attributes.fdtFieldName || `field_${formElements.length}`,
                type: 'text',
                label: obj.attributes.fdtFieldName || 'Text Input',
              });
              break;
              
            case 'radioList':
              formElements.push({
                id: obj.attributes.fdtFieldName || `field_${formElements.length}`,
                type: 'radio',
                label: obj.attributes.fdtFieldName || 'Options',
                options: ['Stage 1', 'Stage 2', 'Stage 3'] // Default options
              });
              break;
              
            case 'cursiveSignature':
              formElements.push({
                id: obj.attributes.fdtFieldName || `field_${formElements.length}`,
                type: 'drawing',
                label: 'Signature',
              });
              break;
          }
        }
        
        // Recursively search through all properties
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'object' && key !== 'attributes') {
            findFormElements(value);
          }
        });
      }
    };
    
    // Start the recursive search from the root
    findFormElements(result);
    
    if (formElements.length === 0) {
      throw new Error('No valid form fields found in the XML');
    }
    
    return formElements;
    
  } catch (error) {
    console.error('XML Parsing error:', error);
    throw new Error('Invalid XML format or unsupported structure');
  }
} 