import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { generateUniqueOrganizationId } from "../utils/uniqueId-generator.js";

export const createGroup = async (req, res, next) => {
    const { name } = req.body;
    const groupId = generateUniqueOrganizationId();

    const group = new Organization({
        name,
        admin: req.user._id,
        members: [req.user._id],
        organizationId: groupId,
    })

    try {
        await group.save();
        const user = await User.findById(req.user._id);
        user.organization.push(group._id);
        await user.save();
        res.status(201).json(group);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


// controllers/group-controllers.js

export const showGroups = async (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const groups = user.organization;

        let groupName = [];

        for (const group of groups) {
            const groupObj = await Organization.findById(group);
            if (groupObj) {
                groupName.push({
                    id: groupObj._id,
                    grpName: groupObj.name,
                    grpId: groupObj.organizationId,
                });
            }
        }

        res.status(200).json(groupName);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


export const deleteGroup = async (req, res, next) => {
    const { groupId } = req.body;
    const user = req.user._id;

    try {
        const group = await Organization.findById(groupId);
        const groupAdmin = group.admin;

        if(groupAdmin.toString() !== user.toString())
            return res.status(201).json({ message: "only admin can delete this group" })

        let groupUsers = group.members;

         // Remove the group ID from all members
         await User.updateMany(
            { _id: { $in: groupUsers } },
            { $pull: { organization: groupId } }
        );


        const deletedGroup = await Organization.findByIdAndDelete(groupId);
        if (!deletedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }
        console.log("Group deleted successfully");
        return res.status(200).json({ message: "Group deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", cause: error.message });
    }
}

export const joinGroup = async (req, res, next) => {
    const { joinId } = req.body;
    try {
        const group = await Organization.findOne({
            organizationId: joinId
        })


        if(!group)
            return res.status(404).json({ message: "invalid joinId "});
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.organization.includes(group._id)) {
            return res.status(400).json({ message: "User already a member of this group" });
        }

        user.organization.push(group._id);
        group.members.push(user._id);
        await user.save();
        await group.save();
        res.status(201).json(group);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const fetchGroup = async (req, res, next) => {
    const { groupId } = req.body;

    try {
        const group = await Organization.findById(groupId.toString());

        if(!group){
            return res.status(404).json({ message: "invalid group Id"});
        }

        res.status(200).json(group);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}