import cloudinary from "../config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";

export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Image upload failed."));
          }

          resolve(result);
        },
      )
      .end(fileBuffer);
  });
};

export const deleteImage = async (publicId: string) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};
