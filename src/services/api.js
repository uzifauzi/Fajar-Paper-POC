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
    const webhookUrl = 'https://api-officeless-dev.mekari.com/28086/send_picture_to_aws';

    const payload = {
        file_url: fileUrl,
        file_name: fileName,
        created_date: new Date().toISOString()
    };

    const response = await fetch(webhookUrl, {
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

    return result;
}
