import React, {useEffect, useState,useMemo} from 'react';
import {useDropzone} from 'react-dropzone';



const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
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


export default function DropZone(props) {
    const [files, setFiles] = useState([]);
    const [count, setCount] = useState(0);
    const [state, updateState] = useState(false);

    const {getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {

            if(files.length !== 0)
                Array.prototype.push.apply(acceptedFiles,files);

            setFiles(acceptedFiles.map(
                file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });


    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);

    const updateThumbs = (files) =>{
        console.log('updateThumbs');
        let t = files.map(file => (
            <div style={thumb} key={file.name} onClick={ (e) => removeImage({e,file})}>
                <div style={thumbInner}>
                    <img
                        src={file.preview}
                        style={img}
                    />
                </div>
            </div>
        ));
    return t

    };

    let thumbs = updateThumbs(files);
    console.log(thumbs);

    let removeImage = ({e,file}) =>{
        e.preventDefault();
        console.log("remove image");
        let index = files.indexOf(file);

        if (index > -1) {
            files.splice(index, 1);
        }

        thumbs = updateThumbs(files);
        updateState(!state);

    };



    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    console.log("last line");

    return (
        <section className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <p>Click on file to remove it</p>
            </div>

            <aside style={thumbsContainer}>
                {thumbs}
            </aside>


        </section>
    );

}

