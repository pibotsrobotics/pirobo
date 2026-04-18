import BaseService from './baseService';

// Initialize services with collection names
export const courseService = new BaseService('courses');
export const eventService = new BaseService('events');
export const galleryService = new BaseService('gallery');
export const enquiryService = new BaseService('enquiries');
export const registrationService = new BaseService('registrations');
export const teamService = new BaseService('team');
export { default as uploadService } from './uploadService';

