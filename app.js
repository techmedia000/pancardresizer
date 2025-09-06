// Global variables
let currentStep = 1;
let selectedFile = null;
let originalImage = null;
let currentRequirement = 'pan-photo';
let currentTab = 'photo';
let currentLanguage = 'en';
let currentPage = 'home';
let canvas = null;
let ctx = null;
let imageData = null;
let cropMode = false;
let cropBox = null;
let zoomLevel = 1;
let brightness = 0;
let contrast = 100;

// Language data
const languages = {
  "en": {
    "title": "Photo, Signature & Document Converter For Pan card Application",
    "subtitle": "Free Online Photograph, Signature and Document Converter and resizer tool for a pan card application form.",
    "steps": ["Upload", "Requirement", "Editor"],
    "dropText": "Drop your photo here!",
    "selectFile": "Select File",
    "maxSize": "maximum file size: 10 MB",
    "previous": "Previous",
    "next": "Next",
    "download": "Download"
  },
  "hi": {
    "title": "पैन कार्ड आवेदन के लिए फोटो, हस्ताक्षर और डॉक्यूमेंट कनवर्टर",
    "subtitle": "पैन कार्ड आवेदन पत्र के लिए नि:शुल्क ऑनलाइन फोटोग्राफ, हस्ताक्षर और डॉक्यूमेंट कनवर्टर और आकार बदलने वाला टूल।",
    "steps": ["अपलोड", "आवश्यकता", "एडीटर"],
    "dropText": "अपनी फोटो यहाँ गिराओ!",
    "selectFile": "फ़ाइल् पसंद करे",
    "maxSize": "अधिकतम फ़ाइल की साइज: 10 MB",
    "previous": "पीछे",
    "next": "आगे बढे",
    "download": "डाउनलोड"
  }
};

// Requirements data
const requirements = {
  'pan-photo': { width: 200, height: 240, format: 'jpeg' },
  'passport-photo': { width: 200, height: 240, format: 'jpeg' },
  'aadhaar-photo': { width: 150, height: 200, format: 'jpeg' },
  'pan-signature': { width: 140, height: 60, format: 'jpeg' },
  'bank-signature': { width: 140, height: 60, format: 'jpeg' },
  'a4-document': { width: 595, height: 842, format: 'pdf' },
  'letter-document': { width: 612, height: 792, format: 'pdf' }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization');
    initializeCanvas();
    setupPageNavigation();
    setupEventListeners();
    updateLanguage();
    updateNavigation();
    console.log('Initialization complete');
});

function initializeCanvas() {
    canvas = document.getElementById('canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        console.log('Canvas initialized successfully');
    } else {
        console.error('Canvas element not found');
    }
}

function setupPageNavigation() {
    console.log('Setting up page navigation');
    
    // Site title click to go home
    const siteTitle = document.getElementById('site-title');
    if (siteTitle) {
        siteTitle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Site title clicked, navigating to home');
            navigateToPage('home');
        });
        console.log('Site title navigation added');
    } else {
        console.error('Site title not found');
    }

    // Footer links - Wait a moment to ensure DOM is ready
    setTimeout(() => {
        const footerLinks = document.querySelectorAll('.footer-link');
        console.log('Found footer links:', footerLinks.length);
        
        footerLinks.forEach((link, index) => {
            const targetPage = link.dataset.page;
            console.log(`Setting up footer link ${index + 1}: ${targetPage}`);
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Footer link clicked:', targetPage);
                navigateToPage(targetPage);
            });
        });
        
        console.log('Footer navigation links setup complete');
    }, 100);
}

function navigateToPage(pageName) {
    console.log('Navigating to page:', pageName);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    console.log('Found pages:', pages.length);
    
    pages.forEach((page, index) => {
        page.classList.remove('active');
        page.classList.add('hidden');
        console.log(`Page ${index + 1} hidden:`, page.id);
    });

    // Show target page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        currentPage = pageName;
        console.log('Page navigation successful:', pageName);
        
        // Update page title
        updatePageTitle(pageName);
        
        // If navigating to home, ensure we're back to step 1
        if (pageName === 'home') {
            goToStep(1);
        }
    } else {
        console.error('Target page not found:', `${pageName}-page`);
    }
}

