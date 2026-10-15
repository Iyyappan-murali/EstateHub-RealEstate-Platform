import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service';
import {
  createPropertySchema,
  updatePropertySchema,
  propertySearchSchema,
} from '../validators/property.validator';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../middleware/error.middleware';

export class PropertyController {
  static async getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = propertySearchSchema.parse(req.query);
      const result = await PropertyService.getProperties(filters);
      res.status(200).json({
        success: true,
        data: result.properties,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const property = await PropertyService.getPropertyById(id);
      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSimilarProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4;
      const similar = await PropertyService.getSimilarProperties(id, limit);
      res.status(200).json({
        success: true,
        data: similar,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProperty(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      // If files were uploaded via multipart/form-data
      let uploadedImageUrls: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        uploadedImageUrls = (req.files as Express.Multer.File[]).map(
          (file) => `/uploads/${file.filename}`
        );
      }

      const bodyData = { ...req.body };
      if (uploadedImageUrls.length > 0) {
        const existingImages = bodyData.images ? (Array.isArray(bodyData.images) ? bodyData.images : [bodyData.images]) : [];
        bodyData.images = [...existingImages, ...uploadedImageUrls];
      }

      const validated = createPropertySchema.parse(bodyData);
      const property = await PropertyService.createProperty(req.user.id, validated);

      res.status(201).json({
        success: true,
        message: 'Property listing created successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProperty(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;

      let uploadedImageUrls: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        uploadedImageUrls = (req.files as Express.Multer.File[]).map(
          (file) => `/uploads/${file.filename}`
        );
      }

      const bodyData = { ...req.body };
      if (uploadedImageUrls.length > 0) {
        const existingImages = bodyData.images ? (Array.isArray(bodyData.images) ? bodyData.images : [bodyData.images]) : [];
        bodyData.images = [...existingImages, ...uploadedImageUrls];
      }

      const validated = updatePropertySchema.parse(bodyData);
      const property = await PropertyService.updateProperty(id, req.user.id, validated);

      res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProperty(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      const result = await PropertyService.deleteProperty(id, req.user.id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserListings(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const listings = await PropertyService.getUserListings(req.user.id);
      res.status(200).json({
        success: true,
        data: listings,
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new AppError('No image files uploaded', 400);
      }

      const urls = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: { urls },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cities = await PropertyService.getFeaturedCities();
      res.status(200).json({
        success: true,
        data: cities,
      });
    } catch (error) {
      next(error);
    }
  }
}
