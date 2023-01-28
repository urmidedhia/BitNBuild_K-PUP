import { Box, Grid } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ImageUploader from 'react-image-upload'
import { v4 as uuidv4 } from 'uuid';
import 'react-image-upload/dist/index.css'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from "../../../firebase/config"
import BarcodeService from '../../../services/BarcodeService';
import AddProduct from '../app/AddProduct';
import Loader from '../../../helpers/Loader';

function UploadImg() {

    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [editSinglePerson, setEditSinglePerson] = useState('Add');
    const [load, setLoad] = useState(false)
    const [json, setJson] = useState({
        'name': '',
        'desc': '',
        'img': '',
        'added_date': new Date(),
        'expiry_date': '',
        'category': {
            'name': ''
        },
        'costcount': (Array(Number(1)).fill("")),
    })
    const imagesListRef = ref(storage, "images/");
    const uploadFile = () => {
        setLoad(true)
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name} + ${uuidv4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls(url);
                console.log(url);
                getImageFileObject(url);
            });
        });
    };

    async function getImageFileObject(img) {
        const form2Data = new FormData()
        form2Data.append('linkFile', img);
        await BarcodeService.getBarcode(form2Data)
            .then(async (res) => {
                console.log(res);
                await BarcodeService.getBarcodeDetails(res.data.data[0].allFields[0].fieldValue)
                    .then((res) => {
                        setJson({ ...json, 'name': res.data.products[0].title, 'img': res.data.products[0].images[0], 'desc': res.data.products[0].description })
                        setLoad(false)

                    })
            })
            .catch((e) => {
                console.log(e)
            })
        // const res = await IpfsServices.uploadImg(form2Data, token)
        // setJson({ ...json, bannerUri: res.data.urls[0] })
        // console.log(res.data.urls[0])
        // setImgLoad(false)
    }
    function runAfterImageDelete(file) {
        console.log({ file })
    }

    // useEffect(() => {
    //     listAll(imagesListRef).then((response) => {
    //         response.items.forEach((item) => {
    //             getDownloadURL(item).then((url) => {
    //                 setImageUrls(url);
    //                 console.log(url)
    //                 getImageFileObject(url);
    //             });
    //         });
    //     });

    // }, []);
    console.log(json);

    return (
        <>
            <Grid container>
                <Grid item md={4}>
                    <input
                        type="file"
                        onChange={(event) => {
                            setImageUpload(event.target.files[0]);
                        }}
                    />
                    <button type="button" onClick={uploadFile}> Upload Image</button>
                </Grid>

                {!load ? <AddProduct img={imageUrls} json={json} setJson={setJson} /> : <Grid item md={8} sx={{ width: '100%', display: 'flex', 'justifyContent': 'center', height: '400px', alignItems: 'center' }}>
                    <Loader />

                </Grid>}
            </Grid>
            {/* <input
                type="file"
                onChange={(event) => {
                    setImageUpload(event.target.files[0]);
                }}
            />
            <button type="button" onClick={uploadFile}> Upload Image</button> */}
        </>
    )
}

export default UploadImg