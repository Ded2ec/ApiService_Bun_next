const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


export const DeviceController = {
  create: async ({ body }: { body: { 
    name: string;
     barcode: string;
      serial: string;
       expireDate: string;
        remark: string;
         } }) => {
    try {
         await prisma.device.create({
            data: body
        })
        return { message: "Device created successfully" };
    } catch (error) {
        return { message: "Failed to create device", error };
    }
    },


list: async ( { query }:{ query:  {
        page: string;
        pageSize: string;
    }}) => {
    
    try {
        const page = parseInt(query.page);
        const pageSize = parseInt(query.pageSize);
        const total = await prisma.device.count({
            where:{
                status:'active'
            }
        });
        const totalPage = Math.ceil(total/pageSize)
        const devices = await prisma.device.findMany({
            where:{
                status:'active'
            },
            orderBy:{
                id:'desc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });
        return { results: devices, total, totalPage };
    } catch (error) {
        return { message: "Failed to list devices", error };
    }
},

update: async ({ body ,params}: {
    body: { 
    name: string;
     barcode: string;
      serial: string;
       expireDate: string;
        remark: string;
         },
        params: 
        { id: string
         }
        }) => {
    try {
        await prisma.device.update({
            where: { id: parseInt(params.id) },
            data: body
        })
        return { message: "Device updated successfully" };
    } catch (error) {
        return { message: "Failed to update device", error };
    }
},

remove: async ({ params }: {
     params: { 
        id: string;
     } }) => 
        {
    try {
        await prisma.device.update({
            where: { id: parseInt(params.id) },
            data: { status: 'inactive' }
        })
        return { message: "Device removed successfully" };
    } catch (error) {
        return { message: "Failed to remove device", error };
    }
}
}