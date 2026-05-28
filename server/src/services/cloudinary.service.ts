import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(base64Image: string, folder: string = 'stavjeans/products') {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    transformation: [
      { width: 800, height: 1000, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  })
  return { url: result.secure_url, public_id: result.public_id }
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}
