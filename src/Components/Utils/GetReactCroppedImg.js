


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