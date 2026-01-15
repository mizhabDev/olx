import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import type { Express } from "express";
import Multer from "multer";



const uploadToCloudinary = (file: Express.Multer.File) => {
  console.log("buffer length:", file.buffer.length);
  console.log("file is uploading from uploadToCloudinary function ", file);
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default uploadToCloudinary;
