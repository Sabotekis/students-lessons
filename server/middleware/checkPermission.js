const Role = require('../models/role.model');

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userRoleId = req.user.role; 
            const role = await Role.findById(userRoleId);

            if (!role || !role.permissions.includes(requiredPermission)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };
};

module.exports = checkPermission;