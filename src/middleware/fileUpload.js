import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Function to configure file upload with Multer
const fileMulter = (destination, filterType, maxFileSizeMB) => {

    // Filter function to allow only specific MIME types
    const fileFilter = (req, file, cb) => {
        if (filterType.some(type => file.mimetype.startsWith(type))) {
            console.log("File accepted by filter"); // Log accepted file
            cb(null, true); // Accept the file
        } else {
            console.log("File rejected by filter"); // Log rejected file
            cb(null, false); // Reject the file
        }
    };

    // Storage configuration for Multer
    const storage = multer.diskStorage({
        // Set destination folder for uploaded files
        destination: (req, file, cb) => {
            cb(null, destination); // Use provided destination
        },
        // Set the filename for uploaded files
        filename: (req, file, cb) => {
            const uniqueFilename = uuidv4() + '-' + file.originalname; // Generate unique filename
            cb(null, uniqueFilename); // Use the unique filename
        }
    });

    // Return a Multer instance with the specified storage and file filter
    return multer({ 
        storage,
        fileFilter,
        limits: { fileSize: maxFileSizeMB * 1024 * 1024 } // Convert MB to bytes
    });
};

// Middleware for single file upload
export const uploadSingleFile = (fieldName, destination, filterType) => {
    return fileMulter(destination, filterType, 1).single(fieldName); // Set max file size to 1 MB
};

// Middleware for multiple file uploads
export const uploadMixFile = (fieldName, destination, filterType, maxFileSizeMB, maxCount) => {
    return fileMulter(destination, filterType, maxFileSizeMB).array(fieldName, maxCount); // Set max file size and count
};

// Middleware for multiple fields with multiple file uploads
export const uploadMixOfFile = (arrayOfFields, destination, filterType, maxFileSizeMB) => {
    return fileMulter(destination, filterType, maxFileSizeMB).fields(arrayOfFields); // Handle multiple file fields
};
