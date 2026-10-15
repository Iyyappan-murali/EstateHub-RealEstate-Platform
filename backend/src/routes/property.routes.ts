import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { uploadImages } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', PropertyController.getProperties);
router.get('/featured-cities', PropertyController.getFeaturedCities);
router.get('/my-listings', requireAuth, PropertyController.getUserListings);
router.get('/:id', PropertyController.getPropertyById);
router.get('/:id/similar', PropertyController.getSimilarProperties);

// Protected routes (Listing Owners)
router.post('/', requireAuth, uploadImages.array('images', 10), PropertyController.createProperty);
router.put('/:id', requireAuth, uploadImages.array('images', 10), PropertyController.updateProperty);
router.delete('/:id', requireAuth, PropertyController.deleteProperty);
router.post('/upload', requireAuth, uploadImages.array('images', 10), PropertyController.uploadImages);

export default router;
