const Role = require('../models/role.model');

class RoleService {
    static async getAllRoles() {
        return await Role.find();
    }

    static async getRoleById({ id }) {
        return await Role.findById(id);
    }

    static async createRole({ name, permissions, sections }) {
        if (!name) {
            throw new Error('Role name is required');
        }
        const role = new Role({ name, permissions, sections });
        return await role.save();
    }

    static async updateRole({ id, permissions, sections }) {
        return await Role.findByIdAndUpdate(id, { permissions, sections }, { new: true });
    }

    static async getPermissionsByRoleId({ roleId }) {
        const role = await Role.findById(roleId).select('permissions');
        if (!role) {
            throw new Error('Role not found');
        }
        return role.permissions;
    }
}

module.exports = RoleService;