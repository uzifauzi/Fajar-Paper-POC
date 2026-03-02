import { supabase } from '../lib/supabase';

/**
 * Uploads a file to Supabase storage and returns the public URL.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export async function uploadFileToSupabase(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const bucketName = 'user-documents';

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error(`Supabase Error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
}

/**
 * Sends the public URL to the Mekari webhook endpoint.
 * @param {string} fileUrl 
 * @param {string} fileName 
 */
export async function triggerWorkflow(fileUrl, fileName) {
    const officelessUrl = 'https://api-officeless-dev.mekari.com/28086/send_picture_to_aws';

    const payload = {
        file_url: fileUrl,
        file_name: fileName,
        created_date: new Date().toISOString()
    };

    const response = await fetch(officelessUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Webhook Error: ${response.statusText}`);
    }

    // Handle cases where response might be empty or not JSON
    let result = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
    } else {
        result = await response.text();
    }

    console.log("Webhook API Response:", result);

    return result;
}

/**
 * Extracts data from a PDF using the OCR API.
 * @param {File} file The PDF file to extract data from.
 * @returns {Promise<Object>} The extracted metadata and document classification.
 */
export async function extractPdfOcr(file) {
    // We use the Vite proxy to bypass CORS
    const apiUrl = '/api/ocr/Prod/extract-pdf';
    const apiKey = import.meta.env.VITE_OCR_API_KEY;

    if (!apiKey) {
        throw new Error("OCR API Key is missing. Please check your .env file.");
    }

    // Read the file as an ArrayBuffer to send pure binary data
    // This perfectly mimics the `--data-binary` in the cURL command
    const fileBuffer = await file.arrayBuffer();

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/pdf',
            'x-api-key': apiKey
        },
        body: fileBuffer
    });

    if (!response.ok) {
        let errorMessage = `OCR API Error: ${response.status} ${response.statusText}`;
        try {
            const errorBody = await response.json();
            if (errorBody.error) {
                errorMessage = `OCR API Error: ${errorBody.error}`;
            }
        } catch (e) {
            // Response body is not JSON
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}
