const { createVendor, getVendor, getVendorById,updateVendor,deleteVendor  } = require("../services/vendor.service.js")



const AppError = require("../utils/AppError.js");

async function create(req, res, next) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            throw new AppError(
                "Name and email are required!", 400, "VALIDATION_ERROR"
            );
        }

        const vendor = await createVendor({
            name, email, userId: req.user.id
        })

        return res.status(201).json({
            message: "Vendor created successfully!", vendor
        })
    } catch (error) {
        next(error);
    }
}

async function getAll(req, res, next) {

    try {
        const vendors = await getVendor(req.user.id);

        return res.status(200).json({ vendors })
    } catch (error) {
        next(error)
    }
}

async function getOne(req, res, next) {
    try {
        const vendorId = Number(req.params.id)

        if (!Number.isInteger(vendorId)) {
            throw new AppError(
                "Invalid Vendor ID", 400, "INVALID_VENDOR_ID"
            );
        }

        const vendor = await getVendorById({
            vendorId,
            userId: req.user.id
        });
        return res.status(200).json({
            vendor
        })
    } catch (error) {
        next(error)
    }
}

async function update(req, res, next) {
    try {

        const vendorId = Number(req.params.id)

        if (!Number.isInteger(vendorId)) {
            throw new AppError("Invalid Vendor ID", 400, "INVALID_VENDOR_ID")
        }

        const { name, email } = req.body;

        if (name == undefined && email == undefined) {
            throw new AppError(

                "At least one field is required",

                400,

                "VALIDATION_ERROR"

            );

        }

        const vendor = await updateVendor({

            vendorId,

            userId: req.user.id,

            name,

            email

        });

        return res.status(200).json({

            message: "Vendor updated successfully",

            vendor

        });

    } catch (error) {

        next(error);

    }
}

async function remove(req, res,next) {
    try {
        const vendorId = Number(req.params.id);

        if(!Number.isInteger(vendorId)){
            throw new AppError("Invalid vendor ID!",400,"INVALID_VENDOR_ID")
        }

        await deleteVendor({
            vendorId,userId:req.user.id
        });

        return res.status(204).json({message: "Vendor deleted successfully!"})
    } catch (error) {
        next(error)
    }
}

module.exports = {

    create,

    getAll,

    getOne,

    update,

    remove

};