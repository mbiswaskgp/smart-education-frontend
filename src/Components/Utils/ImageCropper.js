import React, { useState } from 'react'
import Cropper from 'react-easy-crop';
import getCroppedImg  from './GetCroppedImg';
import '../Modules/Admin/Assessments/Assessments.css';
const ImageCropper = ({ getBlob, inputImg }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const onCropComplete = async (_, croppedAreaPixels) => {
        console.log(croppedAreaPixels);

        const croppedImage = await getCroppedImg(
            inputImg,
            croppedAreaPixels
        )
        console.log(croppedImage);
        getBlob(croppedImage)
    }

    return (
    <div>
        <div className='cropper'> 
            <Cropper
                image={inputImg}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
        </div>
        </div>
    )
}

export default ImageCropper;