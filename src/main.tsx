import React, { HTMLAttributes, HTMLProps, useState } from 'react'
import ReactDOM from 'react-dom/client'
import FileUpload from "react-mui-fileuploader"
import {createObjectCsvStringifier} from 'csv-writer-browser';
import vCard from  'vcf'
import Button from '@mui/material/Button';

import './index.css'

function App() {
  
const [files, setFiles] = useState([]);

  const handleFileUploadError = (error) => {
    // Do something...
     console.error(error);
  }
  
  const handleFilesChange = (files) => {
    // Do something...
console.log(files)
   if(files && files[0] && files[0].path) {
fetch(files[0].path)
.then(res => res.blob())
.then(blob => blob.text())
.then(text => setFiles(prevItems => [...prevItems,text]))
}
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  const vcards = vCard.parse( files[0]);

  
console.log(vcards[0].data.email._data);
const csvStringifier = createObjectCsvStringifier ({
    header: [
        {id: 'email', title: 'Email'},
        {id: 'fn', title: 'Full Name'}
    ]
});

const records = vcards.map( vc => ({email: vc.data.email._data, fn: vc.data.fn}) )

console.log(csvStringifier.getHeaderString());
// => 'NAME,LANGUAGE\n'

console.log(csvStringifier.stringifyRecords(records));
let fileData = new Blob([csvStringifier.getHeaderString()+csvStringifier.stringifyRecords(records)], {type: 'text/plain'});
var textFileUrl = window.URL.createObjectURL(fileData);
document.location.href = textFileUrl 
// => 'Bob,"French, English"\nMary,English\n'

}; 

  return (
   <>
    <FileUpload
      multiFile={false}
      disabled={false}
      title="Convert VCF to CSV"
      header="[Drag to drop your VCF files]"
      leftLabel="or"
      rightLabel="to select files"
      buttonLabel="click here"
      buttonRemoveLabel="Remove all"
      maxFileSize={10}
      maxUploadFiles={0}
      maxFilesContainerHeight={357}
      errorSizeMessage={'File to big'}
      allowedExtensions={['x-vcard']}
      onFilesChange={handleFilesChange}
      onError={handleFileUploadError}
      bannerProps={{ elevation: 0, variant: "outlined" }}
      containerProps={{ elevation: 0, variant: "outlined" }}
    />
	<Button onClick={handleClick}>Covert</Button>
    </>
)}
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
