const router = require('express').Router();

const {
    addComplaint,
    updateComplaint,
    listComplaintsByUser,
    listComplaintById,
    deleteComplaint,
    getComplaintsOverTime,
    getComplaintsByCategory,
    getAverageResolutionTime,
    getComplaintPriorityDistribution,
    getTopComplaintGenerators,
    getComplaintsByUserType,
    getMonthlyQuarterlyComparison,
    getResolutionRate,
    getComplaintsByLocation
  } = require('../controllers/complaintController');

const verify = require('../JWT_Auth/verify');

// Complaint routes
router.post('/addComplaint', verify, addComplaint);
router.get('/complaints', verify, listComplaintsByUser);
router.get('/complaint/:id', verify, listComplaintById);
router.put('/updateComplaint/:id', verify, updateComplaint);
router.delete('/delete/:id', verify, deleteComplaint);
router.get('/complaintsovertime', getComplaintsOverTime);
router.get('/category', getComplaintsByCategory);
// router.get('/avgrestime', getAverageResolutionTime);
router.get('/avgrestime', getComplaintsByUserType);


module.exports = router;
