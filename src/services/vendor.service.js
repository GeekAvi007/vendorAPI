const prisma = require("../lib/prisma.js");
const AppError = require("../utils/AppError");

async function createVendor({name, email, userId}) {
    
    const existingVendor = await prisma.vendor.findUnique({
        where: {
            email
        }
    });

    if(existingVendor) {
        throw new AppError(
            "Vendor already exists!",
            409,
            "VENDOR_EMAIL_ALREADY_EXISTS"
        );
    }

    const vendor = await prisma.vendor.create({
        data: {
            name,email,userId
        }
    });

    return vendor;
}

async function getVendor(userId) {
    
    return prisma.vendor.findMany({
        where : {
            userId
        },
        orderBy : {
            createdAt : "desc"
        }
    });
}

async function getVendorById({vendorId, userId}) {
    
    const vendor = await prisma.vendor.findFirst({
        where: {
        id: vendorId, 
        userId
        }
    });

    if(!vendor){
        throw new AppError(
            "Vendor not found!", 404,"VENDOR_NOT_FOUND"
        );
    }
    return vendor;
}


async function updateVendor({
    vendorId,userId,name, email
}) {
    const vendor = await prisma.vendor.findFirst({
        where: {
            id: vendorId,
            userId
        }
    });

    if(!vendor){
        throw new AppError(
            "Vendor not found!",
            404, "VENDOR_NOT_FOUND"
        )
    }

    if(email !== undefined && email !== vendor.email){

        const existingVendor = await prisma.vendor.findUnique({
            where: {
                email
            }
        })
        if(existingVendor){
            throw new AppError("Vendor already exists!", 409,"VENDOR_ALREADY_EXISTS")
        }
    }

    const updatedVendor = await prisma.vendor.update({
        where: {
            id: vendorId
        },
        data : {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
        }
    })
    
}

async function deleteVendor({vendorId, userId}) {
    
    const vendor = await prisma.vendor.findFirst({
        where: {
            id: vendorId,
            userId
        }
    });
    if(!vendor){
        throw new AppError("Vendor Not found!",404, "VENDOR_NOT_FOUND")
    };

    await prisma.vendor.delete({
        where: {
            id: vendorId
        }
    })
    return vendor;
}

module.exports = {
    createVendor, getVendor,getVendorById, updateVendor,deleteVendor
}