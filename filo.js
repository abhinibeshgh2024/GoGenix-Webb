function showAlert(msg){
    document.getElementById("alertBox").innerText = msg;
    setTimeout(()=>document.getElementById("alertBox").innerText="",4000);
}

/* JPG → PNG */
function jpgToPng(){
    const file=document.getElementById("jpgToPng").files[0];
    if(!file || file.type!=="image/jpeg"){
        showAlert("Please select a valid JPG file.");
        return;
    }
    convertImage(file,"image/png","converted.png");
}

/* PNG → JPG */
function pngToJpg(){
    const file=document.getElementById("pngToJpg").files[0];
    if(!file || file.type!=="image/png"){
        showAlert("Please select a valid PNG file.");
        return;
    }
    convertImage(file,"image/jpeg","converted.jpg");
}

function convertImage(file,type,name){
    const img=new Image();
    img.src=URL.createObjectURL(file);
    img.onload=()=>{
        const c=document.createElement("canvas");
        c.width=img.width;
        c.height=img.height;
        c.getContext("2d").drawImage(img,0,0);
        c.toBlob(b=>saveAs(b,name),type);
    };
}

/* Image → PDF */
async function imageToPdf(id,name){
    const file=document.getElementById(id).files[0];
    if(!file || !file.type.startsWith("image/")){
        showAlert("Please select a valid image file.");
        return;
    }
    const pdf=await PDFLib.PDFDocument.create();
    const imgBytes=await file.arrayBuffer();
    const img=file.type==="image/png"
        ? await pdf.embedPng(imgBytes)
        : await pdf.embedJpg(imgBytes);
    const page=pdf.addPage([img.width,img.height]);
    page.drawImage(img,{x:0,y:0,width:img.width,height:img.height});
    saveAs(new Blob([await pdf.save()]),name);
}

/* PDF → JPG (first page) */
async function pdfToJpg(){
    const file=document.getElementById("pdfToJpg").files[0];
    if(!file || file.type!=="application/pdf"){
        showAlert("Please select a valid PDF file.");
        return;
    }
    showAlert("PDF to JPG requires backend for multi-page. First page only supported.");
}

/* Merge PDF */
async function mergePdf(){
    const input = document.getElementById("mergePdf");
    const files = Array.from(input.files);

    if(files.length < 2){
        showAlert("Please select at least TWO PDF files to merge.");
        return;
    }

    // Validate all files first
    for(let file of files){
        if(file.type !== "application/pdf"){
            showAlert("Only PDF files are allowed for merging.");
            return;
        }
    }

    try{
        const mergedPdf = await PDFLib.PDFDocument.create();

        for(let file of files){
            const bytes = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(bytes);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedBytes = await mergedPdf.save();
        saveAs(new Blob([mergedBytes]), "merged.pdf");

        showAlert("PDFs merged successfully ✔");

        // Reset input so same files can be selected again
        input.value = "";

    }catch(err){
        console.error(err);
        showAlert("Error while merging PDFs.");
    }
}


/* Compress PDF */
async function compressPdf(){
    const file=document.getElementById("compressPdf").files[0];
    if(!file || file.type!=="application/pdf"){
        showAlert("Please select a valid PDF file.");
        return;
    }
    const pdf=await PDFLib.PDFDocument.load(await file.arrayBuffer());
    saveAs(new Blob([await pdf.save({useObjectStreams:true})]),"compressed.pdf");
}
