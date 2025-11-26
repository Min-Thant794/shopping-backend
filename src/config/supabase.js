const supabase = require("@supabase/supabase-js");
const config = require("./config");

const supabaseClient = supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE
);

const uploadImage = async (file) => {
    try {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileStorage = supabaseClient.storage.from(config.SUPABASE_BUCKET);

        const { data, error } = await fileStorage.upload(
            fileName,
            file.buffer,
            {
                contentType: file.mimetype,
                upsert: true
            }
        );

        if (error) {
            console.log("Failed to upload image to Supabase!", error);
            throw error;
        }

        const { data: publicUrl } = fileStorage.getPublicUrl(fileName);

        console.log("Public Url:", publicUrl.publicUrl);
        return publicUrl.publicUrl;

    } catch (error) {
        console.log("Upload Image Error:", error);
        throw error;
    }
}

module.exports = { uploadImage };