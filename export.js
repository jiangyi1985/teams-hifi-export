(async () => {
    const viewport = document.querySelector('[data-tid="message-pane-list-viewport"]');
    if (!viewport) return console.error("Viewport not found!");

    console.log("🚀 Starting auto-scroll to load history...");
    
    // 1. Loosen virtualization
    viewport.style.contain = 'none';
    viewport.style.overflow = 'visible';
    if (viewport.parentElement) viewport.parentElement.style.height = 'auto';

    // 2. Auto-scroll logic
    let lastScrollHeight = viewport.scrollHeight;
    let unchangedCount = 0;

    const scrollStep = () => {
        return new Promise((resolve) => {
            // viewport.scrollTop = 0; // Keep forcing scroll to top
            
            setTimeout(() => {
                // Check if we are still adding new content
                if (viewport.scrollHeight === lastScrollHeight) {
                    unchangedCount++;
                } else {
                    unchangedCount = 0;
                    lastScrollHeight = viewport.scrollHeight;
                }
                resolve();
            }, 2000); // Wait for Teams to fetch/render next chunk
        });
    };

    // Keep scrolling until the height stops changing for 5 consecutive checks
    while (unchangedCount < 5) {
        await scrollStep();
        console.log(`Loading... (Height: ${viewport.scrollHeight})`);
    }

    console.log("✅ Reached the top! Starting image conversion...");

    // 3. Your Base64 Image Conversion Logic
    const images = document.querySelectorAll('img'); 
    console.log("Found " + images.length + " img tags.");  
    
    let loadedImageCount = 0;

    for (let img of images) {
        if (img.src.startsWith('data:') || !img.src) continue;
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const base64Data = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            img.src = base64Data;

            loadedImageCount++;
        } catch (e) {
            console.warn("Could not convert image:", img.src);
        }
    }

    console.log("Loaded " + loadedImageCount + " images.");

    // // 4. Final Layout Flattening for MHTML
    // viewport.style.height = 'auto';
    // viewport.style.maxHeight = 'none';
    // document.body.style.height = 'auto';
    // document.body.style.overflow = 'visible';

    console.log("🏁 PROCESS COMPLETE. You can now save as MHTML.");
    // alert("Chat fully loaded and images converted! Save your MHTML now.");
})();
