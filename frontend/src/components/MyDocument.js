import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles for the document
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff'
  },
  section: {
  	margin: 10,
  	padding: 10
  }
});

// renders the content inside the document
function MyDocument(props) {
	return(
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.section}>
					<Text>{props.data ? props.data : ""}</Text>
				</View>
			</Page>
		</Document>
 	);
}

export default MyDocument;