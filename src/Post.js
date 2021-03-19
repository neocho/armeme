import { useState } from 'react';
import  {getWalletAddress, getAddressBalance, createDataTransaction, signAndSubmitTransaction, getTransactionData} from './Arweave';
import {useDropzone} from 'react-dropzone';
import {Link, useHistory} from 'react-router-dom';
import styled from 'styled-components';
import './Post.css';

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#7fcd85';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}
    
const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${props => getColor(props)};
    border-style: solid;
    background-color: #fafafa;
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 10px;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
`;

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    marginBottom: 8,
    marginRight: 8,
    width: 'auto',
    height: 'auto',
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

function Post(){
    const [files, setFiles] = useState([]);
    const [imgSelected, setImageSelected] = useState(false);
    let history = useHistory();
    const {REACT_APP_KEY} = process.env;

    const {
        getRootProps, 
        getInputProps, 
        isDragActive, 
        isDragAccept, 
        isDragReject
    } = useDropzone({accept: 'image/jpeg, image/png', multiple: false, onDrop: (acceptedFiles) => {

        setImageSelected(true);

        // Preview image
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)})));
    }});

    const handleSubmit =  (event) => {
        event.preventDefault();

        const imgFile = files[0];

        const reader = new FileReader();

        reader.onload = async() => {
            const url = reader.result;
        
            let transaction = await createDataTransaction(url,JSON.parse(REACT_APP_KEY));
            await signAndSubmitTransaction(transaction, JSON.parse(REACT_APP_KEY));

            history.push('/')
        };

        reader.readAsDataURL(imgFile); 
    };

    const previewThumbnail = files.map(file => (
        <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img src={file.preview} style={img} alt="" />
        </div>
      </div>
    ));

    return(
        <div className="container">
            <div> 
            <Link to="/" style={{ textDecoration: 'none' }}>
                <p> 👈 Take me back </p>
            </Link>
                <div> 
                    <h1> Post 🤳 </h1>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="dropzone">
                    <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject})}>
                        <input {...getInputProps()} />
                        {
                            <h3> Drop a meme here</h3>
                        }
                    </Container> 
                </div>

                <div className="preview"> 
                    <h2> Image Preview </h2>
                    {
                        imgSelected ? <p> Image Selected 🥳</p> : <p> 🥺 No image selected</p>
                    }
                </div>

                <div className="preview-thumbnail"> {previewThumbnail} </div>

                <div className="button"> 
                {
                    imgSelected ? <button type="submit"> Post yo meme </button>  :  ""
                }
                </div> 
            </form>
        </div>
    );
}

export default Post;