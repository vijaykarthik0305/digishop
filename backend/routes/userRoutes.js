import express from 'express';
import { authUser, getUserProfile, registerUser, logoutUser,getUsers,updateUser,deleteUser,getUserById} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(getUsers);
router.route('/login').post(authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/logout').post(logoutUser);
router.route('/:id').get(getUserById).put(protect,admin,  updateUser).delete(protect, admin, deleteUser);
// Admin routes
router.route('/admin').get(protect, admin); // Example for admin access
router.route('/admin/:id').delete(protect, admin); // Example for deleting user

export default router;
