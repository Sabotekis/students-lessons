const User = require('../models/users.model');
const Role = require('../models/role.model');

class UserService {
    static async getAllUsers() {
        return await User.find().populate({
            path: 'role',
            select: 'permissions',
        });
    }

    static async assignRoleToUser({ userId, roleId }) {
        const role = await Role.findById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role: roleId },
            { new: true }
        ).populate('role');
        return user;
    }
}

module.exports = UserService;