function updatePageTitle(pageName) {
    const titles = {
        'home': 'Pan Card Photo Resizer - Free Online Tool',
        'about': 'About - Pan Card Photo Resizer',
        'contact': 'Contact Us - Pan Card Photo Resizer',
        'privacy': 'Privacy Policy - Pan Card Photo Resizer'
    };
    
    if (titles[pageName]) {
        document.title = titles[pageName];
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // File upload elements
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const uploadArea = document.getElementById('uploadArea');
    const changeFileBtn = document.getElementById('changeFile');

    // File input change event
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            console.log('File input changed');
            if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
        console.log('File input event listener added');
    } else {
        console.error('File input not found');
    }

    // Select file button click
    if (selectFileBtn) {
        selectFileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Select file button clicked');
            if (fileInput) {
                fileInput.click();
            }
        });
        console.log('Select file button event listener added');
    } else {
        console.error('Select file button not found');
    }

    // Change file button
    if (changeFileBtn) {
        changeFileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Change file button clicked');
            if (fileInput) {
                fileInput.click();
            }
        });
        console.log('Change file button event listener added');
    }

    // Upload area events
    if (uploadArea) {
        // Click event
        uploadArea.addEventListener('click', function(e) {
            // Only trigger file input if not clicking on the button
            if (e.target !== selectFileBtn && !selectFileBtn.contains(e.target)) {
                e.preventDefault();
                console.log('Upload area clicked');
                if (fileInput) {
                    fileInput.click();
                }
            }
        });

        // Drag and drop events
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Drag over upload area');
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Drag leave upload area');
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('File dropped on upload area');
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        console.log('Upload area event listeners added');
    } else {
        console.error('Upload area not found');
    }

    // Step navigation - Enhanced with better event handling
    setTimeout(() => {
        const stepElements = document.querySelectorAll('.step');
        console.log('Found step elements:', stepElements.length);
        
        stepElements.forEach((step, index) => {
            const stepNum = parseInt(step.dataset.step);
            console.log(`Setting up step ${stepNum} navigation`);
            
            step.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Step clicked:', stepNum);
                console.log('Max available step:', getMaxAvailableStep());
                
                if (stepNum <= getMaxAvailableStep()) {
                    goToStep(stepNum);
                } else {
                    console.log('Step not available yet');
                    alert('Please complete the previous steps first.');
                }
            });
        });
        console.log('Step navigation listeners added');
    }, 100);

    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous button clicked');
            goToStep(currentStep - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked');
            goToStep(currentStep + 1);
        });
    }

    // Requirements selection
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Tab clicked:', btn.dataset.tab);
            switchTab(btn.dataset.tab);
        });
    });

    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Option selected:', card.dataset.req);
            selectRequirement(card.dataset.req);
        });
    });

    // Format selection
    const formatRadios = document.querySelectorAll('input[name="format"]');
    formatRadios.forEach(radio => {
        radio.addEventListener('change', updateFormat);
    });

    // Quality slider
    const qualityRange = document.getElementById('qualityRange');
    const qualityValue = document.getElementById('qualityValue');
    if (qualityRange && qualityValue) {
        qualityRange.addEventListener('input', function(e) {
            qualityValue.textContent = Math.round(e.target.value * 100) + '%';
        });
    }

    // Editor controls
    const enableCropBtn = document.getElementById('enableCrop');
    const applyCropBtn = document.getElementById('applyCrop');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetBtn = document.getElementById('resetZoom');
    const downloadBtn = document.getElementById('downloadBtn');

    if (enableCropBtn) {
        enableCropBtn.addEventListener('click', enableCropMode);
    }
    if (applyCropBtn) {
        applyCropBtn.addEventListener('click', applyCrop);
    }
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => zoom(1.2));
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => zoom(0.8));
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetImage);
    }
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }

    // Brightness and contrast
    const brightnessRange = document.getElementById('brightnessRange');
    const contrastRange = document.getElementById('contrastRange');
    const brightnessValue = document.getElementById('brightnessValue');
    const contrastValue = document.getElementById('contrastValue');

    if (brightnessRange && brightnessValue) {
        brightnessRange.addEventListener('input', function(e) {
            brightness = parseInt(e.target.value);
            brightnessValue.textContent = brightness;
            applyFilters();
        });
    }

    if (contrastRange && contrastValue) {
        contrastRange.addEventListener('input', function(e) {
            contrast = parseInt(e.target.value);
            contrastValue.textContent = contrast + '%';
            applyFilters();
        });
    }

    // Language toggle
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchLanguage(btn.dataset.lang);
        });
    });

    // Contact form
    setupContactForm();

    console.log('All event listeners setup complete');
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');
            
            // Clear previous errors
            clearFormErrors();
            
            // Validate form
            if (validateContactForm()) {
                // Show success message (simulate form submission)
                showFormSuccess();
                // Reset form
                contactForm.reset();
            } else {
                console.log('Form validation failed');
            }
        });
        console.log('Contact form listener added');
    }
}

