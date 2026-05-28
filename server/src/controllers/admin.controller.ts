import { Request, Response } from 'express'
import { uploadImage, deleteImage } from '../services/cloudinary.service'

export async function uploadProductImage(req: Request, res: Response) {
  try {
    const { image, folder } = req.body

    if (!image) {
      return res.status(400).json({ error: 'Imagen requerida' })
    }

    const result = await uploadImage(image, folder || 'stavjeans/products')
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Error al subir imagen' })
  }
}

export async function removeImage(req: Request, res: Response) {
  try {
    const { publicId } = req.body

    if (!publicId) {
      return res.status(400).json({ error: 'publicId requerido' })
    }

    await deleteImage(publicId)
    res.json({ message: 'Imagen eliminada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar imagen' })
  }
}
