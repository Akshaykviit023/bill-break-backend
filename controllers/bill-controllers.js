import Bill from "../models/Bill.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { generateUniqueOrganizationId } from "../utils/uniqueId-generator.js";


export const fetchMembers = async (req, res, next) => {
    const { groupId } = req.body;

    try {
        const group = await Organization.findById(groupId.toString());
        const members = group.members;

        if(!group){
            return res.status(404).json({ message: "invalid group Id"});
        }

        let memberNames = [];

        for (const member of members) {
            const memberObj = await User.findById(member);
            if (memberObj) {
                memberNames.push({
                    id: memberObj._id,
                    memberName: memberObj.name,
                });
            }
        }

        res.status(200).json(memberNames);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const addExpense = async (req, res, next) => {
    const { groupId, expenseDetails } = req.body;
    const bill = new Bill({
        title: expenseDetails.expenseDescription,
        total: expenseDetails.totalAmount,
        paidBy: expenseDetails.paidBy,
        splitAmong: expenseDetails.owers,
        organization: groupId,
        items: expenseDetails?.items,
    })
    try {
        await bill.save();
        const group = await Organization.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        group.bills.push(bill._id);
        await group.save();
        res.status(201).json({ message: "Expense added successfully", billId: bill._id });
    } catch (error) {
        console.log(error);

        // Return an error response
        res.status(500).json({ error: "An error occurred while adding the expense" });
 
    }
}

export const fetchBills = async (req, res, next) => {
    const { groupId } = req.body;

    try {
        const group = await Organization.findById(groupId);
        const bills = group.bills;
        let allBills = [];

        for (const bill of bills) {
            const billObj = await Bill.findById(bill);
            if (billObj) {
                allBills.push(billObj);
            }
        }

        res.status(200).json(allBills);

    } catch (error) {
        console.log(error);

        // Return an error response
        res.status(500).json({ error: "An error occurred while fetching bills" });
    }
}

export const fetchPaidBy = async (req, res) => {
    const { userId } = req.body;

    try {
        const userObj = await User.findById(userId);
        const userName = userObj.name;

        res.status(200).json(userName);
    } catch (error) {
        console.log(error);

        // Return an error response
        res.status(500).json({ error: "An error occurred while fetching userName" });
    }

}