function validateContactForm() {
    let isValid = true;
    
    // Validate name
    const name = document.getElementById('contactName').value.trim();
    if (name === '') {
        showFieldError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('nameError', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('contactEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        showFieldError('emailError', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    const subject = document.getElementById('contactSubject').value.trim();
    if (subject === '') {
        showFieldError('subjectError', 'Subject is required');
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('contactMessage').value.trim();
    if (message === '') {
        showFieldError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showFieldError('messageError', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function showFormSuccess() {
    // Create and show success message
    const form = document.getElementById('contactForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = 'background-color: #e8f5e8; color: #333; padding: 16px; border-radius: 8px; margin-top: 16px; border: 1px solid #28a745;';
    successDiv.textContent = 'Thank you for your message! We will get back to you within 24 hours.';
    
    // Insert after form
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

function handleFileSelect(file) {
    console.log('Handling file select:', file.name, file.type, file.size);
    
    // Validate file
    if (!validateFile(file)) {
        console.log('File validation failed');
        return;
    }

    selectedFile = file;
    console.log('File accepted, updating UI');
    
    // Show selected file info
    showSelectedFile(file);

    // Load image for editing
    if (file.type.startsWith('image/')) {
        console.log('Loading image file');
        loadImageFile(file);
    }

    updateNavigation();
}

function showSelectedFile(file) {
    const fileNameSpan = document.getElementById('fileName');
    const selectedFileDiv = document.getElementById('selectedFile');
    const uploadAreaDiv = document.getElementById('uploadArea');
    
    if (fileNameSpan) {
        fileNameSpan.textContent = file.name;
    }
    if (selectedFileDiv) {
        selectedFileDiv.classList.remove('hidden');
    }
    if (uploadAreaDiv) {
        uploadAreaDiv.style.display = 'none';
    }
    
    console.log('File UI updated');
}

function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            console.log('Image loaded successfully');
            originalImage = img;
            loadImageToCanvas();
        };
        img.onerror = function() {
            console.error('Failed to load image');
            alert('Failed to load image. Please try a different file.');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        console.error('Failed to read file');
        alert('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
}

function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (file.size > maxSize) {
        alert('File size exceeds 10MB limit');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG) or PDF document');
        return false;
    }

    return true;
}

function loadImageToCanvas() {
    console.log('Loading image to canvas');
    if (!originalImage || !canvas || !ctx) {
        console.error('Missing originalImage, canvas, or context');
        return;
    }

    const maxWidth = 600;
    const maxHeight = 400;
    
    let { width, height } = originalImage;
    
    // Calculate display size while maintaining aspect ratio
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
    }

    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(originalImage, 0, 0, width, height);
    
    // Store original image data
    imageData = ctx.getImageData(0, 0, width, height);
    zoomLevel = 1;
    
    console.log('Image loaded to canvas successfully');
}

function goToStep(step) {
    console.log('Going to step:', step, 'Current step:', currentStep);
    
    if (step < 1 || step > 3) {
        console.log('Invalid step number');
        return;
    }
    
    if (step > getMaxAvailableStep()) {
        console.log('Step not available yet, max available:', getMaxAvailableStep());
        return;
    }

    // Hide all step contents
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
    });

    // Hide all step indicators
    const stepIndicators = document.querySelectorAll('.step');
    stepIndicators.forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    // Show target step content
    const targetStepContent = document.getElementById(`step${step}`);
    if (targetStepContent) {
        targetStepContent.classList.remove('hidden');
        targetStepContent.classList.add('active');
        console.log('Step content updated');
    } else {
        console.error('Target step content not found:', `step${step}`);
    }

    // Show target step indicator
    const targetStepIndicator = document.querySelector(`[data-step="${step}"]`);
    if (targetStepIndicator) {
        targetStepIndicator.classList.add('active');
        console.log('Step indicator updated');
    } else {
        console.error('Target step indicator not found');
    }

    currentStep = step;
    console.log('Current step updated to:', currentStep);
    updateNavigation();
}

function getMaxAvailableStep() {
    if (!selectedFile) return 1;
    return 3; // Once file is selected, all steps are available
}

function updateNavigation() {
    console.log('Updating navigation for step:', currentStep);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Show/hide previous button
    if (prevBtn) {
        if (currentStep > 1) {
            prevBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.add('hidden');
        }
    }
    
    // Show/hide next button
    if (nextBtn) {
        if (currentStep === 1) {
            if (selectedFile) {
                nextBtn.classList.remove('hidden');
            } else {
                nextBtn.classList.add('hidden');
            }
        } else if (currentStep === 2) {
            nextBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.add('hidden');
        }
    }
    
    console.log('Navigation updated');
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    currentTab = tabName;
    
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }

    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
    });
    const activeTabContent = document.getElementById(`${tabName}-tab`);
    if (activeTabContent) {
        activeTabContent.classList.remove('hidden');
        activeTabContent.classList.add('active');
    }

    // Select first option in new tab
    const firstOption = document.querySelector(`#${tabName}-tab .option-card`);
    if (firstOption) {
        selectRequirement(firstOption.dataset.req);
    }
    
    console.log('Tab switched successfully');
}

function selectRequirement(reqName) {
    console.log('Selecting requirement:', reqName);
    currentRequirement = reqName;
    
    // Update option cards in current tab
    const currentTabContent = document.getElementById(`${currentTab}-tab`);
    if (currentTabContent) {
        const cards = currentTabContent.querySelectorAll('.option-card');
        cards.forEach(card => {
            card.classList.remove('active');
        });
        const selectedCard = currentTabContent.querySelector(`[data-req="${reqName}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
    }

    // Update format radio based on requirement
    const req = requirements[reqName];
    if (req) {
        const formatRadio = document.querySelector(`input[name="format"][value="${req.format}"]`);
        if (formatRadio) {
            formatRadio.checked = true;
        }
    }
    
    console.log('Requirement selected successfully');
}

function updateFormat() {
    console.log('Format updated');
}

function enableCropMode() {
    console.log('Enabling crop mode');
    cropMode = true;
    const enableBtn = document.getElementById('enableCrop');
    const applyBtn = document.getElementById('applyCrop');
    const cropControls = document.getElementById('cropControls');
    
    if (enableBtn) enableBtn.classList.add('hidden');
    if (applyBtn) applyBtn.classList.remove('hidden');
    if (cropControls) cropControls.classList.remove('hidden');
    
    createCropBox();
}

function createCropBox() {
    console.log('Creating crop box');
    cropBox = document.getElementById('cropBox');
    if (!cropBox) return;
    
    cropBox.style.left = '20%';
    cropBox.style.top = '20%';
    cropBox.style.width = '60%';
    cropBox.style.height = '60%';
    
    // Simple drag functionality
    let isDragging = false;
    let startX, startY;
    
    cropBox.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = cropBox.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const container = cropBox.parentElement;
        const containerRect = container.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - startX;
        const newY = e.clientY - containerRect.top - startY;
        
        const maxX = container.clientWidth - cropBox.clientWidth;
        const maxY = container.clientHeight - cropBox.clientHeight;
        
        cropBox.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        cropBox.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
}

function applyCrop() {
    console.log('Applying crop');
    cropMode = false;
    
    const enableBtn = document.getElementById('enableCrop');
    const applyBtn = document.getElementById('applyCrop');
    const cropControls = document.getElementById('cropControls');
    
    if (enableBtn) enableBtn.classList.remove('hidden');
    if (applyBtn) applyBtn.classList.add('hidden');
    if (cropControls) cropControls.classList.add('hidden');
}

function zoom(factor) {
    console.log('Zooming by factor:', factor);
    zoomLevel *= factor;
    zoomLevel = Math.max(0.1, Math.min(5, zoomLevel));
    
    if (originalImage && canvas && ctx) {
        const width = originalImage.width * zoomLevel * 0.5;
        const height = originalImage.height * zoomLevel * 0.5;
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(originalImage, 0, 0, width, height);
        
        imageData = ctx.getImageData(0, 0, width, height);
        applyFilters();
    }
}

function resetImage() {
    console.log('Resetting image');
    zoomLevel = 1;
    brightness = 0;
    contrast = 100;
    
    const brightnessRange = document.getElementById('brightnessRange');
    const contrastRange = document.getElementById('contrastRange');
    const brightnessValue = document.getElementById('brightnessValue');
    const contrastValue = document.getElementById('contrastValue');
    
    if (brightnessRange) brightnessRange.value = 0;
    if (contrastRange) contrastRange.value = 100;
    if (brightnessValue) brightnessValue.textContent = '0';
    if (contrastValue) contrastValue.textContent = '100%';
    
    loadImageToCanvas();
}

function applyFilters() {
    if (!imageData || !ctx) return;
    
    const data = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );
    
    // Apply brightness and contrast
    for (let i = 0; i < data.data.length; i += 4) {
        // Apply contrast
        data.data[i] = ((data.data[i] - 128) * (contrast / 100)) + 128;
        data.data[i + 1] = ((data.data[i + 1] - 128) * (contrast / 100)) + 128;
        data.data[i + 2] = ((data.data[i + 2] - 128) * (contrast / 100)) + 128;
        
        // Apply brightness
        data.data[i] = Math.max(0, Math.min(255, data.data[i] + brightness));
        data.data[i + 1] = Math.max(0, Math.min(255, data.data[i + 1] + brightness));
        data.data[i + 2] = Math.max(0, Math.min(255, data.data[i + 2] + brightness));
    }
    
    ctx.putImageData(data, 0, 0);
}

function downloadImage() {
    console.log('Downloading image');
    if (!canvas) {
        alert('No image to download');
        return;
    }
    
    const req = requirements[currentRequirement];
    const qualityRange = document.getElementById('qualityRange');
    const quality = qualityRange ? parseFloat(qualityRange.value) : 0.8;
    const formatInput = document.querySelector('input[name="format"]:checked');
    const format = formatInput ? formatInput.value : 'jpeg';
    
    // Create final canvas with target dimensions
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    
    finalCanvas.width = req.width;
    finalCanvas.height = req.height;
    
    // Draw resized image
    finalCtx.drawImage(canvas, 0, 0, req.width, req.height);
    
    // Download
    downloadAsImage(finalCanvas, format, quality);
}

function downloadAsImage(canvas, format, quality) {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    
    canvas.toBlob(function(blob) {
        if (!blob) {
            alert('Failed to create image');
            return;
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized-${currentRequirement}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Image downloaded successfully');
    }, mimeType, quality);
}

function switchLanguage(lang) {
    console.log('Switching language to:', lang);
    currentLanguage = lang;
    
    // Update language buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    const activeLangBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (activeLangBtn) {
        activeLangBtn.classList.add('active');
    }
    
    updateLanguage();
}

function updateLanguage() {
    const lang = languages[currentLanguage];
    if (!lang) return;
    
    // Update main content
    const mainTitle = document.getElementById('main-title');
    const mainSubtitle = document.getElementById('main-subtitle');
    
    if (mainTitle) mainTitle.textContent = lang.title;
    if (mainSubtitle) mainSubtitle.textContent = lang.subtitle;
    
    // Update step labels
    lang.steps.forEach((stepLabel, index) => {
        const stepLabelEl = document.getElementById(`step-${index + 1}-label`);
        if (stepLabelEl) {
            stepLabelEl.textContent = stepLabel;
        }
    });
    
    // Update upload section
    const dropText = document.getElementById('drop-text');
    const selectFileText = document.getElementById('select-file-text');
    const maxSizeText = document.getElementById('max-size-text');
    
    if (dropText) dropText.textContent = lang.dropText;
    if (selectFileText) selectFileText.textContent = lang.selectFile;
    if (maxSizeText) maxSizeText.textContent = lang.maxSize;
    
    // Update navigation
    const previousText = document.getElementById('previous-text');
    const nextText = document.getElementById('next-text');
    const downloadText = document.getElementById('download-text');
    
    if (previousText) previousText.textContent = lang.previous;
    if (nextText) nextText.textContent = lang.next;
    if (downloadText) downloadText.textContent = lang.download;
    
    console.log('Language updated successfully');
}