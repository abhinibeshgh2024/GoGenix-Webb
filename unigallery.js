let currentImage = "";

const imageData = {
    devotion: [
        "https://picsum.photos/id/1011/800/1200",
        "https://picsum.photos/id/1025/1200/800",
        "https://picsum.photos/id/1040/900/1300"
    ],
    nature: [
        "https://picsum.photos/id/1056/1200/800",
        "https://picsum.photos/id/1069/800/1200"
    ],
    environment: [
        "https://picsum.photos/id/1074/900/1200",
        "https://picsum.photos/id/1084/1200/800"
    ],
    monuments: [
        "https://picsum.photos/id/1081/800/1200",
        "https://picsum.photos/id/1031/1200/800"
    ]
};

function loadGallery(category) {
    const gallery = document.getElementById("gallery");
    const title = document.getElementById("sectionTitle");

    gallery.innerHTML = "";
    title.innerText = category.toUpperCase();

    imageData[category].forEach(src => {
        gallery.innerHTML += `
            <div class="gallery-card">
                <img src="${src}">
                <div class="card-actions">
                    <button onclick="viewImage('${src}')">View</button>
                    <button onclick="directDownload('${src}')">Download</button>
                </div>
            </div>
        `;
    });
}

function viewImage(src) {
    currentImage = src;
    document.getElementById("modalImg").src = src;
    document.getElementById("imageModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

function directDownload(src) {
    downloadFile(src, "jpg");
}

function downloadImage(type) {
    downloadFile(currentImage, type);
}

function downloadFile(src, type) {
    const link = document.createElement("a");
    link.href = src;
    link.download = `GoGenix_Image.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* Default */
loadGallery("devotion");
