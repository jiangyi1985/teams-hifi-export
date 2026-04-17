// 1. Target the scrollable viewport
const viewport = document.querySelector('[data-tid="message-pane-list-viewport"]');

if (viewport) {
	console.log('viewport.style.contain',viewport.style.contain);
	console.log('viewport.style.overflow',viewport.style.overflow);
    viewport.style.contain = ''; 
    viewport.style.overflow = '';
    
    const container = viewport.parentElement;
    if (container) 
	{
		console.log('container.style.height',container.style.height);
		container.style.height = ''; 
	}

    console.log("Reset. You can view the whole list now.");
} else {
    console.log("Viewport not found. Ensure you are in the chat window.");
}
