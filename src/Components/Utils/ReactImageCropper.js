import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from 'react-image-crop';
import Button from 'react-bootstrap/Button';
import 'react-image-crop/dist/ReactCrop.css';

// Increase pixel density for crop preview quality on retina screens.
const pixelRatio = window.devicePixelRatio || 1;

function getResizedCanvas(canvas, newWidth, newHeight) {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = newWidth;
    tmpCanvas.height = newHeight;
  
    const ctx = tmpCanvas.getContext("2d");
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      newWidth,
      newHeight
    );
  
    return tmpCanvas;
  }
  
  function generateDownload(previewCanvas, crop) {
    if (!crop || !previewCanvas) {
      return;
    }
  
    const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);
  
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement("a");
        anchor.download = "cropPreview.png";
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      "image/png",
      1
    );
    
  }
const ReactImageCropper = ({ getBlob, inputImg }) => {
    const [zoom, setZoom] = useState(1)
    const [completedCrop, setCompletedCrop] = useState(null);

    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: "%", width: false, aspect: false });

    // const onCropComplete = async (e) => {
    //     console.log(e);
    //     const croppedImage = await getCroppedImg(
    //         inputImg,
    //         e
    //     )
    //     getBlob(croppedImage)
    // }

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    
    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }
    
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;
    
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
    
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
    
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
      }, [completedCrop]);

    return (
    <div>
        <Button onClick={() =>
          generateDownload(previewCanvasRef.current, completedCrop)
        }>Save</Button>
        <div className='cropper'> 
            {/* <ReactCrop 
                src={inputImg} 
                crop={crop} 
                onChange={newCrop => setCrop(newCrop)} 
                
            /> */}

        <ReactCrop
            src={inputImg}
            onImageLoaded={onLoad}
            crop={crop}
            zoom={zoom}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
        />        

        </div>
        </div>
    )
}

export default ReactImageCropper;